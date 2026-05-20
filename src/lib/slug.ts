const turkishMap: Record<string, string> = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', I: 'i',
  İ: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
}

export function slugify(input: string): string {
  if (!input) return ''
  const normalized = input
    .split('')
    .map((ch) => turkishMap[ch] ?? ch)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
  return normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/**
 * Auto-generate slug from another field when slug is empty.
 * Usage: hooks: { beforeValidate: [autoSlugFrom('name')] }
 */
export const autoSlugFrom = (sourceField: string) => ({
  value,
  data,
}: {
  value?: unknown
  data?: Record<string, unknown>
}) => {
  if (typeof value === 'string' && value.length > 0) return value
  const source = data?.[sourceField]
  if (typeof source === 'string' && source.length > 0) {
    return slugify(source)
  }
  return value
}
