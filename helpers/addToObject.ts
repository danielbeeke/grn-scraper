export const addToObject = (string: string, object: any) => {
  const lines = string.split('\n')
  for (const line of lines) {
    const [key, ...values] = line.split(/: |:/)
    const value = values.join(': ')
    if (!key?.trim() || !value?.trim()) continue
    if (key === 'ISO Language Name' && value.includes('[')) {
      const [, rawIso] = value.split('[')
      const cleanedIso = rawIso.substring(0, rawIso.length -1)
      object.iso = cleanedIso
    }
    object[key.trim()] = value.trim()
  }
}
