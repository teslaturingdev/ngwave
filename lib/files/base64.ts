// Chunked to avoid blowing the call stack on `String.fromCharCode(...bytes)`
// for large arrays (btoa needs a binary string, built in bounded pieces).
const CHUNK_SIZE = 0x8000;

export function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(binary);
}
