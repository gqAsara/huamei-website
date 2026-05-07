/**
 * Roman numeral encode/decode for /volumes case study numbering.
 *
 * Range: 1..3999 (standard roman). The /volumes archive will not realistically
 * exceed three digits in our lifetime; bounded for safety.
 */

const VALUES = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
const SYMBOLS = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new Error(`toRoman: out of range (1..3999): ${n}`);
  }
  let out = "";
  for (let i = 0; i < VALUES.length; i++) {
    while (n >= VALUES[i]) {
      out += SYMBOLS[i];
      n -= VALUES[i];
    }
  }
  return out;
}

export function fromRoman(s: string): number {
  if (!s || !/^[MDCLXVI]+$/.test(s)) {
    throw new Error(`fromRoman: not a roman numeral: ${s}`);
  }
  const map: Record<string, number> = {
    M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1,
  };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]];
    const next = map[s[i + 1]];
    if (next && next > cur) total -= cur;
    else total += cur;
  }
  return total;
}

/**
 * Given an array of roman numerals (existing case study `num` values),
 * return the next one in sequence (max + 1).
 */
export function nextRoman(existing: string[]): string {
  let max = 0;
  for (const r of existing) {
    try {
      const n = fromRoman(r);
      if (n > max) max = n;
    } catch {
      // Skip malformed entries.
    }
  }
  return toRoman(max + 1);
}
