import { cache } from "https://deno.land/x/cache/mod.ts";

const total = 27986

const cachePage = async (i: number) => {
  try {
    await cache(`https://globalrecordings.net/en/language/${i.toString().padStart(5, '0')}`)
    console.log(`cached ${i}`)
  }
  catch (exception) {
    if (exception?.message !== 'Not Found') {
      console.log(exception.message)
    }
    else {
      console.log(`Skipped ${i}`)
    }
  }
}

for (let i = 0; i < total; i = i + 5) {
  await Promise.all([
    cachePage(i),
    cachePage(i + 1),
    cachePage(i + 2),
    cachePage(i + 3),
    cachePage(i + 4)  
  ])
}

