import { createClient } from 'redis'
import { log } from '../Util/Helper'

const url = `redis://:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

const redis = createClient({ url })
redis.on('connect', function () {
  log(`redis connection made`)
})
redis.on('error', function (err: any) {
  log(`redis connect error`, err)
})

export type RedisClientType = typeof redis

export { redis }
