/**
 * The GRN uses FIPS country codes, we want to convert these.
 */

import { addToObject } from './helpers/addToObject.ts'
const data = JSON.parse(Deno.readTextFileSync('./data.json'))
import { cache } from "https://deno.land/x/cache/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const countryCodes = new Set()

for (const item of data) {
  if (item.countries) {
    for (const countryCode of item.countries) {
      countryCodes.add(countryCode)
    }
  }
}

const output: { [key: string]: any } = {}
for (const langCode of countryCodes) {
  try {
    const file = await await cache(`https://globalrecordings.net/en/country/${langCode}`)
    const page = await Deno.readTextFile(file.path);
    const doc = new DOMParser().parseFromString(page, "text/html")!
  
    const table = doc.querySelector('#content .row table') 
    const item: any = {}
    addToObject(table!.textContent, item)
    item.name = doc.querySelector('h1')?.textContent
    output[langCode as string] = item  
  }
  catch {}
}

Deno.writeTextFileSync('./countries.json', JSON.stringify(output, null, 2))
