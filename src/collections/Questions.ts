import { revalidatePath } from 'next/cache'
import type {
  Access,
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload'
import { APIError } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditorFieldLevel } from '@/access/isAdminOrEditor'
import { sendQuestionAnsweredEmail } from '@/lib/resend'
import { autoSlugFrom } from '@/lib/slug'

function getLinkedExpertId(user: { linkedExpert?: unknown } | null | undefined) {
  if (!user) return undefined
  const v = user.linkedExpert
  if (typeof v === 'number') return v
  if (typeof v === 'string') return v
  if (v && typeof v === 'object' && 'id' in v) {
    return (v as { id?: number }).id
  }
  return undefined
}

const readAccess: Access = ({ req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'editor') return true
  if (user?.role === 'expert') {
    const linkedExpertId = getLinkedExpertId(user)
    if (linkedExpertId) {
      return { assignedExpert: { equals: linkedExpertId } } as never
    }
    return false
  }
  return { status: { equals: 'published' } } as never
}

const updateAccess: Access = ({ req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'editor') return true
  if (user?.role === 'expert') {
    const linkedExpertId = getLinkedExpertId(user)
    if (linkedExpertId) {
      return { assignedExpert: { equals: linkedExpertId } } as never
    }
  }
  return false
}

// An empty Lexical doc is a single paragraph with no children — treat only
// docs with real content as an answer.
function hasAnswerContent(value: unknown): boolean {
  const root = (
    value as { root?: { children?: { type?: string; children?: unknown[] }[] } } | null | undefined
  )?.root
  if (!root?.children?.length) return false
  return root.children.some(
    (node) => node.type !== 'paragraph' || (node.children?.length ?? 0) > 0,
  )
}

// Status automation:
// - assigning an expert moves a pending question to 'assigned'
// - saving a non-empty answer moves pending/assigned to 'answered'
// - publishing stamps publishedAt when it is empty
const applyStatusWorkflow: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
}) => {
  if (!data) return data
  const d = data as {
    status?: string
    assignedExpert?: unknown
    answer?: unknown
    publishedAt?: string
  }
  const prev = originalDoc as
    | { status?: string; assignedExpert?: unknown; answer?: unknown; publishedAt?: string }
    | undefined

  const status = d.status ?? prev?.status ?? 'pending'
  const assignedExpert = d.assignedExpert ?? prev?.assignedExpert
  const answer = d.answer ?? prev?.answer

  let nextStatus = status
  if (nextStatus === 'pending' && assignedExpert) nextStatus = 'assigned'
  if (
    (nextStatus === 'pending' || nextStatus === 'assigned') &&
    hasAnswerContent(answer)
  ) {
    nextStatus = 'answered'
  }
  if (nextStatus !== status) d.status = nextStatus

  if (nextStatus === 'published' && !(d.publishedAt ?? prev?.publishedAt)) {
    d.publishedAt = new Date().toISOString()
  }
  return data
}

// Experts may only move a question to 'answered'. Publishing (which fires the
// notification email) and rejecting stay with admin/editor.
const guardExpertStatusChange: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || req.user?.role !== 'expert') return data
  const prev = (originalDoc as { status?: string } | undefined)?.status
  const next = (data as { status?: string } | undefined)?.status
  if (next && next !== prev && next !== 'answered') {
    throw new APIError(
      'Uzmanlar soruyu yalnızca "Cevaplandı" durumuna alabilir.',
      403,
    )
  }
  return data
}

const notifyOnPublish: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (req?.context?.skipRevalidate) return
  const d = doc as {
    status?: string
    askerEmail?: string
    askerName?: string
    questionTitle?: string
    slug?: string
  }
  const prev = previousDoc as { status?: string } | undefined
  if (d.status === 'published' && prev?.status !== 'published') {
    try {
      revalidatePath('/sorular')
      revalidatePath('/')
      if (d.slug) revalidatePath(`/sorular/${d.slug}`)
    } catch {
      // ignore
    }

    if (d.askerEmail) {
      try {
        await sendQuestionAnsweredEmail({
          to: d.askerEmail,
          askerName: d.askerName ?? 'Anne',
          questionTitle: d.questionTitle ?? '',
          slug: d.slug ?? '',
        })
      } catch (err) {
        req.payload.logger.error({ err }, 'Q&A notification email failed')
      }
    }
  }
}

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'questionTitle',
    defaultColumns: [
      'questionTitle',
      'status',
      'assignedExpert',
      'category',
      'publishedAt',
    ],
    group: 'İçerik Yönetimi',
  },
  access: {
    create: () => true, // public via /api/soru (Turnstile guards in route)
    read: readAccess,
    update: updateAccess,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [guardExpertStatusChange, applyStatusWorkflow],
    afterChange: [notifyOnPublish],
  },
  fields: [
    {
      name: 'questionTitle',
      type: 'text',
      required: true,
      access: { update: isAdminOrEditorFieldLevel },
      admin: {
        description:
          'Listelerde görünen kısa başlık. İlk cümleden türetilebilir.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      access: { update: isAdminOrEditorFieldLevel },
      hooks: { beforeValidate: [autoSlugFrom('questionTitle')] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'questionBody',
      type: 'textarea',
      required: true,
      minLength: 50,
      maxLength: 1000,
      access: { update: isAdminOrEditorFieldLevel },
    },
    {
      name: 'askerName',
      type: 'text',
      defaultValue: 'İsimsiz Anne',
      access: { update: isAdminOrEditorFieldLevel },
    },
    {
      name: 'askerEmail',
      type: 'email',
      required: true,
      access: {
        // Field-level guard: collection `read` access only filters which
        // rows are visible, not which fields come back on those rows. The
        // generic Payload REST API would otherwise leak this on every
        // published question without this.
        read: ({ req: { user } }) =>
          user?.role === 'admin' || user?.role === 'editor',
        update: isAdminOrEditorFieldLevel,
      },
      admin: {
        description:
          'Sadece bildirim için kullanılır. Halka açık sayfada gösterilmez.',
        readOnly: false,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      access: { update: isAdminOrEditorFieldLevel },
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedExpert',
      type: 'relationship',
      relationTo: 'experts',
      access: { update: isAdminOrEditorFieldLevel },
      admin: { position: 'sidebar' },
    },
    {
      name: 'answer',
      type: 'richText',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Beklemede', value: 'pending' },
        { label: 'Atandı', value: 'assigned' },
        { label: 'Cevaplandı', value: 'answered' },
        { label: 'Yayında', value: 'published' },
        { label: 'Reddedildi', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      access: { update: isAdminOrEditorFieldLevel },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'seo',
      type: 'group',
      access: { update: isAdminOrEditorFieldLevel },
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
