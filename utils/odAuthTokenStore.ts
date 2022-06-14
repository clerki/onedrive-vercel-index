import Redis from 'ioredis'

// Persistent key-value store is provided by Redis, hosted on Upstash
// https://vercel.com/integrations/upstash
const kv = new Redis(process.env.REDIS_URL)
const yaccess_token = process.env.AC || 'access_token'
const yrefresh_token = process.env.RE || 'refresh_token'

export async function getOdAuthTokens(): Promise<{ accessToken: unknown; refreshToken: unknown }> {
  const accessToken = await kv.get(yaccess_token)
  const refreshToken = await kv.get(yrefresh_token)

  return {
    accessToken,
    refreshToken,
  }
}

export async function storeOdAuthTokens({
  accessToken,
  accessTokenExpiry,
  refreshToken,
}: {
  accessToken: string
  accessTokenExpiry: number
  refreshToken: string
}): Promise<void> {
  await kv.set(yaccess_token, accessToken, 'ex', accessTokenExpiry)
  await kv.set(yrefresh_token, refreshToken)
}
