import React, { useState } from 'react'
import { RouteName, StoryItem } from '../types/travel'
import { Icon } from '../components/Icon'
import { useDynamicStore } from '../services/dataStore'
import kashmirImage from '../assets/wayfare-kashmir.webp'

interface StoriesPageProps {
  navigate: (route: RouteName) => void
}

export function StoriesPage({ navigate }: StoriesPageProps) {
  const store = useDynamicStore()
  const [readingStory, setReadingStory] = useState<StoryItem | null>(null)

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Hero Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="sparkle" size={16} /> The Crazy Travel Journal
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              Stories that take you somewhere.
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              Field notes, cultural essays, secret tea recipes, and reflections from our travellers, local hosts, and curious people on the road.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Cover Story */}
      <section className="shell mb-16">
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2">
          <div className="h-80 lg:h-auto">
            <img src={kashmirImage} alt="Kashmir Houseboat" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-between space-y-4">
            <div>
              <span className="kicker">Cover Story · Kashmir Valley</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2 mb-4 leading-tight">
                In Kashmir, spring arrives one quiet moment at a time.
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Beyond the famous tulip views, a gentler valley waits—in orchard kitchens, houseboat verandas on Nigeen Lake, and the age-old rituals of an early morning shikara ride through floating vegetable markets.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">By Aamir Mir & Priya Sharma · 6 min read</span>
              <button
                onClick={() => setReadingStory(store.stories[0] || null)}
                className="px-5 py-2.5 rounded-full bg-[#ef4934] hover:bg-[#df3a25] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#ef4934]/30"
              >
                <span>Read Full Article</span>
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Archive Grid */}
      <section className="shell">
        <div className="section-heading">
          <div>
            <span className="kicker">From the field</span>
            <h2>Dispatches & Travel Notes</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {store.stories.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#072f2b] text-[11px] font-bold">
                    {story.category}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] text-gray-400 block font-semibold">
                    {story.date} · {story.readTime}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-gray-900 leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {story.snippet}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">By {story.author}</span>
                <button
                  onClick={() => setReadingStory(story)}
                  className="text-xs font-bold text-[#ef4934] hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <Icon name="arrow" size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Story Reader Modal */}
      {readingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative p-6 sm:p-10">
            <button
              onClick={() => setReadingStory(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Icon name="x" size={18} />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ef4934] block mb-2">
              {readingStory.category} · {readingStory.readTime}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3 leading-snug">
              {readingStory.title}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Published by {readingStory.author} in {readingStory.date}
            </p>
            <img
              src={readingStory.image}
              alt={readingStory.title}
              className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-6 shadow-sm"
            />
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              {readingStory.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setReadingStory(null)}
                className="px-6 py-2.5 rounded-full bg-[#0b4941] text-white text-xs font-bold"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
