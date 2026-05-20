import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { subscribeToNewsletter } from '@/lib/mailerlite'
import { sendNewsletterWelcomeEmail } from '@/lib/resend'

const Body = z.object({
  email: z.string().email(),
  name: z.string().trim().max(80).optional(),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>
  try {
    body = Body.parse(await req.json())
  } catch (err) {
    return NextResponse.json(
      { ok: false, reason: 'invalid_input', issues: (err as z.ZodError).issues },
      { status: 400 },
    )
  }

  const result = await subscribeToNewsletter(body)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, reason: result.reason ?? 'newsletter_failed' },
      { status: 500 },
    )
  }

  // Best-effort welcome email — failure here doesn't fail the request
  void sendNewsletterWelcomeEmail({ to: body.email }).catch(() => undefined)

  return NextResponse.json({ ok: true })
}
