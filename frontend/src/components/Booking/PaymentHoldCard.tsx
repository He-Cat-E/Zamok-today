import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaPauseCircle } from 'react-icons/fa'
import { MdShield } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppButton, AppCard, AppColumn, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'
import { bookingDetail } from './bookingData'
import { PaymentSuccessModal } from './PaymentSuccessModal'

export function PaymentHoldCard() {
  const [successOpen, setSuccessOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = window.setTimeout(() => setSuccessOpen(true), 600)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <AppCard>
      <Box p={{ base: '4', md: '6' }}>
        <AppColumn align="center" gap="4">
          <Box
            alignItems="center"
            bg="#E7DCD3"
            borderRadius="full"
            color="#7A5A3F"
            display="flex"
            h="56px"
            justifyContent="center"
            w="56px"
          >
            <AppIcon as={FaPauseCircle} size="26px" />
          </Box>

          <AppColumn align="center" gap="1">
            <AppText color={themeColors.app.text} fontSize="2xl" fontWeight="bold">
              Payment On Hold
            </AppText>
            <AppText color={themeColors.app.textSecondary} fontSize="sm">
              Your payment has been securely held.
            </AppText>
          </AppColumn>

          <Box
            borderColor={themeColors.brand.primary}
            borderRadius="md"
            borderWidth="1px"
            p="4"
            w="100%"
          >
            <SimpleGrid columns={2} gap="4">
              <Field label="Booking ID" value={bookingDetail.bookingId} />
              <Field label="Amount Held" align="right" value={bookingDetail.totalAmountValue} />
              <Field label="Payment Method" value={bookingDetail.paymentMethod} />
              <Field label="Hold Date" align="right" value={bookingDetail.date} />
            </SimpleGrid>
          </Box>

          <HStack align="start" gap="2" w="100%">
            <Box color={themeColors.brand.primary} pt="0.5">
              <AppIcon as={MdShield} color={themeColors.brand.primary} size="16px" />
            </Box>
            <AppText color={themeColors.app.textSecondary} fontSize="xs">
              Our Eskort system protects your funds until you confirm the service quality. this is part of our commitment safety.
            </AppText>
          </HStack>

          <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3" w="100%">
            <AppButton fullWidth onClick={() => navigate('/booking/complete')}>
              View Booking Detail
            </AppButton>
            <AppButton fullWidth variant="outline">
              Contact Support
            </AppButton>
          </SimpleGrid>
        </AppColumn>
      </Box>

      <PaymentSuccessModal isOpen={successOpen} onClose={() => setSuccessOpen(false)} />
    </AppCard>
  )
}

function Field({
  align = 'left',
  label,
  value,
}: {
  align?: 'left' | 'right'
  label: string
  value: string
}) {
  return (
    <AppColumn align={align === 'right' ? 'end' : 'start'} gap="1">
      <AppText color={themeColors.app.textSecondary} fontSize="xs">
        {label}
      </AppText>
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="bold">
        {value}
      </AppText>
    </AppColumn>
  )
}
