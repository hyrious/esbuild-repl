export async function fetch_versions(name: string): Promise<string[]> {
  try {
    const url = `https://data.jsdelivr.com/v1/package/npm/${name}`
    const { versions } = await fetch(url).then((r) => r.json())
    if (versions && versions.length) {
      return versions
    }
  } catch (err) {
    console.error(err)
  }

  try {
    const url = `https://registry.npmjs.org/${name}`
    const { versions } = await fetch(url).then((r) => r.json())
    if (versions) {
      return Object.keys(versions).reverse()
    }
  } catch (err) {
    console.error(err)
  }

  throw new Error(`Failed to fetch versions for ${name}`)
}

export function version_in_range(v: string, left: string, right: string): boolean {
  const a = parse(v)
  const b = parse(left)
  const c = parse(right)
  return ge(a, b) && le(a, c)
}

function parse(v: string): number[] {
  return v.split('.').map((v) => parseInt(v, 10))
}

function ge(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) return false
    if (a[i] > b[i]) return true
  }
  return true
}

function le(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) return false
    if (a[i] < b[i]) return true
  }
  return true
}
