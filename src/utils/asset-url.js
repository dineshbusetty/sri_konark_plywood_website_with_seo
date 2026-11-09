const base = import.meta.env.BASE_URL

export function assetUrl(path) {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${clean}`
}
