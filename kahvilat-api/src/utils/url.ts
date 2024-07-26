export function urlEncode(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+')
}
