import { addDays, differenceInCalendarDays } from 'date-fns'

export type Trimester = 1 | 2 | 3

export interface GebelikSonuc {
  dueDate: Date
  gestationalDays: number
  gestationalWeeks: number
  gestationalDayOfWeek: number
  trimester: Trimester
  isPostTerm: boolean
}

export function hesaplaGebelik(
  lmpDate: Date,
  today: Date = new Date(),
): GebelikSonuc {
  const gestationalDays = differenceInCalendarDays(today, lmpDate)
  const gestationalWeeks = Math.floor(gestationalDays / 7)
  const gestationalDayOfWeek = gestationalDays % 7
  const dueDate = addDays(lmpDate, 280)

  let trimester: Trimester
  if (gestationalWeeks <= 13) trimester = 1
  else if (gestationalWeeks <= 27) trimester = 2
  else trimester = 3

  return {
    dueDate,
    gestationalDays,
    gestationalWeeks,
    gestationalDayOfWeek,
    trimester,
    isPostTerm: gestationalDays > 294,
  }
}

/**
 * `<input type="date">` values (YYYY-MM-DD) parsed via `new Date(string)` are
 * anchored to UTC midnight, which can shift a day backward in UTC+3 (TR).
 * Parse the components manually to anchor to local midnight instead.
 */
export function parseDateOnlyLocal(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}
