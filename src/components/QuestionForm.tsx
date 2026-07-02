'use client'

import Script from 'next/script'
import { useEffect, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const Schema = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().email('Geçerli bir e-posta gir.'),
  category: z.string().optional(),
  question: z
    .string()
    .trim()
    .min(50, 'Soru en az 50 karakter olmalı.')
    .max(1000, 'Soru en fazla 1000 karakter olabilir.'),
  kvkk: z.literal(true, {
    errorMap: () => ({ message: 'KVKK onayı gerekli.' }),
  }),
})

type FormValues = z.infer<typeof Schema>

interface CategoryItem {
  id: number
  slug: string
  name: string
  parent?: number | { id: number; slug: string; name: string } | null
}

interface QuestionFormProps {
  categories: CategoryItem[]
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        },
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

export function QuestionForm({ categories }: QuestionFormProps) {
  const formId = useId()
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [tsToken, setTsToken] = useState<string | null>(null)
  const [submitState, setSubmitState] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', email: '', category: '', question: '' },
  })

  // Find all main categories (no parent)
  const mainCategories = categories.filter((c) => !c.parent)

  // State for selected main category slug
  const [selectedMainCategorySlug, setSelectedMainCategorySlug] = useState<string>('')

  // Find subcategories for the selected main category
  const subCategories = categories.filter((c) => {
    if (!c.parent) return false
    const parentId = typeof c.parent === 'object' ? c.parent.id : c.parent
    const parentSlug =
      typeof c.parent === 'object'
        ? c.parent.slug
        : categories.find((cat) => cat.id === parentId)?.slug
    return parentSlug === selectedMainCategorySlug
  })

  const questionLen = watch('question')?.length ?? 0

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    let cancelled = false
    function tryRender() {
      if (cancelled) return
      if (!window.turnstile || !turnstileRef.current) {
        return setTimeout(tryRender, 200)
      }
      if (widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY!,
        callback: (token: string) => setTsToken(token),
        'expired-callback': () => setTsToken(null),
        'error-callback': () => setTsToken(null),
        theme: 'light',
      })
    }
    tryRender()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(values: FormValues) {
    setSubmitState('submitting')
    setErrorMessage(null)
    try {
      const parsed = Schema.parse(values)
      const categorySlug = parsed.category || selectedMainCategorySlug
      const res = await fetch('/api/soru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed,
          category: categorySlug || undefined,
          turnstileToken: tsToken,
        }),
      })
      const data = (await res.json()) as { ok: boolean; reason?: string }
      if (!res.ok || !data.ok) {
        setSubmitState('error')
        setErrorMessage(
          data.reason === 'captcha_failed' || data.reason === 'missing_token'
            ? 'Doğrulama tamamlanamadı, sayfayı yenileyip tekrar dene.'
            : 'Bir aksaklık oldu. Birazdan tekrar dene.',
        )
        return
      }
      setSubmitState('success')
      reset()
      setSelectedMainCategorySlug('')
      setTsToken(null)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    } catch (err) {
      setSubmitState('error')
      setErrorMessage(
        err instanceof z.ZodError
          ? err.issues[0]?.message ?? 'Form geçerli değil.'
          : 'Bir aksaklık oldu. Birazdan tekrar dene.',
      )
    }
  }

  if (submitState === 'success') {
    return (
      <div className="rounded-lg border border-nene-sage/30 bg-nene-sage/10 px-6 py-10 text-center">
        <h2 className="font-serif text-2xl text-nene-ink">Sorun ulaştı.</h2>
        <p className="mt-2 text-nene-ink/80">
          Cevap gelince mail atarız — söz.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState('idle')}
          className="mt-6 text-sm text-nene-rust underline"
        >
          Yeni bir soru daha sor
        </button>
      </div>
    )
  }

  return (
    <>
      {TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${formId}-name`} label="Adın (isteğe bağlı)">
            <input
              {...register('name')}
              id={`${formId}-name`}
              type="text"
              placeholder="İsimsiz Anne"
              className={inputCls}
              maxLength={80}
            />
          </Field>

          <Field
            id={`${formId}-email`}
            label="E-posta"
            error={errors.email?.message}
            required
          >
            <input
              {...register('email')}
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              required
              className={inputCls}
            />
            <p className="mt-1 text-xs text-nene-ink/55">
              Sadece sana cevap geldiğinde mail atmak için kullanırız.
            </p>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${formId}-main-category`} label="Dönem / Ana Kategori (isteğe bağlı)">
            <select
              id={`${formId}-main-category`}
              className={inputCls}
              value={selectedMainCategorySlug}
              onChange={(e) => {
                setSelectedMainCategorySlug(e.target.value)
                setValue('category', '')
              }}
            >
              <option value="">Seçim yapın</option>
              {mainCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id={`${formId}-category`}
            label="Alt Kategori (isteğe bağlı)"
          >
            <select
              {...register('category')}
              id={`${formId}-category`}
              className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={!selectedMainCategorySlug}
              defaultValue=""
            >
              <option value="">Alt Kategori Seçin</option>
              {subCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          id={`${formId}-q`}
          label="Sorun"
          error={errors.question?.message}
          required
        >
          <textarea
            {...register('question')}
            id={`${formId}-q`}
            rows={6}
            required
            minLength={50}
            maxLength={1000}
            className={inputCls}
            placeholder="Aklında ne varsa serbestçe yaz. Detay verirsen uzman daha iyi cevaplar."
          />
          <div className="mt-1 text-right text-xs text-nene-ink/55">
            {questionLen} / 1000
          </div>
        </Field>

        {TURNSTILE_SITE_KEY ? (
          <div ref={turnstileRef} className="cf-turnstile" />
        ) : (
          <p className="text-xs text-nene-ink/55">
            (Dev modda doğrulama atlanıyor.)
          </p>
        )}

        <label className="flex items-start gap-3 text-sm text-nene-ink/80">
          <input
            {...register('kvkk')}
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-nene-ink/30 accent-nene-rust"
          />
          <span>
            Mailimi sadece sana cevap göndermek için kullanırız. Üçüncü
            kişilerle paylaşmayız.{' '}
            <span className="text-nene-ink/55">(KVKK onayı)</span>
          </span>
        </label>
        {errors.kvkk ? (
          <p className="-mt-4 text-xs text-nene-rust">{errors.kvkk.message}</p>
        ) : null}

        {errorMessage ? (
          <div className="rounded-md border border-nene-rust/30 bg-nene-rust/5 px-4 py-3 text-sm text-nene-rust">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="inline-flex items-center rounded-md bg-nene-rust px-6 py-3 text-sm font-medium text-nene-cream hover:bg-nene-rust/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState === 'submitting' ? 'Gönderiliyor…' : 'Soruyu Gönder'}
        </button>
      </form>
    </>
  )
}

const inputCls =
  'w-full rounded-md border border-nene-ink/15 bg-nene-cream px-3 py-2 text-sm text-nene-ink placeholder:text-nene-ink/40 focus:border-nene-rust focus:outline-none focus:ring-2 focus:ring-nene-rust/20'

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-nene-ink">
        {label}
        {required ? <span className="ml-1 text-nene-rust">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-nene-rust">{error}</p> : null}
    </div>
  )
}
