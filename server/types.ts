export interface RedisApi {
  setAsync: (key: string, value: string) => Promise<void>
  getAsync: (key: string) => Promise<string>
  delAsync: (key: string) => Promise<void>
}
