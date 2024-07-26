export function showDistance(metres: number): string {
  if (metres % 1000 === 0) return `${metres / 1000} km`
  return `${metres} m`
}
