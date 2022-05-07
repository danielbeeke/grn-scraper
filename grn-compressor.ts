import { compressArray } from './helpers/compressArray.ts'
const data = JSON.parse(Deno.readTextFileSync('./data.json'))
const countries = JSON.parse(Deno.readTextFileSync('./countries.json'))

const names: Array<string> = []

const toIndexed = (indexArray: Array<string>, names: Array<string>) => {
  const indexes = names.map(name => {
    if (!indexArray.includes(name)) {
      indexArray.push(name)
    }

    return indexArray.indexOf(name)
  })

  return compressArray(indexes)
}

const compress = (object: { [key: string]: any }) => {
  const name = object['Language name']
  const output: { [key: string]: any } = {
    p: object['Population'] ? parseInt(object['Population']) : null,
    r: parseInt(object['GRN Language Number']),
    i: object['ISO Language Code'],
    o: object.iso,
    c: object.countries?.map((fips: string) => {
      if (!countries[fips]) return null
      return countries[fips]['ISO Country Code']
    }).filter(Boolean),
    s: object.names ? toIndexed(names, object.names) : null,
    g: object.peopleGroups ? toIndexed(names, object.peopleGroups) : null,
    n: toIndexed(names, [name])[0]
  }

  Object.keys(output).forEach(key => {
    if (output[key] === null) {
      delete output[key];
    }
  })

  return output
}

const compressedLanguages: Array<any> = []
for (const language of data) {
  compressedLanguages.push(compress(language))
}

const countryNames: any = {}

for (const country of Object.values(countries)) {
  countryNames[(country as any)['ISO Country Code']] = toIndexed(names, [(country as any)['name']])[0]
}

const output = {
  languages: compressedLanguages,
  names,
  countries: countryNames,
}

Deno.writeTextFileSync('./compressed.json', JSON.stringify(output))
