import React, { useState } from 'react'
import { RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { faqs } from '../data/travelData'

interface HelpPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
}

export function HelpPage({ navigate, onToast }: HelpPageProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMsg, setTicketMsg] = useState('')
  const [ticketSubmitted, setTicketSubmitted] = useState(false)

  const categories = ['All', 'About Us', 'Booking & Payment', 'Customization', 'Policies', 'Support']

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketMsg) return
    setTicketSubmitted(true)
    onToast('Support ticket #SUP-8472 created! Concierge team will respond shortly.')
  }

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl text-center">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Icon name="help" size={16} /> Help Centre & FAQs
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal">
              How can we help you today?
            </h1>
            <p className="text-[#dce9e6] text-sm leading-relaxed">
              Find answers to policies, booking questions, trip customization, payments, and cancellations.
            </p>
            <div className="pt-2 max-w-lg mx-auto relative">
              <Icon name="search" size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search queries (e.g. refund, payment, hotels, driver)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: FAQs with Category Selector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === c
                      ? 'bg-[#0b4941] text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl text-center text-gray-500 text-sm">
                  No matching answers found for "{search}". Try searching another keyword or create a support ticket.
                </div>
              ) : (
                filteredFaqs.map((faq, i) => {
                  const isOpen = openIdx === i
                  return (
                    <div
                      key={faq.question}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : i)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900"
                      >
                        <span>{faq.question}</span>
                        <Icon
                          name="chevron"
                          size={18}
                          className={`transform transition-transform text-[#0b4941] flex-none ${
                            isOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Support Ticket & WhatsApp */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-4">
              <span className="text-[10px] uppercase font-bold text-[#ef4934] tracking-widest block">
                Direct Helpdesk
              </span>
              <h3 className="font-serif font-bold text-xl text-gray-900">
                Raise a Support Ticket
              </h3>
              <p className="text-xs text-gray-500">
                Need specific assistance for an active reservation or flight modification? Submit a ticket below.
              </p>

              {ticketSubmitted ? (
                <div className="p-6 bg-green-50 rounded-2xl border border-green-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto text-sm font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-green-900 text-sm">Ticket #SUP-8472 Logged</h4>
                  <p className="text-xs text-green-800">
                    Our traveler support team is on it and will reply via email / phone.
                  </p>
                  <button
                    onClick={() => setTicketSubmitted(false)}
                    className="mt-2 text-xs font-bold text-green-900 underline"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Reschedule Kashmir departure date"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                      Message / Request Details
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={ticketMsg}
                      onChange={(e) => setTicketMsg(e.target.value)}
                      placeholder="Provide booking reference and details..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#0b4941] hover:bg-[#072f2b] text-white text-xs font-bold transition-all shadow-md"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              )}
            </div>

            {/* Quick WhatsApp Box */}
            <div className="bg-[#fbfaf7] p-6 rounded-3xl border border-gray-200 text-center space-y-3">
              <span className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                <Icon name="whatsapp" size={20} />
              </span>
              <h4 className="font-bold text-sm text-gray-900">Need Immediate Help?</h4>
              <p className="text-xs text-gray-500">
                Our WhatsApp Concierge is available 24/7 for travelers currently on the road.
              </p>
              <a
                href="https://wa.me/918047112112"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-5 py-2 rounded-xl bg-green-600 text-white font-bold text-xs hover:bg-green-700"
              >
                Open WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
