import {
  BookingSubmission,
  DestinationItem,
  InquirySubmission,
  OfferItem,
  PackageCategory,
  PackageItem,
  RouteName,
  StayItem,
} from '../../types/travel'

export type PackageCategoryFilter = 'All' | PackageCategory

export type AdminTab =
  | 'dashboard'
  | 'storefront'
  | 'destinations'
  | 'packages'
  | 'stays'
  | 'bookings'
  | 'inquiries'
  | 'offers'
  | 'reels'
  | 'settings'

export interface AdminPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
  route: RouteName
}
