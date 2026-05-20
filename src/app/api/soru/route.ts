import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { getPayload } from '@/lib/payload'
import { slugify } from '@/lib/slug'
import { verifyTurnstileToken } from '@/lib/turnstile'

const Body = z.object({
  name: z.string().trim().max(80).optional().default(''),
  email: z.string().email(),
  category: z.string().optional(),
  question: z.string().trim().min(50).max(1000),
  kvkk: z.literal(true),
  turnstileToken: z.string().optional(),
})

function deriveTitle(question: string): string {
  const firstSentence = question.split(/[.?!]\s/)[0]?.trim() || question
  return firstSentence.length > 80
    ? `${firstSentence.slice(0, 77).trim()}...`
    : firstSentence
}

export async function POST(req: NextRequest) {
  let payload: z.infer<typeof Body>
  try {
    payload = Body.parse(await req.json())
  } catch (err) {
    return NextResponse.json(
      { ok: false, reason: 'invalid_input', issues: (err as z.ZodError).issues },
      { status: 400 },
    )
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    undefined

  const verify = await verifyTurnstileToken(payload.turnstileToken, ip)
  if (!verify.ok) {
    return NextResponse.json(
      { ok: false, reason: verify.reason ?? 'captcha_failed' },
      { status: 400 },
    )
  }

  const cms = await getPayload()

  let categoryId: number | undefined
  if (payload.category) {
    const catRes = await cms.find({
      collection: 'categories',
      where: { slug: { equals: payload.category } },
      limit: 1,
    })
    const found = catRes.docs[0] as unknown as { id: number } | undefined
    if (found) categoryId = found.id
  }

  const title = deriveTitle(payload.question)
  const baseSlug = slugify(title)
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`
  const askerName = payload.name?.trim() || 'İsimsiz Anne'

  try {
    await cms.create({
      collection: 'questions',
      data: {
        questionTitle: title,
        slug: uniqueSlug,
        questionBody: payload.question,
        askerName,
        askerEmail: payload.email,
        category: categoryId,
        status: 'pending',
      },
    })
  } catch (err) {
    cms.logger.error({ err }, 'Failed to create Question from /api/soru')
    return NextResponse.json(
      { ok: false, reason: 'server_error' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
