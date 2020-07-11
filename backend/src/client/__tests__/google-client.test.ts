import fetch from 'node-fetch'
import GoogleClient from '../google-client'

const { Response, FetchError } = jest.requireActual('node-fetch')
jest.mock('node-fetch', jest.fn)

let client: GoogleClient
let fetchFn: jest.MockedFunction<typeof fetch>

beforeEach(() => {
  client = new GoogleClient('some-api-key', 'some-lang')
  fetchFn = fetch as jest.MockedFunction<typeof fetch>
})

describe('find address', () => {
  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=some-api-key&language=some-lang&latlng=some-lat,some-lng`
    const expectedBody = { results: [{ name: 'some-cafeteria' }] }

    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))

    const [status, body, error] = await client.findAddress('some-lat', 'some-lng')

    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(status).toBe(200)
    expect(body).toEqual(expectedBody)
    expect(error).toBeUndefined()
  })

  it('returns HTTP 502 Bad Gateway when Google API responds with HTTP 5xx', async () => {
    fetchFn.mockResolvedValueOnce(new Response('', { status: 500 }))

    const [status, body, error] = await client.findAddress('some-lat', 'some-lng')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(502)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with HTTP status 500')
  })

  it('returns HTTP 500 Internal Server Error when Google API responds with HTTP 4xx', async () => {
    fetchFn.mockResolvedValueOnce(new Response('', { status: 400 }))

    const [status, body, error] = await client.findAddress('some-lat', 'some-lng')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(500)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with HTTP status 400')
  })

  it('returns HTTP 502 Bad Gateway when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))

    const [status, body, error] = await client.findAddress('some-lat', 'some-lng')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(502)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with error: Connection timed out')
  })
})

describe('find coordinates', () => {
  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=some-address&key=some-api-key&language=some-lang`
    const expectedBody = { results: [{ name: 'some-cafeteria' }] }

    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))

    const [status, body, error] = await client.findCoordinates('some-address')

    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(status).toBe(200)
    expect(body).toEqual(expectedBody)
    expect(error).toBeUndefined()
  })

  it('returns HTTP 502 Bad Gateway when Google API responds with HTTP 5xx', async () => {
    fetchFn.mockResolvedValueOnce(new Response('', { status: 500 }))

    const [status, body, error] = await client.findCoordinates('some-address')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(502)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with HTTP status 500')
  })

  it('returns HTTP 500 Internal Server Error when Google API responds with HTTP 4xx', async () => {
    fetchFn.mockResolvedValueOnce(new Response('', { status: 400 }))

    const [status, body, error] = await client.findCoordinates('some-address')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(500)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with HTTP status 400')
  })

  it('returns HTTP 502 Bad Gateway when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))

    const [status, body, error] = await client.findCoordinates('some-address')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(502)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with error: Connection timed out')
  })
})

describe('find places', () => {
  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&keyword=coffee&location=some-lat,some-lng&radius=500&types=cafe`
    const expectedBody = {
      results: [{ name: 'some-cafeteria' }],
    }

    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))

    const [status, body, error] = await client.findPlaces(
      undefined,
      'coffee',
      'some-lat,some-lng',
      500,
      'cafe',
    )

    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(status).toBe(200)
    expect(body).toEqual(expectedBody)
    expect(error).toBeUndefined()
  })

  it('calls Google API and returns valid data using cursor', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&pagetoken=some-cursor`
    const expectedBody = {
      results: [{ name: 'some-cafeteria' }],
    }

    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))

    const [status, body, error] = await client.findPlaces('some-cursor')

    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(status).toBe(200)
    expect(body).toEqual(expectedBody)
    expect(error).toBeUndefined()
  })

  it('returns HTTP 502 Bad Gateway when Google API responds with HTTP 5xx', async () => {
    fetchFn.mockResolvedValueOnce(new Response('', { status: 500 }))

    const [status, body, error] = await client.findPlaces('some-cursor')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(502)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with HTTP status 500')
  })

  it('returns HTTP 500 Internal Server Error when Google API responds with HTTP 4xx', async () => {
    fetchFn.mockResolvedValueOnce(new Response('', { status: 400 }))

    const [status, body, error] = await client.findPlaces('some-cursor')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(500)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with HTTP status 400')
  })

  it('returns HTTP 502 Bad Gateway when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))

    const [status, body, error] = await client.findPlaces('some-cursor')

    expect(fetchFn).toHaveBeenCalled()
    expect(status).toBe(502)
    expect(body).toBeUndefined()
    expect(error).toBe('Third party API call failed with error: Connection timed out')
  })
})
