const cc0 = 'https://creativecommons.org/publicdomain/zero/1.0/'
const ccBySa = 'https://creativecommons.org/licenses/by-sa/4.0/'

const dalLake = '/catalog-photos/dal-lake.jpg'
const keralaHouseboat = '/catalog-photos/kerala-houseboat.jpg'
const jaisalmerFort = '/catalog-photos/jaisalmer-fort.jpg'
const radhanagarBeach = '/catalog-photos/radhanagar-beach.jpg'
const tsomgoLake = '/catalog-photos/tsomgo-lake.jpg'

export const catalogPhotoCredits = new Map([
  [dalLake, { title: 'Dal Lake, Srinagar', author: 'Beboo1710', source: 'https://commons.wikimedia.org/wiki/File:DalLake.jpeg', license: cc0, licenseName: 'CC0' }],
  [keralaHouseboat, { title: 'Houseboat in the Kerala backwaters', author: 'RndmCrs', source: 'https://commons.wikimedia.org/wiki/File:A_Houseboat_in_Backwaters_of_Kerala.jpg', license: cc0, licenseName: 'CC0' }],
  [jaisalmerFort, { title: 'Jaisalmer Fort, Rajasthan', author: 'Clément Bardot', source: 'https://commons.wikimedia.org/wiki/File:Jaisalmer_Fort,_India.jpg', license: ccBySa, licenseName: 'CC BY-SA 4.0' }],
  [radhanagarBeach, { title: 'Radhanagar Beach, Andaman', author: 'Avijitchatterjee', source: 'https://commons.wikimedia.org/wiki/File:View_of_Radhanagar_Beach,_Havelock,_Andaman,_India.jpg', license: ccBySa, licenseName: 'CC BY-SA 4.0' }],
  [tsomgoLake, { title: 'Tsomgo Lake, Sikkim', author: 'Varun Pratap', source: 'https://commons.wikimedia.org/wiki/File:Tsomgo_Lake,_Sikkim.jpg', license: ccBySa, licenseName: 'CC BY-SA 4.0' }],
])

// The catalog's static and database seeds use different IDs for some of the same trips.
const packageGalleryDefaults = new Map([
  ['kashmir-tulips', dalLake],
  ['kerala-tea-trails', keralaHouseboat],
  ['kerala-backwaters', keralaHouseboat],
  ['rajasthan-royal', jaisalmerFort],
  ['rajasthan-royals', jaisalmerFort],
  ['andaman-coral-retreat', radhanagarBeach],
  ['andaman-paradise', radhanagarBeach],
  ['sikkim-monasteries', tsomgoLake],
  ['sikkim-himalaya', tsomgoLake],
])

export function getPackageGallery(id: string, gallery?: string[]) {
  if (gallery?.length) return gallery
  const photo = packageGalleryDefaults.get(id)
  return photo ? [photo] : []
}

export function catalogPhotoUrls(cover: string, gallery?: string[]) {
  const photos = new Map<string, string>()
  for (const value of [cover, ...(gallery ?? [])]) {
    const url = value?.trim()
    if (!url) continue
    // Existing catalog galleries sometimes repeat their Unsplash cover at a different size.
    const key = url.startsWith('https://images.unsplash.com/') ? url.split('?')[0] : url
    if (!photos.has(key)) photos.set(key, url)
  }
  return [...photos.values()]
}
