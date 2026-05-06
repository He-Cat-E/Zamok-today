export type TransactionStatus = 'Completed' | 'Hold' | 'Transferred' | 'Pending'

export type TransactionRow = {
  amount: string
  bookingId: string
  clientName: string
  date: string
  status: TransactionStatus
}

export const walletBalances = {
  available: '₽12,500',
  onHold: '₽8,000',
}

export const transactionRows: TransactionRow[] = [
  {
    amount: '₽12,500',
    bookingId: '#BK20260430',
    clientName: 'Anastasia Ivanova',
    date: '28 April 2026',
    status: 'Completed',
  },
  {
    amount: '₽7,000',
    bookingId: '#BK20260430',
    clientName: 'Ekaterina Petrova',
    date: '28 April 2026',
    status: 'Hold',
  },
  {
    amount: '₽11,250',
    bookingId: '#BK20260430',
    clientName: 'Maria Sokolova',
    date: '28 April 2026',
    status: 'Transferred',
  },
  {
    amount: '₽500',
    bookingId: '#BK20260430',
    clientName: 'Natalia Morozova',
    date: '28 April 2026',
    status: 'Completed',
  },
  {
    amount: '₽11,250',
    bookingId: '#BK20260430',
    clientName: 'Alina Vasilieva',
    date: '28 April 2026',
    status: 'Completed',
  },
]

export type WithdrawalRow = {
  amount: string
  bookingId: string
  date: string
  status: 'Completed' | 'Pending'
}

export const recentWithdrawals: WithdrawalRow[] = [
  {
    amount: '₽12,500',
    bookingId: '#BK20260430',
    date: '28 April 2026',
    status: 'Completed',
  },
  {
    amount: '₽11,250',
    bookingId: '#BK20260430',
    date: '28 April 2026',
    status: 'Pending',
  },
  {
    amount: '₽11,250',
    bookingId: '#BK20260430',
    date: '28 April 2026',
    status: 'Completed',
  },
]
