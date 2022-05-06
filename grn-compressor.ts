const data = JSON.parse(Deno.readTextFileSync('./data.json'))

const peopleGroups: Array<string> = []
const names: Array<string> = []

const toIndexed = (indexArray: Array<string>, names: Array<string>) => {
  return names.map(name => {
    if (!indexArray.includes(name)) {
      indexArray.push(name)
    }

    return indexArray.indexOf(name)
  })
}

const compress = (object: any) => {
  const name = object['ISO Language Name']?.split(' [')[0] ?? object['Language name']
  return {
    po: object['Population'] ? parseInt(object['Population']) : null,
    gr: parseInt(object['GRN Language Number']),
    iso: object.iso,
    ns: object.names ? toIndexed(names, object.names) : null,
    pg: object.peopleGroups ? toIndexed(peopleGroups, object.peopleGroups) : null,
    n: toIndexed(names, [name])[0]
  }
}

const compressedLanguages: Array<any> = []
for (const language of data) {
  compressedLanguages.push(compress(language))
}

const output = {
  languages: compressedLanguages,
  groups: peopleGroups
}

Deno.writeTextFileSync('./compressed.json', JSON.stringify(output))
