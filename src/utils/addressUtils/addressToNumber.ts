export function addressToNumber(address: string | null | undefined): number | undefined {
  if (!address) {
    return undefined;
  }
  const addr = address.slice(2, 10)
  const seed = parseInt(addr, 16)
  return seed
}