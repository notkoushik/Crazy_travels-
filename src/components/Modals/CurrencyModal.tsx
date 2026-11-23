import React from 'react'
import { Currency } from '../../types/travel'
import { Icon } from '../Icon'
import { CURRENCY_RATES } from '../../data/travelData'

interface CurrencyModalProps {
  isOpen: boolean
  onClose: () => void
  currentCurrency: Currency
  onSelectCurrency: (currency: Currency) => void
  onToast: (msg: string) => void
}

export function CurrencyModal({
  isOpen,
  onClose,
  currentCurrency,
  onSelectCurrency,
  onToast,
}: CurrencyModalProps) {
  if (!isOpen) return null

  const currencyList: { code: Currency; name: string; symbol: string; country: string }[] = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India' },
    { code: 'USD', name: 'United States Dollar', symbol: '$', country: 'United States' },
    { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
    { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', country: 'United Arab Emirates' },
  ]

  const languages = ['English (IN)', 'Hindi (हिंदी)', 'Bengali (বাংলা)', 'Tamil (தமிழ்)', 'Marathi (मराठी)']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 relative">
        <div className="bg-[#072f2b] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon name="globe" size={22} className="text-[#ef4934]" />
            <div>
              <h3 className="font-bold text-lg font-serif">Display Currency & Language</h3>
              <p className="text-xs text-[#dce9e6]/80">Select your preferred viewing currency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Currency options */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
              Choose Currency
            </label>
            <div className="grid grid-cols-1 gap-2">
              {currencyList.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    onSelectCurrency(item.code)
                    onToast(`Prices now displayed in ${item.name} (${item.symbol})`)
                    onClose()
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    currentCurrency === item.code
                      ? 'border-[#ef4934] bg-[#ef4934]/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-sm">
                      {item.symbol}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-gray-900 block">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.country}</span>
                    </div>
                  </div>
                  {currentCurrency === item.code && (
                    <span className="text-[#ef4934] font-bold text-xs flex items-center gap-1">
                      <Icon name="check" size={16} /> Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
              Language
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <button
                  key={lang}
                  onClick={() => {
                    onToast(`Language set to ${lang}`)
                    onClose()
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    idx === 0
                      ? 'bg-[#0b4941] text-white border-[#0b4941]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
