import 'server-only'
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

/** Memoized Payload local-API client (singleton). */
export const getPayloadClient = cache(async () => getPayload({ config }))
