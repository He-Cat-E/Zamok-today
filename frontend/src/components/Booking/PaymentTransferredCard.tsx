import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { MdCheckCircle, MdDownload, MdShield } from 'react-icons/md'
import { AppButton, AppCard, AppColumn, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'
import { bookingDetail } from './bookingData'

export function PaymentTransferredCard() {
  return (
    <AppCard>
      <Box p={{ base: '4', md: '6' }}>
        <AppColumn align="center" gap="4">
          <Box
            alignItems="center"
            bg="#E5ECF7"
            borderRadius="full"
            color="#3A4A6B"
            display="flex"
            h="56px"
            justifyContent="center"
            w="56px"
          >
            <AppIcon as={MdCheckCircle} color="#3A4A6B" size="30px" />
          </Box>

          <AppColumn align="center" gap="1">
            <AppText color={themeColors.app.text} fontSize="2xl" fontWeight="bold">
              Payment Transferred
            </AppText>
            <AppText color={themeColors.app.textSecondary} fontSize="sm">
              The payment has been successfully transferred to the service provider.
            </AppText>
          </AppColumn>

          <Box
            borderColor={themeColors.brand.primary}
            borderRadius="md"
            borderWidth="1px"
            p="4"
            w="100%"
          >
            <AppColumn align="stretch" gap="4">
              <SimpleGrid columns={2} gap="4">
                <Field label="Booking ID" value={bookingDetail.bookingId} />
                <Field align="right" label="Amount Held" value={bookingDetail.totalAmountValue} />
                <Field label="Platform Fee" value="RUB 800" />
                <Field align="right" label="Transfer Date" value="30 April 2026" />
              </SimpleGrid>

              <Box borderColor={themeColors.border.default} borderTopWidth="1px" pt="3">
                <HStack justify="space-between">
                  <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
                    Amount Transferred
                  </AppText>
                  <AppText color={themeColors.brand.primary} fontSize="sm" fontWeight="bold">
                    {bookingDetail.totalAmount}
                  </AppText>
                </HStack>
              </Box>
            </AppColumn>
          </Box>

          <HStack align="center" gap="2" w="100%">
            <AppIcon as={MdShield} color={themeColors.brand.primary} size="16px" />
            <AppText color={themeColors.app.textSecondary} fontSize="xs">
              This transaction has been securely processed.
            </AppText>
          </HStack>

          <AppButton fullWidth leftIcon={<AppIcon as={MdDownload} size="18px" />}>
            Receipt Download
          </AppButton>
        </AppColumn>
      </Box>
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
