import configPromise from '@payload-config'
import { getPayload as getPayloadInstance, type Payload } from 'payload'

let cached: Payload | null = null

export async function getPayload(): Promise<Payload> {
  if (cached) return cached
  cached = await getPayloadInstance({ config: configPromise })
  return cached
}
