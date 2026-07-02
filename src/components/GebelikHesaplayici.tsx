'use client'

import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { hesaplaGebelik, parseDateOnlyLocal } from '@/lib/gebelik'

const todayStr = () => format(new Date(), 'yyyy-MM-dd')

const Schema = z.object({
  lmp: z
    .string()
    .min(1, 'Son adet tarihini gir.')
    .refine((val) => !Number.isNaN(Date.parse(val)), 'Geçerli bir tarih gir.')
    .refine(
      (val) => parseDateOnlyLocal(val) <= parseDateOnlyLocal(todayStr()),
      'Son adet tarihi bugünden ileri bir tarih olamaz.',
    ),
})
type FormValues = z.infer<typeof Schema>

export function GebelikHesaplayici() {
  const id = useId()
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { lmp: '' },
  })
  const [result, setResult] = useState<ReturnType<typeof hesaplaGebelik> | null>(
    null,
  )
  const [formError, setFormError] = useState<string | null>(null)

  function onSubmit(values: FormValues) {
    try {
      const parsed = Schema.parse(values)
      setFormError(null)
      setResult(hesaplaGebelik(parseDateOnlyLocal(parsed.lmp)))
    } catch (err) {
      setResult(null)
      setFormError(
        err instanceof z.ZodError
          ? (err.issues[0]?.message ?? 'Tarih geçerli değil.')
          : 'Bir aksaklık oldu.',
      )
    }
  }

  return (
    <div className="rounded-2xl border border-nene-gold/40 bg-nene-mist/30 p-8 md:p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <Field id={`${id}-lmp`} label="Son adet tarihinin ilk günü" required>
          <input
            {...register('lmp')}
            id={`${id}-lmp`}
            type="date"
            max={todayStr()}
            required
            className={inputCls}
          />
        </Field>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-nene-rust px-6 py-2.5 text-sm font-medium text-nene-cream hover:bg-nene-rust/90"
        >
          Hesapla
        </button>
      </form>

      {formError ? (
        <p className="mt-3 text-xs text-nene-rust">{formError}</p>
      ) : null}

      {result ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ResultCard
            label="Tahmini doğum tarihi"
            value={format(result.dueDate, 'd MMMM yyyy', { locale: tr })}
          />
          <ResultCard
            label="Gebelik süresi"
            value={`${result.gestationalWeeks} hafta ${result.gestationalDayOfWeek} gün`}
          />
          <ResultCard label="Trimester" value={`${result.trimester}. Trimester`} />
        </div>
      ) : null}

      {result?.isPostTerm ? (
        <p className="mt-4 text-xs text-nene-ink/60">
          Girdiğin tarihe göre 42 haftayı geçmiş görünüyor. Bu, tarihi yanlış
          girmiş olabileceğin ya da doğumun zaten gerçekleşmiş olabileceği
          anlamına gelebilir. Sonuçları buna göre değerlendir.
        </p>
      ) : null}
    </div>
  )
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-nene-mist bg-nene-cream p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-nene-rust">
        {label}
      </p>
      <p className="mt-1.5 font-serif text-xl text-nene-ink">{value}</p>
    </div>
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
    <div className="flex-1">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-nene-ink"
      >
        {label}
        {required ? <span className="ml-1 text-nene-rust">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-nene-rust">{error}</p> : null}
    </div>
  )
}
