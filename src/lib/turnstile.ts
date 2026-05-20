/**
 * Verify a Cloudflare Turnstile token server-side.
 * In dev, if TURNSTILE_SECRET_KEY is unset, verification is skipped.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, reason: 'turnstile_not_configured' }
    }
    return { ok: true }
  }
  if (!token) return { ok: false, reason: 'missing_token' }

  const body = new URLSearchParams()
  body.append('secret', secret)
  body.append('response', token)
  if (remoteIp) body.append('remoteip', remoteIp)

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body },
    )
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }
    if (data.success) return { ok: true }
    return { ok: false, reason: data['error-codes']?.join(',') ?? 'verification_failed' }
  } catch {
    return { ok: false, reason: 'network_error' }
  }
}
