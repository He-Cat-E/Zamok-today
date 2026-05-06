import { Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { AboutPage } from '@/pages/AboutPage'
import { BookingCompletePage } from '@/pages/BookingCompletePage'
import { BookingSummaryPage } from '@/pages/BookingSummaryPage'
import { FilterPage } from '@/pages/FilterPage'
import { HealthCheckPage } from '@/pages/HealthCheckPage'
import { HealthPlusPage } from '@/pages/HealthPlusPage'
import { HomePage } from '@/pages/HomePage'
import { HowItsWorkPage } from '@/pages/HowItsWorkPage'
import { IntimateMapPage } from '@/pages/IntimateMapPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PaymentHoldPage } from '@/pages/PaymentHoldPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { PaymentTransferredPage } from '@/pages/PaymentTransferredPage'
import { PreferablesPage } from '@/pages/PreferablesPage'
import { ProfileDetailPage } from '@/pages/ProfileDetailPage'
import { ProfilesListPage } from '@/pages/ProfilesListPage'
import { SalonsPage } from '@/pages/SalonsPage'
import { VerificationCenterPage } from '@/pages/VerificationCenterPage'
import { WalletPage } from '@/pages/WalletPage'
import { WithdrawPage } from '@/pages/WithdrawPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="filter" element={<FilterPage />} />
        <Route path="profiles" element={<ProfilesListPage />} />
        <Route path="profiles/:id" element={<ProfileDetailPage />} />
        <Route path="booking/summary" element={<BookingSummaryPage />} />
        <Route path="booking/payment" element={<PaymentPage />} />
        <Route path="booking/hold" element={<PaymentHoldPage />} />
        <Route path="booking/transferred" element={<PaymentTransferredPage />} />
        <Route path="booking/complete" element={<BookingCompletePage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="wallet/withdraw" element={<WithdrawPage />} />
        <Route path="preferables" element={<PreferablesPage />} />
        <Route path="verification-center" element={<VerificationCenterPage />} />
        <Route path="health-plus" element={<HealthPlusPage />} />
        <Route path="health-check" element={<HealthCheckPage />} />
        <Route path="salons" element={<SalonsPage />} />
        <Route path="intimate-map" element={<IntimateMapPage />} />
        <Route path="how-it-works" element={<HowItsWorkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
