import { Box, HStack } from '@chakra-ui/react'
import { MdLocationOn, MdVerified } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppButton, AppCard, AppColumn, AppIcon, AppImage, AppText } from '../Common'
import { themeColors } from '../../theme'
import { bookingDetail } from './bookingData'
import { DetailRow } from './DetailRow'

export function BookingSummaryCard() {
  const navigate = useNavigate()

  return (
    <AppCard>
      <Box p={{ base: '4', md: '6' }}>
        <AppColumn align="stretch" gap="5">
          <AppText color={themeColors.app.text} fontSize="lg" fontWeight="bold">
            Booking Summary
          </AppText>

          <Box borderRadius="md" h="240px" overflow="hidden" w="100%">
            <AppImage alt={bookingDetail.name} h="100%" src={bookingDetail.profileImage} w="100%" />
          </Box>

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

          <AppColumn align="stretch" gap="3">
            <DetailRow label="Services" value={bookingDetail.service} />
            <DetailRow label="Location" value={bookingDetail.location} />
            <DetailRow label="Time" value={bookingDetail.time} />
            <DetailRow label="Date" value={bookingDetail.date} />
          </AppColumn>

          <Box borderColor={themeColors.border.default} borderTopWidth="1px" pt="4">
            <HStack justify="space-between">
              <AppText color={themeColors.brand.primary} fontSize="md" fontWeight="bold">
                Total Amount
              </AppText>
              <AppText color={themeColors.brand.primary} fontSize="md" fontWeight="bold">
                {bookingDetail.totalAmount}
              </AppText>
            </HStack>
          </Box>

          <AppButton fullWidth onClick={() => navigate('/booking/payment')}>
            Proceed to Payment
          </AppButton>
        </AppColumn>
      </Box>
    </AppCard>
  )
}
