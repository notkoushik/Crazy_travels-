import React from 'react'
import { Currency, DestinationItem, PackageItem, RouteName } from '../../types/travel'
import { Icon } from '../Icon'
import { formatPrice } from '../../data/travelData'

interface SavedTripsDrawerProps {
  isOpen: boolean
  onClose: () => void
  savedIds: string[]
  onRemove: (id: string) => void
  onClear: () => void
  destinations: DestinationItem[]
  packages: PackageItem[]
  navigate: (route: RouteName) => void
  currency: Currency
  onBook: (title: string, price: number) => void
}

export function SavedTripsDrawer({
  isOpen,
  onClose,
  savedIds,
  onRemove,
  onClear,
  destinations,
  packages,
  navigate,
  currency,
  onBook,
}: SavedTripsDrawerProps) {
  if (!isOpen) return null

  // Find saved destinations and packages
  const savedDestinations = destinations.filter((d) => savedIds.includes(d.city))
  const savedPackages = packages.filter((p) => savedIds.includes(p.id) || savedIds.includes(p.place))

  const totalCount = savedDestinations.length + savedPackages.length

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#072f2b] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ef4934] rounded-lg text-white">
              <Icon name="heart" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-serif">Saved Journeys</h3>
              <p className="text-xs text-[#dce9e6]/80">{totalCount} handpicked items in your wishlist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            aria-label="Close wishlist"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {totalCount === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Icon name="heart" size={28} />
              </div>
              <h4 className="font-bold text-gray-800">Your wishlist is empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Tap the heart icon on any tour package or destination to save it here for easy comparison.
              </p>
              <button
                onClick={() => {
                  navigate('packages')
                  onClose()
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#ef4934] text-white text-xs font-bold shadow-md hover:bg-[#df3a25]"
              >
                Explore Tour Packages
              </button>
            </div>
          ) : (
            <>
              {/* Destinations */}
              {savedDestinations.map((dest) => (
                <div
                  key={dest.slug}
                  className="p-3 rounded-2xl border border-gray-100 bg-[#fbfaf7] hover:shadow-md transition-shadow flex gap-3 relative group"
                >
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-24 h-24 rounded-xl object-cover flex-none"
                  />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4934]">
                        {dest.country} · {dest.duration}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm leading-snug">{dest.city}</h4>
                      <p className="text-xs font-semibold text-[#0b4941] mt-1">
                        From {formatPrice(dest.priceNum, currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          navigate(`destination/${dest.slug}`)
                          onClose()
                        }}
                        className="px-3 py-1 rounded-lg bg-[#0b4941] text-white text-xs font-semibold hover:bg-[#072f2b]"
                      >
                        View Guide
                      </button>
                      <button
                        onClick={() => {
                          onBook(`Explore ${dest.city}`, dest.priceNum)
                          onClose()
                        }}
                        className="px-3 py-1 rounded-lg bg-[#ef4934] text-white text-xs font-semibold hover:bg-[#df3a25]"
                      >
                        Plan Trip
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(dest.city)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                    title="Remove from saved"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}

              {/* Packages */}
              {savedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-3 rounded-2xl border border-gray-100 bg-[#fbfaf7] hover:shadow-md transition-shadow flex gap-3 relative group"
                >
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-24 h-24 rounded-xl object-cover flex-none"
                  />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4934]">
                        {pkg.duration} · {pkg.place}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm leading-snug">{pkg.title}</h4>
                      <p className="text-xs font-semibold text-[#0b4941] mt-1">
                        From {formatPrice(pkg.priceNum, currency)} / person
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          navigate(`package/${pkg.id}`)
                          onClose()
                        }}
                        className="px-3 py-1 rounded-lg bg-[#0b4941] text-white text-xs font-semibold hover:bg-[#072f2b]"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          onBook(pkg.title, pkg.priceNum)
                          onClose()
                        }}
                        className="px-3 py-1 rounded-lg bg-[#ef4934] text-white text-xs font-semibold hover:bg-[#df3a25]"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(pkg.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                    title="Remove from saved"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {totalCount > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white space-y-3">
            <button
              onClick={() => {
                onBook('Multi-Destination Saved Wishlist Inquiry', 50000)
                onClose()
              }}
              className="w-full py-3 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ef4934]/30"
            >
              <Icon name="sparkle" size={16} />
              <span>Inquire All Saved Journeys</span>
            </button>
            <button
              onClick={onClear}
              className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear Entire Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
