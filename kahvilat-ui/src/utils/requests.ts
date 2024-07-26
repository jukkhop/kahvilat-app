function createHeaders(contentType?: string | undefined): Record<string, string> {
  const headersMap = new Map<string, string>()

  if (contentType) {
    headersMap.set('Content-Type', contentType)
  }

  return Object.fromEntries(headersMap)
}

export function getOptions(): RequestInit {
  return {
    method: 'GET',
    headers: createHeaders('application/json'),
  }
}
