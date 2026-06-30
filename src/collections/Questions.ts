import { revalidatePath } from 'next/cache'
import type {
  Access,
  CollectionAfterChangeHook,
  CollectionConfig,
} from 'payload'

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
  },
  access: {
    create: () => true, // public via /api/soru (Turnstile guards in route)
    read: readAccess,
    update: updateAccess,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    afterChange: [notifyOnPublish],
  },
  fields: [
    {
      name: 'questionTitle',
      type: 'text',
      required: true,
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
      hooks: { beforeValidate: [autoSlugFrom('questionTitle')] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'questionBody',
      type: 'textarea',
      required: true,
      minLength: 50,
      maxLength: 1000,
    },
    {
      name: 'askerName',
      type: 'text',
      defaultValue: 'İsimsiz Anne',
    },
    {
      name: 'askerEmail',
      type: 'email',
      required: true,
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedExpert',
      type: 'relationship',
      relationTo: 'experts',
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
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
