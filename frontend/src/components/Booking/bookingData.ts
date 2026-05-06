import { profileImages } from '../../assets'

export type ChatBubble =
  | { kind: 'date'; text: string }
  | { kind: 'system'; text: string }
  | { kind: 'them'; avatar: string; text: string; time: string }
  | { kind: 'me'; text: string; time: string }
  | { kind: 'location'; place: string; subtitle: string; time: string }

export const conversationMessages: ChatBubble[] = [
  { kind: 'date', text: 'Today' },
  { kind: 'system', text: 'Your booking request has been created.' },
  { kind: 'system', text: 'Please complete the payment using the provided details.' },
  {
    kind: 'them',
    avatar: profileImages[1] ?? profileImages[0] ?? '',
    text: "Hello, I'm available at your selected time",
    time: '19:44 pm',
  },
  { kind: 'me', text: 'Okay, I will complete the payment now', time: '19:44 pm' },
  { kind: 'me', text: 'I have completed the payment.', time: '19:50 pm' },
  { kind: 'system', text: 'Payment received.' },
  { kind: 'system', text: 'Booking confirmed.' },
  {
    kind: 'location',
    place: 'Live location shared',
    subtitle: 'Moscow, Russia',
    time: '19:50 pm',
  },
]

export type BookingDetail = {
  bookingId: string
  date: string
  location: string
  name: string
  paymentMethod: string
  paymentStatus: 'Paid' | 'Pending' | 'Completed'
  profileImage: string
  profileLocation: string
  service: string
  status: 'Confirmed' | 'Pending' | 'On Hold'
  time: string
  totalAmount: string
  totalAmountValue: string
  transactionId: string
}

export const bookingDetail: BookingDetail = {
  bookingId: '#BK20260430',
  date: '29 April 2026',
  location: 'Vanavara',
  name: 'Valeria Vance',
  paymentMethod: 'Card',
  paymentStatus: 'Completed',
  profileImage: profileImages[1] ?? profileImages[0] ?? '',
  profileLocation: 'Vanavara, Russia',
  service: '1 Hour (Day)',
  status: 'Confirmed',
  time: '08:00 PM',
  totalAmount: 'RUB 8,000',
  totalAmountValue: '₽8,000',
  transactionId: 'TXN102938',
}
