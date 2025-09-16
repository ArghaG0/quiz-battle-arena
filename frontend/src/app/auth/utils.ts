export function joinPaths(...parts: string[]): string {
  const path = parts.join('/');
  return `/${path}`.replace(/\/{2,}/g, '/');
}