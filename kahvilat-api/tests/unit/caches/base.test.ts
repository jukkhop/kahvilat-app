import { CacheBase } from '../../../src/caches'

describe('CacheBase', () => {
  let impl: CacheBase

  const client = {
    isReady: false,
    connect: jest.fn(),
    expire: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  }

  beforeEach(() => {
    // @ts-ignore
    impl = new CacheBase({ client } as any)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('caches a given value with the given expiration time', async () => {
    await impl.set('some-key', 'some-value', 2000)
    expect(client.connect).toHaveBeenCalled()
    expect(client.set).toHaveBeenCalledWith('some-key', 'some-value')
    expect(client.expire).toHaveBeenCalledWith('some-key', 2000)
  })

  it('returns a cached value', async () => {
    client.get.mockResolvedValueOnce('some-value')
    const valueFromCache = await impl.get('some-key')
    expect(client.connect).toHaveBeenCalled()
    expect(client.get).toHaveBeenCalledWith('some-key')
    expect(valueFromCache).toBe('some-value')
  })

  it('returns undefined when trying to get a non-existing key', async () => {
    const valueFromCache = await impl.get('non-existing-key')
    expect(client.connect).toHaveBeenCalled()
    expect(client.get).toHaveBeenCalledWith('non-existing-key')
    expect(valueFromCache).toBeUndefined()
  })

  it('connects only when the client is not already connected', async () => {
    client.isReady = true
    await impl.set('some-key', 'some-value', 2000)
    expect(client.connect).not.toHaveBeenCalled()
    expect(client.set).toHaveBeenCalledWith('some-key', 'some-value')
    expect(client.expire).toHaveBeenCalledWith('some-key', 2000)
  })
})
