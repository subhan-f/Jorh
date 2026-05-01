const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function generateShortCode(length = 6): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b: number) => ALPHABET[b % ALPHABET.length]!).join("");
}

export function isValidShortCode(code: string): boolean {
  return /^[A-Za-z0-9]{4,12}$/.test(code);
}
