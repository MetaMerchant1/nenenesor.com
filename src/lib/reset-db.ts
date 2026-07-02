import { getPayload } from './payload'
import { runSeed } from './seed'

async function reset() {
  console.log('Resetting database and seeding new categories...')
  const payload = await getPayload()

  console.log('Clearing questions...')
  await payload.delete({ collection: 'questions', where: { id: { exists: true } } })

  console.log('Clearing posts...')
  await payload.delete({ collection: 'posts', where: { id: { exists: true } } })

  console.log('Clearing products...')
  await payload.delete({ collection: 'products', where: { id: { exists: true } } })

  console.log('Clearing categories...')
  await payload.delete({ collection: 'categories', where: { id: { exists: true } } })

  console.log('Clearing experts...')
  await payload.delete({ collection: 'experts', where: { id: { exists: true } } })

  console.log('Clearing media...')
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })

  console.log('Running runSeed...')
  await runSeed(payload)

  console.log('Database reset and seed completed successfully!')
  process.exit(0)
}

reset().catch((err) => {
  console.error('Error resetting database:', err)
  process.exit(1)
})
