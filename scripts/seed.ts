/**
 * Seed the database with launch content (idempotent — safe to re-run).
 * Run with:  npm run seed
 *
 * (In some sandboxed shells `payload run` can't attach a TTY. As a fallback in
 *  dev you can also hit GET /api/seed while `npm run dev` is running.)
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedDatabase } from '../src/lib/seedData'

async function run() {
  const payload = await getPayload({ config })
  const result = await seedDatabase(payload)
  payload.logger.info({ result }, '✅ Seed complete')
  // eslint-disable-next-line no-console
  console.log('✅ Seed complete:', result)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
