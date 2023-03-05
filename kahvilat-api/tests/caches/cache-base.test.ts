import { CacheBase } from '../../src/caches'

const client = {
  delete: jest.fn(),
  expire: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
}

describe('CacheBase', () => {
  let cache: CacheBase

  beforeEach(() => {
    cache = new CacheBase(undefined, undefined, client as any)
  })

  afterEach(() => {
    Object.values(client).forEach((fn) => fn.mockReset())
  })

  it('should cache a given value with the given expiration time', async () => {
    await cache.set('some-key', 'some-value', 2000)
    expect(client.set).toHaveBeenCalledWith('some-key', 'some-value')
    expect(client.expire).toHaveBeenCalledWith('some-key', 2000)
  })

  it('should return a cached value', async () => {
    client.get.mockResolvedValueOnce('some-value')
    const valueFromCache = await cache.get('some-key')
    expect(client.get).toHaveBeenCalledWith('some-key')
    expect(valueFromCache).toBe('some-value')
  })

  it('should return undefined when trying to get a non-existing key', async () => {
    const valueFromCache = await cache.get('non-existing-key')
    expect(client.get).toHaveBeenCalledWith('non-existing-key')
    expect(valueFromCache).toBeUndefined()
  })

  it('should delete a given value', async () => {
    await cache.delete('some-key')
    expect(client.delete).toHaveBeenCalledWith('some-key')
  })
})
