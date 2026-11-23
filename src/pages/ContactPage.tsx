import React, { useState } from 'react'
import { RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { officeLocations } from '../data/travelData'

interface ContactPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
}

export function ContactPage({ navigate, onToast }: ContactPageProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('Mumbai')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      onToast('Please enter your name and phone number.')
      return
    }
    setSubmitted(true)
    onToast('Message sent! A travel designer from your nearest office will call you within 30 minutes.')
  }

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="pin" size={16} /> Stores & Worldwide Support
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              We’re here, wherever your journey leads.
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              Visit our stores in Mumbai, New Delhi, and Bengaluru, connect on WhatsApp for instant inquiries, or call our 24/7 traveler concierge anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Offices & Form Grid */}
      <section className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: 3 Physical Offices */}
          <div className="lg:col-span-2 space-y-6">
            <div className="section-heading">
              <div>
                <span className="kicker">Visit us in person</span>
                <h2>Our Stores & Branch Offices</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {officeLocations.map((loc) => (
                <div
                  key={loc.city}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-[#ef4934]/10 text-[#ef4934] flex items-center justify-center font-bold">
                      <Icon name="pin" size={18} />
                    </span>
                    <h3 className="font-bold text-base text-gray-900">{loc.city}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{loc.address}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-700">
                    <p className="font-bold text-[#0b4941]">📞 {loc.phone}</p>
                    <p className="text-gray-500 text-[11px]">✉️ {loc.email}</p>
                    <p className="text-gray-400 text-[10px]">⏰ {loc.hours}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Toll-Free & WhatsApp Banner */}
            <div className="bg-[#0b4941] p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-[#ffd0c7] tracking-widest block">
                  Instant Support Hotline
                </span>
                <h4 className="text-xl font-bold font-serif">Call Toll-Free: +91 8047 112 112</h4>
                <p className="text-xs text-[#dce9e6]">Available Monday to Saturday, 9:00 AM to 8:00 PM IST</p>
              </div>
              <a
                href="https://wa.me/918047112112?text=Hello%20Crazy%20Tours%20Travels"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg flex-none"
              >
                <Icon name="whatsapp" size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Form: Inquire / Send Message */}
          <div>
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-5 sticky top-[calc(var(--site-nav-height)+1.5rem)]">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                    <Icon name="check" size={24} />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">Message Received!</h4>
                  <p className="text-xs text-gray-600">
                    Our travel designer for {city} will reach out to you within 30 minutes.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2 rounded-xl bg-[#0b4941] text-white text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-[#ef4934] tracking-widest block">
                    Fast Callback Service
                  </span>
                  <h3 className="font-serif font-bold text-xl text-gray-900">Send Us a Message</h3>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Roy"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      Nearest Branch
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
                    >
                      <option>Mumbai (Nariman Point)</option>
                      <option>New Delhi (Connaught Place)</option>
                      <option>Bengaluru (Indiranagar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      What can we help you with?
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your upcoming trip dates, destinations, or questions..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#ef4934]/30 transition-all"
                  >
                    <span>Request Callback</span>
                    <Icon name="arrow" size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
