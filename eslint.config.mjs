import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const filename = fileURLToPath(import.meta.url)
const dirpath = dirname(filename)

const compat = new FlatCompat({
  baseDirectory: dirpath,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/app/(payload)/admin/importMap.js',
      'src/payload-types.ts',
    ],
  },
]

export default eslintConfig
