function showDistance(metres: number): string {
  if (metres !== 1000) return `${metres} m`
  return `${metres / 1000} km`
}

export { showDistance }
