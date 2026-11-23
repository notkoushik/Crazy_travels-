import React, { useState } from 'react'
import { RouteName } from '../../../types/travel'
import { Icon } from '../../../components/Icon'
import { dataStore } from '../../../services/dataStore'

interface AdminLoginScreenProps {
  onLoginSuccess: () => void
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
}

export function AdminLoginScreen({
  onLoginSuccess,
  navigate,
  onToast,
}: AdminLoginScreenProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setErrorMessage('Please enter the admin authorization key.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const success = await dataStore.adminLogin(password)
      if (success) {
        onToast('Admin credentials verified. Welcome to Operations Console!')
        onLoginSuccess()
      } else {
        setErrorMessage('Invalid authorization key. Access denied.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authorization failed. Check your network or key.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#072f2b] flex flex-col items-center justify-center p-4 relative overflow-hidden font-inter">
      {/* Decorative background glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#ef4934]/10 blur-[100px] pointer-events-none -bottom-20 -right-20" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative z-10 animate-fade-in">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#072f2b] via-[#0b4941] to-[#05211e] p-8 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-[#ef4934] p-1 mx-auto mb-4 shadow-lg ring-4 ring-white/10 flex items-center justify-center">
            <img
              src="/IMG_1611.PNG"
              alt="Crazy Tours Travel"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 text-[11px] font-semibold uppercase tracking-wider mb-2 font-inter-tight">
            <Icon name="shield" size={12} />
            <span>Encrypted Operations Gate</span>
          </div>

          <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
            Operations Console
          </h2>
          <p className="text-xs text-[#dce9e6]/80 mt-1.5 leading-relaxed max-w-xs mx-auto">
            Authorized personnel only. Access to confidential customer booking records and inventory controls is restricted.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6 bg-[#fbfaf7]/50">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5 animate-shake">
              <Icon name="x" size={16} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-inter-tight">
                Admin Access Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="Enter administrator passphrase"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4941] focus:border-transparent transition-all pr-11 bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                >
                  <Icon name="eye" size={16} />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Admin access key: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">Crazy_2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#0b4941] hover:bg-[#072f2b] active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed font-inter-tight"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <Icon name="shield" size={16} />
                  <span>Authenticate & Unlock Console</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => navigate('home')}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
            >
              <Icon name="arrow" size={14} className="rotate-180" />
              <span>Return to Public Website</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              Zero-Trust Guard
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
