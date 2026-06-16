/** Dev-only: push the current Payload schema to the configured DATABASE_URI. */
import { getPayload } from 'payload'
import config from '../src/payload.config'
const p = await getPayload({ config })
const r = await p.db.pool?.query?.("select count(*) from information_schema.tables where table_schema='public'").catch(() => null)
console.log('PUSH DONE. public tables:', r?.rows?.[0]?.count ?? '?')
process.exit(0)
