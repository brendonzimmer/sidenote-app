// Normal chunk array method BUT if a chunk has less than 3 items, remove it
export function chunk<T>(array: T[], size: number): T[][] {
  if (size === 0) {
    return [];
  }

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  if (chunks.at(-1)?.length !== size) {
    chunks.pop();
  }

  return chunks;
}
