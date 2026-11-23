import React, { useState } from 'react'
import { Icon } from '../Icon'

interface LiveChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  onToast: (msg: string) => void
}

interface Message {
  sender: 'expert' | 'user'
  text: string
  time: string
}

export function LiveChatDrawer({ isOpen, onClose, onToast }: LiveChatDrawerProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'expert',
      text: 'Namaste! I am Ananya from the Crazy Tours Travels concierge team. How can I help plan your dream journey today?',
      time: 'Just now',
    },
  ])

  if (!isOpen) return null

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { sender: 'user', text: input, time: 'Just now' }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'expert',
          text: 'Thank you for reaching out! One of our regional destination specialists is reviewing your query. You can also connect directly with us on WhatsApp at +91 8047 112 112 for instantaneous photos and custom quotes.',
          time: 'Just now',
        },
      ])
    }, 1000)
  }

  const handleQuickQuestion = (q: string) => {
    setInput(q)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
        {/* Header */}
        <div className="bg-[#072f2b] p-4 text-white flex items-center justify-between border-b border-[#0b4941]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#ef4934] p-0.5">
                <img src="/IMG_1611.PNG" alt="Travel Expert" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#072f2b]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Ananya · Travel Specialist</h4>
              <p className="text-[11px] text-[#dce9e6]/80 flex items-center gap-1">
                <span>Crazy Tours Travels Concierge</span> · <span className="text-green-400">Online</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fbfaf7]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#ef4934] text-white rounded-br-xs'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {/* Quick Prompts */}
          <div className="pt-2">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">
              Popular questions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Best season to visit Kashmir?',
                'Can I customize a Kerala package?',
                'Do you arrange luxury road trips?',
                'What is your cancellation policy?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-left transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with WhatsApp & Message Input */}
        <div className="p-4 bg-white border-t border-gray-100 space-y-3">
          <a
            href="https://wa.me/918047112112?text=Hello%20Crazy%20Tours%20Travels,%20I%20would%20like%20to%20plan%20a%20holiday!"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Icon name="whatsapp" size={16} />
            <span>Chat Live on WhatsApp with an Expert</span>
          </a>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#ef4934]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#0b4941] hover:bg-[#072f2b] text-white transition-colors"
            >
              <Icon name="arrow" size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
