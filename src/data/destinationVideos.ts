export interface DestinationVideoInfo {
  videoUrl: string
  posterUrl: string
  title: string
  tagline: string
  locationBadge: string
}

export const heroVideoConfig = {
  videoUrl: '/Video/optimized/hero_soul_travel.mp4',
  posterUrl: '/Video/optimized/hero_soul_travel_poster.jpg',
  title: 'CRAZY TOURS 2026',
  teluguHeadline: 'తెలుగు యాత్రికుల మొదటి ఎంపిక',
  teluguSubheadline: 'Trusted by 24,000+ Telugu Travelers Across Andhra & Telangana',
  featuresNote: 'Europe, Kashmir, Kerala, Ladakh & Beyond — Expertly Handcrafted with Telugu Hospitality',
}

export const destinationVideos: Record<string, DestinationVideoInfo> = {
  kerala: {
    videoUrl: '/Video/optimized/destination_kerala.mp4',
    posterUrl: '/Video/optimized/destination_kerala_poster.jpg',
    title: 'Munnar Tea Country & Backwater Serenity',
    tagline: 'Scenic drives through rolling emerald tea gardens & tranquil backwaters',
    locationBadge: 'Kerala · God’s Own Country',
  },
  ladakh: {
    videoUrl: '/Video/optimized/destination_ladakh.mp4',
    posterUrl: '/Video/optimized/destination_ladakh_poster.jpg',
    title: 'Monasteries, High Passes & Starry Skies',
    tagline: 'Ancient cliffside monasteries & windswept Himalayan mountain passes',
    locationBadge: 'Ladakh · Land of High Passes',
  },
  kashmir: {
    videoUrl: '/Video/optimized/destination_kashmir.mp4',
    posterUrl: '/Video/optimized/destination_kashmir_poster.jpg',
    title: 'Snow Cottages, Meadows & Houseboats',
    tagline: 'Alpine valleys, snowy peaks and warm Kahwa mornings',
    locationBadge: 'Kashmir · Paradise on Earth',
  },
  sikkim: {
    videoUrl: '/Video/optimized/destination_sikkim.mp4',
    posterUrl: '/Video/optimized/destination_sikkim_poster.jpg',
    title: 'Sacred Glacial Waters & Mt. Kanchenjunga',
    tagline: 'Golden sunrises over Kanchenjunga and peaceful prayer flag trails',
    locationBadge: 'Sikkim & Darjeeling',
  },
  himachal: {
    videoUrl: '/Video/optimized/destination_himachal.mp4',
    posterUrl: '/Video/optimized/destination_himachal_poster.jpg',
    title: 'Pine Forests, Riverside Trails & Cedar Lodges',
    tagline: 'Breezy mountain valleys, wooden havens and high-altitude road trips',
    locationBadge: 'Himachal Pradesh',
  },
  manali: {
    videoUrl: '/Video/optimized/destination_himachal.mp4',
    posterUrl: '/Video/optimized/destination_himachal_poster.jpg',
    title: 'Pine Forests, Riverside Trails & Cedar Lodges',
    tagline: 'Breezy mountain valleys, wooden havens and high-altitude road trips',
    locationBadge: 'Himachal Pradesh',
  },
  kedarnath: {
    videoUrl: '/Video/optimized/destination_kedarnath.mp4',
    posterUrl: '/Video/optimized/destination_kedarnath_poster.jpg',
    title: 'Sacred Kedarnath Temple & Himalayas',
    tagline: 'Divine spiritual pilgrimage against towering snow-clad peaks',
    locationBadge: 'Uttarakhand · Devbhoomi',
  },
  adventure: {
    videoUrl: '/Video/optimized/destination_adventure.mp4',
    posterUrl: '/Video/optimized/destination_adventure_poster.jpg',
    title: 'Bachelor Squad Expeditions & High Passes',
    tagline: 'Unfiltered thrill, mountain ridge expeditions & golden sunrise views',
    locationBadge: 'Adventure & Expeditions',
  },
  rajasthan: {
    videoUrl: '/Video/optimized/destination_golden_peaks.mp4',
    posterUrl: '/Video/optimized/destination_golden_peaks_poster.jpg',
    title: 'Golden Sands, Royal Havelis & Forts',
    tagline: 'Sunlit desert dunes, royal palaces and starry night camps',
    locationBadge: 'Rajasthan · Royal Heritage',
  },
  goa: {
    videoUrl: '/Video/optimized/destination_kerala_backwaters.mp4',
    posterUrl: '/Video/optimized/destination_kerala_backwaters_poster.jpg',
    title: 'Coastal Sunsets, Secret Coves & Palms',
    tagline: 'Secluded beaches, colonial villas and gentle river cruises',
    locationBadge: 'Goa Coastal Retreat',
  },
  andaman: {
    videoUrl: '/Video/optimized/hero_soul_travel.mp4',
    posterUrl: '/Video/optimized/hero_soul_travel_poster.jpg',
    title: 'Turquoise Waters & Coral Island Reefs',
    tagline: 'White sand beaches, island hopping and crystal lagoons',
    locationBadge: 'Andaman & Nicobar',
  },
  hampi: {
    videoUrl: '/Video/optimized/destination_slow_travel.mp4',
    posterUrl: '/Video/optimized/destination_slow_travel_poster.jpg',
    title: 'Ancient Stone Temples & Sunlit Boulders',
    tagline: 'Historic Vijayanagara ruins, riverside trails and slow travel',
    locationBadge: 'Hampi · UNESCO World Heritage',
  },
}

export function getDestinationVideo(slugOrCity: string): DestinationVideoInfo | undefined {
  if (!slugOrCity) return undefined
  const key = slugOrCity.toLowerCase().trim()
  if (destinationVideos[key]) return destinationVideos[key]

  // Check substring matches
  const matchKey = Object.keys(destinationVideos).find(
    (k) => key.includes(k) || k.includes(key)
  )
  return matchKey ? destinationVideos[matchKey] : undefined
}
