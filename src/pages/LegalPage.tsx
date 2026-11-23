import React, { useState } from 'react'
import { RouteName } from '../types/travel'
import { Icon } from '../components/Icon'

interface LegalPageProps {
  initialTab?: 'terms' | 'privacy'
  navigate: (route: RouteName) => void
}

export function LegalPage({ initialTab = 'terms', navigate }: LegalPageProps) {
  const [tab, setTab] = useState<'terms' | 'privacy'>(initialTab)

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Icon name="shield" size={16} /> Legal & Compliance
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal">
              Trust, Transparency & Safety
            </h1>
            <p className="text-[#dce9e6] text-sm leading-relaxed">
              Clear terms, traveler protection standards, cancellation timelines, and data privacy policies for Crazy Tours Travel.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs and Policy Content */}
      <section className="shell max-w-4xl mx-auto">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
          <div className="flex rounded-2xl bg-gray-100 p-1.5 text-xs sm:text-sm font-bold max-w-md">
            <button
              onClick={() => setTab('terms')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                tab === 'terms' ? 'bg-[#0b4941] text-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setTab('privacy')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                tab === 'privacy' ? 'bg-[#0b4941] text-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Privacy & Data Policy
            </button>
          </div>

          {tab === 'terms' ? (
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Booking Terms & Conditions
              </h2>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-base">1. Booking & Confirmation</h4>
                <p>
                  All bookings are subject to availability of requested hotel categories and transport permits. A booking is considered confirmed upon receipt of the stipulated minimum 25% advance deposit and issuance of an official Crazy Tours Travel booking voucher.
                </p>

                <h4 className="font-bold text-gray-900 text-base">2. Cancellation & Refund Schedule</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
                  <li>30+ days prior to departure: 100% refund of land package minus banking fees.</li>
                  <li>15–29 days prior: 75% refund of refundable hotel and transport portion.</li>
                  <li>7–14 days prior: 50% refund.</li>
                  <li>Under 7 days: Non-refundable, with free rescheduling subject to hotel policies.</li>
                </ul>

                <h4 className="font-bold text-gray-900 text-base">3. Force Majeure & Weather Conditions</h4>
                <p>
                  In the event of unforeseen natural occurrences, landslides, sudden pass closures in Ladakh/Sikkim, or government flight advisories, Crazy Tours Travel will assist with alternative route planning and hotel adjustments.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Privacy Policy & Information Security
              </h2>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-base">1. Information We Collect</h4>
                <p>
                  We collect essential travel coordinates including passenger names, passport/ID details required for protected area permits (e.g. Ladakh Khardung La, Sikkim Nathula), phone numbers for driver dispatch, and email addresses for itinerary confirmation.
                </p>

                <h4 className="font-bold text-gray-900 text-base">2. Data Security & Storage</h4>
                <p>
                  Crazy Tours Travel never sells or shares your personal details with third-party advertisers. Your information is securely encrypted and used solely for hotel registrations, airline ticketing, and on-trip concierge communications.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
