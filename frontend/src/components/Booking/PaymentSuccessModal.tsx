import { Box, HStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { MdCheck } from 'react-icons/md'
import { AppColumn, AppHeading, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'

type PaymentSuccessModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function PaymentSuccessModal({ isOpen, onClose }: PaymentSuccessModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <Box
      alignItems="center"
      bg="rgba(43, 27, 27, 0.55)"
      bottom="0"
      display="flex"
      justifyContent="center"
      left="0"
      onClick={onClose}
      position="fixed"
      px="4"
      py="8"
      right="0"
      top="0"
      zIndex="modal"
    >
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow={themeColors.shadow.sm}
        maxW="460px"
        onClick={(e) => e.stopPropagation()}
        p={{ base: '6', md: '8' }}
        w="100%"
      >
        <AppColumn align="center" gap="4">
          <Box
            alignItems="center"
            borderColor="#1FA463"
            borderRadius="full"
            borderWidth="3px"
            color="#1FA463"
            display="flex"
            h="68px"
            justifyContent="center"
            w="68px"
          >
            <AppIcon as={MdCheck} color="#1FA463" size="36px" />
          </Box>

          <AppHeading align="center" size={{ base: 'xl', md: '2xl' }}>
            Payment Successful
          </AppHeading>

          <AppText align="center" color={themeColors.app.textSecondary} fontSize="sm">
            Your payment has been successfully processed. Your booking is now confirmed.
          </AppText>

          <Box
            bg="#EAF6EE"
            borderColor="#1FA463"
            borderRadius="md"
            borderWidth="1px"
            p="3"
            w="100%"
          >
            <AppColumn align="stretch" gap="2">
              <HStack justify="space-between">
                <AppText color={themeColors.app.text} fontSize="sm">
                  Booking Status
                </AppText>
                <AppText color="#1FA463" fontSize="sm" fontWeight="bold">
                  Confirmed
                </AppText>
              </HStack>
              <HStack justify="space-between">
                <AppText color={themeColors.app.text} fontSize="sm">
                  Payment Status
                </AppText>
                <AppText color="#1FA463" fontSize="sm" fontWeight="bold">
                  Paid
                </AppText>
              </HStack>
            </AppColumn>
          </Box>
        </AppColumn>
      </Box>
    </Box>
  )
}
