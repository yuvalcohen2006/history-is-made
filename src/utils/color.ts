/** Parse a #rrggbb hex into [r,g,b]. */
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((c) => clamp(c).toString(16).padStart(2, '0')).join('')

/** Lighten a hex color toward white by `amount` (0..1). */
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex)
  return toHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

/** Darken a hex color toward black by `amount` (0..1). */
export function darken(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex)
  const k = 1 - amount
  return toHex(r * k, g * k, b * k)
}
