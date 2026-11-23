import React, { useState } from 'react'
import { Icon } from '../Icon'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  user: { name: string; email: string } | null
  onLogin: (user: { name: string; email: string }) => void
  onLogout: () => void
  onToast: (msg: string) => void
}

export function AuthModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onToast,
}: AuthModalProps) {
  const [tab, setTab] = useState<'otp' | 'email'>('otp')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  if (!isOpen) return null

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setOtpSent(true)
    onToast(`6-digit verification code sent to +91 ${phone} (Demo code: 123456)`)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const userName = name || 'Traveler'
    onLogin({ name: userName, email: `${phone}@crazytourstravels.user` })
    onToast(`Welcome back, ${userName}!`)
    onClose()
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    const userName = name || email.split('@')[0]
    onLogin({ name: userName, email })
    onToast(`Welcome back, ${userName}!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 relative">
        {/* Header with Brand Logo */}
        <div className="bg-gradient-to-r from-[#072f2b] to-[#0b4941] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <Icon name="x" size={18} />
          </button>
          <div className="w-12 h-12 rounded-xl bg-[#ef4934] p-0.5 mx-auto mb-3 shadow-lg">
            <img src="/IMG_1611.PNG" alt="Crazy Tours Travels" className="w-full h-full object-cover rounded-lg" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">
            {user ? 'My Travel Account' : 'Welcome to Crazy Tours Travels'}
          </h3>
          <p className="text-xs text-[#dce9e6]/80 mt-1">
            {user ? 'Manage your bookings and saved itineraries' : 'Sign in to access exclusive member pricing and manage trips'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0b4941]/5 border border-[#0b4941]/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ef4934] text-white font-bold text-lg flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{user.name}</h4>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                    Verified Traveler
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <span className="block text-lg font-bold text-[#0b4941]">0</span>
                  <span className="text-gray-500">Active Bookings</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <span className="block text-lg font-bold text-[#ef4934]">₹2,500</span>
                  <span className="text-gray-500">Travel Wallet</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout()
                  onToast('You have signed out.')
                  onClose()
                }}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors mt-4"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-gray-100 p-1 mb-5 text-xs font-bold">
                <button
                  onClick={() => { setTab('otp'); setOtpSent(false) }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    tab === 'otp' ? 'bg-white text-[#0b4941] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Mobile Number / OTP
                </button>
                <button
                  onClick={() => setTab('email')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    tab === 'email' ? 'bg-white text-[#0b4941] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Email & Password
                </button>
              </div>

              {tab === 'otp' ? (
                !otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm font-semibold text-gray-600">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          required
                          className="flex-1 px-4 py-2.5 rounded-r-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-sm transition-all shadow-lg shadow-[#ef4934]/30"
                    >
                      Send Verification OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <p className="text-xs text-gray-600">
                      Enter the 6-digit verification code sent to <strong>+91 {phone}</strong>
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP (e.g. 123456)"
                      required
                      className="w-full text-center tracking-widest text-lg font-bold px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#ef4934]"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#0b4941] hover:bg-[#072f2b] text-white font-bold text-sm transition-all shadow-md"
                    >
                      Verify & Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs text-[#ef4934] font-semibold hover:underline"
                    >
                      Change Phone Number
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-sm transition-all shadow-lg shadow-[#ef4934]/30"
                  >
                    Sign In with Email
                  </button>
                </form>
              )}

              {/* Social Login option */}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    onLogin({ name: 'Google Explorer', email: 'explorer@gmail.com' })
                    onToast('Signed in with Google!')
                    onClose()
                  }}
                  className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.13C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.26A7.16 7.16 0 0 1 4.9 12c0-.79.14-1.56.38-2.26V6.61H1.27A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.27 5.39l4.01-3.13z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.27 6.61l4.01 3.13c.95-2.84 3.6-4.99 6.72-4.99z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
