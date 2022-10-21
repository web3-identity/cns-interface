export function addressToNumber(address: string | null | undefined): number | null {
  if (!address) {
    return null
  }
  const addr = address.slice(2, 10)
  const seed = parseInt(addr, 16)
  return seed
}