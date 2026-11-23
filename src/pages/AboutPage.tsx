import React from 'react'
import { RouteName } from '../types/travel'
import { Icon } from '../components/Icon'

interface AboutPageProps {
  navigate: (route: RouteName) => void
}

export function AboutPage({ navigate }: AboutPageProps) {
  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-3xl relative z-10">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="compass" size={16} /> Our Philosophy & Story
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              We believe travel should be deeply human.
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              Crazy Tours Travel was born from a simple belief: the most memorable journeys aren’t assembled by algorithms or rushed through checklists. They are designed by passionate travellers who listen, care, and know every turn of the road.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Values */}
      <section className="shell space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="kicker">Our Heritage</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              18 Years of Exploring the Indian Subcontinent
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Founded in 2008 by a small collective of mountaineers, cultural historians, and slow travellers, Crazy Tours Travel began as an intimate journey organizer for friends who wanted to see Kashmir beyond the tourist buses and Rajasthan beyond the souvenir shops.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Today, with offices in Mumbai, New Delhi, and Bengaluru, we have curated more than 24,000 journeys across 28 Indian states. Yet our core approach remains identical: every single itinerary is vetted by a human travel designer who has walked the ground.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs">
                <strong className="block text-xl font-bold text-[#0b4941]">24,000+</strong>
                <span className="text-[11px] text-gray-500">Curated Departures</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs">
                <strong className="block text-xl font-bold text-[#ef4934]">4.9 / 5</strong>
                <span className="text-[11px] text-gray-500">Average Traveler Rating</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs">
                <strong className="block text-xl font-bold text-[#072f2b]">100%</strong>
                <span className="text-[11px] text-gray-500">IATA & Ministry Certified</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-96">
            <img
              src="https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1200&q=88"
              alt="Crazy Tours Travel Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Core Principles */}
        <div className="space-y-6">
          <div className="section-heading text-center max-w-xl mx-auto">
            <div>
              <span className="kicker">How We Work</span>
              <h2>The Principles Behind Every Journey</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Human Design, Not Bots',
                desc: 'Real destination specialists talk with you, adapt to your family’s pacing, and suggest the secret tea house or quiet view.',
              },
              {
                num: '02',
                title: 'Verified Stays Only',
                desc: 'Every heritage haveli, plantation retreat, and luxury houseboat is personally inspected for character, safety, and hygiene.',
              },
              {
                num: '03',
                title: 'Transparent Pricing',
                desc: 'No hidden entrance fees, driver allowances, or surprise fuel surcharges. What we quote is the exact price you pay.',
              },
              {
                num: '04',
                title: '24/7 On-Trip Concierge',
                desc: 'Flight delayed? Want to change dinner timing? Your dedicated WhatsApp travel concierge handles everything seamlessly.',
              },
            ].map((p) => (
              <div
                key={p.num}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <span className="w-10 h-10 rounded-xl bg-[#0b4941]/10 text-[#0b4941] flex items-center justify-center font-bold text-sm">
                  {p.num}
                </span>
                <h4 className="font-bold text-base text-gray-900">{p.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-[#0b4941] rounded-3xl p-8 sm:p-12 text-white text-center max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-serif text-white">
            Ready to explore India with fresh eyes?
          </h3>
          <p className="text-sm text-[#dce9e6]">
            Start with one of our handcrafted holiday packages or let our designers create a completely original itinerary.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => navigate('packages')}
              className="px-6 py-3 rounded-full bg-[#ef4934] text-white font-bold text-xs shadow-lg hover:bg-[#df3a25]"
            >
              Explore Packages
            </button>
            <button
              onClick={() => navigate('contact')}
              className="px-6 py-3 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
