import { Resend } from 'resend'

import { SITE_NAME, SITE_URL } from './utils'

let cached: Resend | null = null

function getClient(): Resend | null {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  if (!key || key.startsWith('re_mock') || key.includes('mock')) return null
  cached = new Resend(key)
  return cached
}

const FROM = process.env.RESEND_FROM ?? 'nene@nenenesor.com'

export async function sendQuestionAnsweredEmail(args: {
  to: string
  askerName: string
  questionTitle: string
  slug: string
}): Promise<void> {
  const client = getClient()
  const url = `${SITE_URL}/sorular/${args.slug}`
  const subject = "Sorduğun soruya Nene'nin uzmanından cevap geldi"
  const text = [
    `Merhaba ${args.askerName},`,
    '',
    `Sorun: "${args.questionTitle}"`,
    `Uzmanımızın cevabı yayında: ${url}`,
    '',
    '— Nene',
    `${SITE_NAME} · ${SITE_URL}`,
  ].join('\n')

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; color: #2A2520; max-width: 560px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 14px; color: #C75D3F; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 12px;">nenenesor</p>
      <h1 style="font-family: Georgia, serif; font-size: 28px; line-height: 1.2; margin: 0 0 20px;">Sorduğun soruya cevap geldi</h1>
      <p>Merhaba <strong>${args.askerName}</strong>,</p>
      <p>Yazdığın soruya uzmanlarımızdan biri cevabını yazdı:</p>
      <blockquote style="border-left: 3px solid #D4A24C; padding: 4px 0 4px 16px; margin: 16px 0; font-style: italic;">${args.questionTitle}</blockquote>
      <p>
        <a href="${url}" style="display: inline-block; background: #C75D3F; color: #FBF7F0; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">Cevabı oku</a>
      </p>
      <p style="margin-top: 32px; color: #2A2520aa; font-size: 13px;">
        Bültenimize yazılmadıysan: nene'den haftalık mektup, spam yok, sıkıcılık yok.<br>
        <a href="${SITE_URL}/bulten" style="color: #C75D3F;">Bültene katıl</a>
      </p>
      <p style="margin-top: 24px; color: #2A2520aa; font-size: 12px;">— Nene · <a href="${SITE_URL}" style="color: #C75D3F;">${SITE_URL.replace(/^https?:\/\//, '')}</a></p>
    </div>
  `

  if (!client) {
    console.log('[resend:dev] Email skipped (RESEND_API_KEY unset).')
    console.log(`  to: ${args.to}`)
    console.log(`  subject: ${subject}`)
    console.log(`  url: ${url}`)
    return
  }

  await client.emails.send({
    from: FROM,
    to: args.to,
    subject,
    text,
    html,
  })
}

export async function sendNewsletterWelcomeEmail(args: {
  to: string
}): Promise<void> {
  const client = getClient()
  const subject = "Hoş geldin — Nene'den ilk mektup"
  if (!client) {
    console.log('[resend:dev] Newsletter welcome email skipped.')
    console.log(`  to: ${args.to}`)
    return
  }
  await client.emails.send({
    from: FROM,
    to: args.to,
    subject,
    text: `Merhaba,\n\nBülten ailesine hoş geldin. Haftada bir, nene'den mektup.\n\n— Nene`,
    html: `<div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #2A2520;">
      <p style="font-size: 14px; color: #C75D3F; letter-spacing: 0.2em; text-transform: uppercase;">nenenesor</p>
      <h1 style="font-family: Georgia, serif; font-size: 28px;">Hoş geldin.</h1>
      <p>Bülten ailesine katıldığın için teşekkürler. Haftada bir kez, sana nene'den mektup geleceği.</p>
      <p>Spam yok, sıkıcılık yok. Söz.</p>
      <p style="margin-top: 32px;">— Nene</p>
    </div>`,
  })
}
