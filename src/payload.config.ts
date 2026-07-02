import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Experts } from '@/collections/Experts'
import { Media } from '@/collections/Media'
import { Posts } from '@/collections/Posts'
import { Products } from '@/collections/Products'
import { Questions } from '@/collections/Questions'
import { Users } from '@/collections/Users'
import { runSeed } from '@/lib/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — nenenesor admin",
    },
  },
  collections: [Users, Experts, Categories, Posts, Questions, Products, Media],
  editor: lexicalEditor({}),
  sharp,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl: process.env.DATABASE_URI?.includes('localhost') || process.env.DATABASE_URI?.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
    },
    // Auto schema-push is fine for local dev, but must never run against
    // production — use `pnpm migrate:create` / `pnpm migrate` instead.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    await runSeed(payload)
  },
})
