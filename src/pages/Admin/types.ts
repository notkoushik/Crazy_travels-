import {
  BookingSubmission,
  DestinationItem,
  InquirySubmission,
  OfferItem,
  PackageItem,
  RouteName,
  StayItem,
} from '../../types/travel'

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
