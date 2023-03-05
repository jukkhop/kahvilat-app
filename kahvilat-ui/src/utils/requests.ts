const mkHeaders = (contentType?: string | undefined): Record<string, string> => {
  const headersMap = new Map<string, string>()

  if (contentType) {
    headersMap.set('Content-Type', contentType)
  }

  return Object.fromEntries(headersMap)
}

const getOptions = (): RequestInit => {
  return {
    method: 'GET',
    headers: mkHeaders('application/json'),
  }
}

export { getOptions }
