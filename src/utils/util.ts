export function padStart(str: any, targetLength: number, padString: string) {
  const s = String(str)
  if (s.length >= targetLength) {
    return s;
  }
  return `${Array(targetLength).join(padString)}${str}`
}