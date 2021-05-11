import qs from 'qs'

interface GraphQlPath {
  args: Record<string, string>
}

function buildPath(endpoint: string) {
  return (path: GraphQlPath): string => {
    const queryString = qs.stringify(path.args, { encode: false })
    return `${endpoint}?${queryString}`
  }
}

export { buildPath }
