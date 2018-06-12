// From deno
export function typedArrayToArrayBuffer(ta) {
  return ta.buffer.slice(ta.byteOffset, ta.byteOffset + ta.byteLength);
}
