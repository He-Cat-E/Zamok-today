import { Box, HStack } from '@chakra-ui/react'
import { MdArrowForward } from 'react-icons/md'
import { AppButton, AppCard, AppColumn, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'
import { transactionRows } from './walletData'
import { StatusPill } from './StatusPill'

export function TransactionsCard() {
  return (
    <AppCard>
      <Box p={{ base: '4', md: '5' }}>
        <AppColumn align="stretch" gap="4">
          <HStack align="center" justify="space-between">
            <AppText color={themeColors.app.text} fontSize="lg" fontWeight="bold">
              Transaction History
            </AppText>
            <AppButton
              rightIcon={<AppIcon as={MdArrowForward} size="16px" />}
              size="sm"
            >
              View All
            </AppButton>
          </HStack>

          <Box overflowX="auto">
            <Box as="table" borderCollapse="separate" borderSpacing="0" minW="720px" w="100%">
              <Box as="thead" bg={themeColors.brand.primary}>
                <Box as="tr">
                  {['Booking ID', 'Client Name', 'Amount', 'Status', 'Date'].map((header, idx) => (
                    <Box
                      as="th"
                      color={themeColors.app.overlayText}
                      fontSize="sm"
                      fontWeight="semibold"
                      key={header}
                      px="4"
                      py="3"
                      textAlign="left"
                      borderTopLeftRadius={idx === 0 ? 'md' : undefined}
                      borderTopRightRadius={idx === 4 ? 'md' : undefined}
                    >
                      {header}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box as="tbody">
                {transactionRows.map((row, idx) => (
                  <Box
                    as="tr"
                    borderColor={themeColors.border.default}
                    borderTopWidth={idx === 0 ? '0' : '1px'}
                    key={`${row.bookingId}-${idx}`}
                  >
                    <Box as="td" color={themeColors.app.text} fontSize="sm" px="4" py="3">
                      {row.bookingId}
                    </Box>
                    <Box as="td" color={themeColors.app.text} fontSize="sm" px="4" py="3">
                      {row.clientName}
                    </Box>
                    <Box as="td" color={themeColors.app.text} fontSize="sm" px="4" py="3">
                      {row.amount}
                    </Box>
                    <Box as="td" px="4" py="3">
                      <StatusPill status={row.status} />
                    </Box>
                    <Box
                      as="td"
                      color={themeColors.app.textSecondary}
                      fontSize="sm"
                      px="4"
                      py="3"
                    >
                      {row.date}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </AppColumn>
      </Box>
    </AppCard>
  )
}
