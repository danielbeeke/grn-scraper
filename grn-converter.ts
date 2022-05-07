import { cache } from "https://deno.land/x/cache/mod.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

import { onlyUnique } from './helpers/onlyUnique.ts'

export const addToObject = (string: string, object: any) => {
  const lines = string.split('\n')
  for (const line of lines) {
    const [key, ...values] = line.split(': ')
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

const get = async (i: number) => {
  let file
  try {
    file = await cache(`https://globalrecordings.net/en/language/${i.toString().padStart(5, '0')}`);
  }
  catch {
    return
  }
  const page = await Deno.readTextFile(file.path);
  const doc = new DOMParser().parseFromString(page, "text/html")!
  const rows = doc.querySelectorAll("main #content .row")!

  const firstParagraph = (rows[1] as Element).querySelector('p:first-child')
  const object: { [key: string]: string | Array<string> | number } = {}

  const h2s = (rows[1] as Element).querySelectorAll('h2')

  for (const header of [...h2s]) {
    if (header.textContent.startsWith('Other names for ')) {
      const otherNamesParagraph = (header as Element).nextElementSibling!
      const names = otherNamesParagraph.innerHTML.split('<br>')
      .map(name => name.replace(/(<([^>]+)>)/gi, ""))
      .map(name => name.replace('\n', ''))
      object.names = names
    }

    if (header.textContent.startsWith('Where') && header.textContent.endsWith('is spoken')) {
      const countriesParagraph = (header as Element).nextElementSibling!
      const links = [...countriesParagraph.querySelectorAll('a')]
      const countryCodes = links.map((link) => (link as Element)!.getAttribute('href'))
      .map((href) => (href as string).replace('/en/country/', ''))
      
      object.countries = countryCodes
    }

    if (header.textContent.startsWith('People Groups')) {
      const peopleGroupsParagraph = (header as Element).nextElementSibling!.nextElementSibling!
      const peopleGroupsLine = peopleGroupsParagraph.textContent
      const peopleGroups = peopleGroupsLine.substring(0, peopleGroupsLine.length -3).split(/; /)
      object.peopleGroups = peopleGroups.filter(onlyUnique)
    }

    if (header.textContent.startsWith('Information about')) {
      const populationParagraph1 = (header as Element).nextElementSibling!
      const populationParagraph2 = (header as Element).nextElementSibling!.nextElementSibling!
      addToObject(populationParagraph1.textContent, object)
      addToObject(populationParagraph2.textContent, object)
    }
  }

  addToObject(firstParagraph!.textContent, object)

  if (object.Population) object.Population = parseInt((object.Population as string).replaceAll(',', ''))
  return object
}

const languages: Array<any> = []

for (let i = 1; i <= 27986; i++) {
  const language = await get(i)
  if (language) languages.push(language)
  console.log(i)
}

Deno.writeTextFileSync('./data.json', JSON.stringify(languages, null, 2))

// console.log(await get(11720))