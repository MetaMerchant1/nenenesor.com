'use client'

import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Schema = z.object({
  email: z.string().email('Geçerli bir e-posta gir.'),
  name: z.string().trim().max(80).optional(),
})

type FormValues = z.infer<typeof Schema>

interface NewsletterFormProps {
  variant?: 'inline' | 'block'
  withName?: boolean
}

export function NewsletterForm({
  variant = 'inline',
  withName = false,
}: NewsletterFormProps) {
  const id = useId()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { email: '', name: '' } })
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function onSubmit(values: FormValues) {
    setState('submitting')
    setErrorMessage(null)
    try {
      const parsed = Schema.parse(values)
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })
      const data = (await res.json()) as { ok: boolean; reason?: string }
      if (!res.ok || !data.ok) {
        setState('error')
        setErrorMessage('Bir aksaklık oldu. Birazdan tekrar dene.')
        return
      }
      setState('success')
      reset()
    } catch (err) {
      setState('error')
      setErrorMessage(
        err instanceof z.ZodError
          ? err.issues[0]?.message ?? 'Form geçerli değil.'
          : 'Bir aksaklık oldu.',
      )
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-md border border-nene-sage/30 bg-nene-sage/10 px-4 py-3 text-sm text-nene-ink">
        Hoş geldin. İlk mektup yakında postada.
      </div>
    )
  }

  const isBlock = variant === 'block'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={
        isBlock
          ? 'flex flex-col gap-3'
          : 'flex flex-col gap-3 sm:flex-row sm:items-start'
      }
    >
      {withName ? (
        <div className={isBlock ? '' : 'sm:w-40'}>
          <input
            {...register('name')}
            id={`${id}-name`}
            type="text"
            placeholder="Adın (isteğe bağlı)"
            maxLength={80}
            className="w-full rounded-md border border-nene-ink/15 bg-nene-cream px-3 py-2.5 text-sm focus:border-nene-rust focus:outline-none focus:ring-2 focus:ring-nene-rust/20"
          />
        </div>
      ) : null}

      <div className={isBlock ? '' : 'flex-1'}>
        <input
          {...register('email')}
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          required
          placeholder="e-posta adresin"
          className="w-full rounded-md border border-nene-ink/15 bg-nene-cream px-3 py-2.5 text-sm focus:border-nene-rust focus:outline-none focus:ring-2 focus:ring-nene-rust/20"
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-nene-rust">{errors.email.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-nene-rust px-5 py-2.5 text-sm font-medium text-nene-cream hover:bg-nene-rust/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === 'submitting' ? 'Gönderiliyor…' : 'Katıl'}
      </button>

      {errorMessage ? (
        <p className="text-xs text-nene-rust">{errorMessage}</p>
      ) : null}
    </form>
  )
}
