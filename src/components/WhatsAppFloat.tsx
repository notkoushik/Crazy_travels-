import React from 'react'
import { Icon } from './Icon'

interface WhatsAppFloatProps {
  phoneNumber?: string
  defaultMessage?: string
  placement?: 'floating' | 'desktop-floating' | 'mobile-inline' | 'dock'
}

export function WhatsAppFloat({
  phoneNumber = '918894998808',
  defaultMessage = 'Hi Crazy Tours Travel, I would like to plan a trip with your expert concierge.',
  placement = 'floating',
}: WhatsAppFloatProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`
  const inline = placement === 'mobile-inline'
  const docked = placement === 'dock'
  const placementClass = inline
    ? 'mt-3 md:hidden'
    : docked ? 'relative flex items-center justify-end group'
    : `fixed right-5 bottom-5 z-40 items-center group ${placement === 'desktop-floating' ? 'hidden md:flex' : 'flex'}`

  return (
    <aside aria-label="WhatsApp live concierge support" className={placementClass}>
      {/* Tooltip on Desktop */}
      <div className={`hidden md:flex flex-col items-end mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none ${docked ? 'absolute right-full w-max' : ''}`}>
        <div className="bg-[#072f2b] text-white px-3.5 py-1.5 rounded-xl shadow-xl text-xs font-medium border border-emerald-900/40 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>Online Concierge · +91 88949 98808</span>
        </div>
        <span className="text-[10px] text-gray-500 font-medium mt-0.5 mr-1">Typically replies instantly</span>
      </div>

      {/* Main WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={inline ? 'Ask a travel expert on WhatsApp' : 'Chat with Crazy Tours Travel on WhatsApp: 88949 98808'}
        className={inline
          ? 'flex min-h-12 items-center gap-2.5 rounded-xl border border-[#dce8e1] bg-[#eef5ef] px-3 py-2 text-sm font-semibold text-[#103f36] hover:bg-[#e3efe6]'
          : `relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#075E54] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#25D366]/35 hover:shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/25 ${docked ? 'size-12 justify-center sm:w-auto sm:pl-3.5 sm:pr-4' : 'pl-3.5 pr-4 py-2.5'}`}
      >
        {/* Pulsing Ring Badge */}
        <span className="relative flex h-7 w-7 items-center justify-center flex-none">
          {!inline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75" />}
          {/* High-Definition WhatsApp Vector SVG */}
          <svg
            className={inline ? 'size-5' : 'size-6 drop-shadow-sm'}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.1 8.03 12.26C8.16 12.43 9.77 14.91 12.24 15.97C12.83 16.22 13.28 16.37 13.64 16.49C14.23 16.68 14.77 16.65 15.2 16.59C15.68 16.52 16.68 15.98 16.89 15.4C17.1 14.81 17.1 14.31 17.03 14.2C16.97 14.1 16.81 14.04 16.56 13.91C16.31 13.79 15.09 13.19 14.86 13.1C14.63 13.02 14.47 12.98 14.3 13.23C14.14 13.48 13.66 14.04 13.51 14.2C13.37 14.37 13.22 14.39 12.97 14.26C12.72 14.14 11.92 13.88 10.97 13.03C10.23 12.37 9.73 11.55 9.58 11.3C9.44 11.05 9.57 10.92 9.69 10.79C9.8 10.68 9.94 10.5 10.07 10.35C10.19 10.2 10.24 10.1 10.32 9.93C10.4 9.76 10.36 9.61 10.3 9.49C10.24 9.36 9.75 8.16 9.54 7.67C9.34 7.18 9.14 7.25 8.99 7.24C8.84 7.23 8.68 7.23 8.53 7.33Z" />
          </svg>
        </span>

        {/* Text Label */}
        <div className={`${docked ? 'hidden sm:flex' : 'flex'} flex-col leading-tight text-left`}>
          <span className="font-bold tracking-tight text-[13px] sm:text-[14px]">
            {inline ? 'Ask a travel expert' : 'Ask a Travel Expert'}
          </span>
          {!inline && (
            <span className="text-[10px] text-white/90 font-medium tracking-wide">
              +91 88949 98808
            </span>
          )}
        </div>
        {inline && <Icon name="arrow" size={16} className="ml-auto shrink-0" />}
      </a>
    </aside>
  )
}
