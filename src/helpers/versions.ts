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
