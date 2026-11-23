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
  | 'destinations'
  | 'packages'
  | 'stays'
  | 'bookings'
  | 'inquiries'
  | 'offers'
  | 'settings'

export interface AdminPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
}
