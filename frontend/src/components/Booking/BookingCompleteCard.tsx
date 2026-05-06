import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { MdDownload, MdLocationOn, MdVerified } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppButton, AppCard, AppColumn, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'
import { bookingDetail } from './bookingData'
import { DetailRow } from './DetailRow'

export function BookingCompleteCard() {
  const navigate = useNavigate()
  return (
    <AppCard>
      <Box p={{ base: '4', md: '6' }}>
        <AppColumn align="stretch" gap="4">
          <AppText color={themeColors.app.text} fontSize="lg" fontWeight="bold">
            Booking Is Complete
          </AppText>

          <Box borderColor={themeColors.border.default} borderTopWidth="1px" pt="4">
            <AppColumn align="start" gap="1">
              <HStack gap="1.5">
                <AppText color={themeColors.app.text} fontSize="lg" fontWeight="bold">
                  {bookingDetail.name}
                </AppText>
                <AppIcon as={MdVerified} color="#1FA463" size="18px" />
              </HStack>
              <HStack color={themeColors.app.textSecondary} gap="1">
                <AppIcon as={MdLocationOn} color={themeColors.app.textSecondary} size="14px" />
                <AppText color={themeColors.app.textSecondary} fontSize="sm">
                  {bookingDetail.profileLocation}
                </AppText>
              </HStack>
            </AppColumn>
          </Box>

          <AppColumn align="stretch" gap="3">
            <DetailRow label="Services" value={bookingDetail.service} />
            <DetailRow label="Location" value={bookingDetail.location} />
            <DetailRow label="Time" value={bookingDetail.time} />
            <DetailRow label="Date" value={bookingDetail.date} />
            <DetailRow label="Booking ID" value={bookingDetail.bookingId} />
            <DetailRow
              label="Booking Status"
              value={bookingDetail.status}
              valueColor="#1FA463"
            />
            <DetailRow label="Total Amount Paid" value={bookingDetail.totalAmountValue} />
            <DetailRow label="Payment Method" value={bookingDetail.paymentMethod} />
            <DetailRow
              label="Payment Status"
              value={bookingDetail.paymentStatus}
              valueColor="#1FA463"
            />
            <DetailRow label="Transaction ID" value={bookingDetail.transactionId} />
          </AppColumn>

          <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
            <AppButton fullWidth leftIcon={<AppIcon as={MdDownload} size="18px" />}>
              Receipt Download
            </AppButton>
            <AppButton
              fullWidth
              onClick={() => navigate('/booking/transferred')}
              variant="outline"
            >
              View Transfer
            </AppButton>
          </SimpleGrid>
        </AppColumn>
      </Box>
    </AppCard>
  )
}
