import { encode, decode } from "../src/base64url";

const testsetString = [
  ["", ""],
  ["Man", "TWFu"],
  ["Ma", "TWE="],
  ["M", "TQ=="],
  ["ß", "w58="],
  ["f", "Zg=="],
  ["fo", "Zm8="],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg=="],
  ["fooba", "Zm9vYmE="],
  ["foobar", "Zm9vYmFy"],
];

const testsetBinary = testsetString.map(([str, b64]) => [
  new TextEncoder().encode(str),
  b64,
]) as Array<[Uint8Array, string]>;

testsetBinary.push([
  new Uint8Array([...Array(256).keys()]), // all bytes from 0 to 0xff
  "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0-P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn-AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq-wsbKztLW2t7i5uru8vb6_wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t_g4eLj5OXm5-jp6uvs7e7v8PHy8_T19vf4-fr7_P3-_w==",
]);

test("encode", () => {
  for (const [input, output] of testsetBinary) {
    expect(encode(input)).toBe(output);
  }
});

test("decode valid strings", () => {
  for (const [output, input] of testsetBinary) {
    expect(decode(input)).toStrictEqual(output);
  }
});

test("decode invalid strings", () => {
  expect(() => decode("абв")).toThrowError("invalid");
  expect(() => decode("abcd=a")).toThrowError("invalid");
  expect(() => decode("abcd===")).toThrowError("invalid");
  expect(() => decode("abc==a")).toThrowError("invalid");
  expect(() => decode("abc===")).toThrowError("invalid");
});
