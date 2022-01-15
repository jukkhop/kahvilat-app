import qs from 'qs'

interface GraphQlPath {
  args: Record<string, string>
}

function buildPath(endpoint: string, encode?: boolean) {
  return (path: GraphQlPath): string => {
    const queryString = qs.stringify(path.args, { encode })
    return `${endpoint}?${queryString}`
  }
}

export { buildPath }
