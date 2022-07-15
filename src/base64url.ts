const PAD = "=";

const encodeMap =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const decodeMap: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
  a: 26,
  b: 27,
  c: 28,
  d: 29,
  e: 30,
  f: 31,
  g: 32,
  h: 33,
  i: 34,
  j: 35,
  k: 36,
  l: 37,
  m: 38,
  n: 39,
  o: 40,
  p: 41,
  q: 42,
  r: 43,
  s: 44,
  t: 45,
  u: 46,
  v: 47,
  w: 48,
  x: 49,
  y: 50,
  z: 51,
  "0": 52,
  "1": 53,
  "2": 54,
  "3": 55,
  "4": 56,
  "5": 57,
  "6": 58,
  "7": 59,
  "8": 60,
  "9": 61,
  "-": 62,
  _: 63,
};

function decodeChar(char: string): number {
  if (char.length !== 1) {
    throw new Error("not a char");
  }

  const b = decodeMap[char];
  if (b === undefined) {
    throw new Error("invalid base64url character");
  }

  return b;
}

export function encode(bytes: Uint8Array): string {
  let encoded = "";
  const rem = bytes.length % 3;
  const n = bytes.length - rem;

  for (let i = 0; i < n; i += 3) {
    encoded += encodeMap[bytes[i] >> 2];
    encoded += encodeMap[((bytes[i] << 4) & 0x3f) | (bytes[i + 1] >> 4)];
    encoded += encodeMap[((bytes[i + 1] << 2) & 0x3f) | (bytes[i + 2] >> 6)];
    encoded += encodeMap[bytes[i + 2] & 0x3f];
  }

  switch (rem) {
    case 2:
      encoded += encodeMap[bytes[n] >> 2];
      encoded += encodeMap[((bytes[n] << 4) & 0x3f) | (bytes[n + 1] >> 4)];
      encoded += encodeMap[(bytes[n + 1] << 2) & 0x3f];
      encoded += PAD;
      break;

    case 1:
      encoded += encodeMap[bytes[n] >> 2];
      encoded += encodeMap[(bytes[n] << 4) & 0x3f];
      encoded += PAD;
      encoded += PAD;
      break;

    default:
      break;
  }

  return encoded;
}

export function decode(str: string): Uint8Array {
  if (str.length === 0) {
    return new Uint8Array(0);
  }

  const decoded: number[] = [];

  const n = str[str.length - 1] === PAD ? str.length - 4 : str.length;

  let i = 0;
  for (; i < n; i += 4) {
    const b1 = decodeChar(str[i]);
    const b2 = decodeChar(str[i + 1]);
    const b3 = decodeChar(str[i + 2]);
    const b4 = decodeChar(str[i + 3]);

    decoded.push((b1 << 2) | (b2 >> 4));
    decoded.push((b2 << 4) | (b3 >> 2));
    decoded.push((b3 << 6) | b4);
  }

  if (i !== str.length) {
    // there is a padding at the end of string
    const b1 = decodeChar(str[i]);
    const b2 = decodeChar(str[i + 1]);
    decoded.push((b1 << 2) | (b2 >> 4));

    if (str[str.length - 2] !== PAD) {
      // case of '=' padding
      const b3 = decodeChar(str[i + 2]);
      decoded.push((b2 << 4) | (b3 >> 2));
    }
  }

  return new Uint8Array(decoded);
}
