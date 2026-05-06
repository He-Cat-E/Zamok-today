import { Box } from '@chakra-ui/react'
import { useEffect } from 'react'
import { MdCheck } from 'react-icons/md'
import { AppColumn, AppHeading, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'

type WithdrawCompletedModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function WithdrawCompletedModal({ isOpen, onClose }: WithdrawCompletedModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
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
        borderRadius="xl"
        boxShadow={themeColors.shadow.sm}
        maxW="460px"
        onClick={(e) => e.stopPropagation()}
        p={{ base: '6', md: '8' }}
        w="100%"
      >
        <AppColumn align="center" gap="3">
          <Box
            alignItems="center"
            bg="#E0F4E5"
            borderRadius="full"
            color="#1FA463"
            display="flex"
            h="68px"
            justifyContent="center"
            w="68px"
          >
            <AppIcon as={MdCheck} color="#1FA463" size="34px" />
          </Box>

          <AppHeading align="center" size={{ base: 'xl', md: '2xl' }}>
            Withdrawal Completed
          </AppHeading>

          <AppText align="center" color={themeColors.app.textSecondary} fontSize="sm">
            Your funds have been successfully transferred to your bank account.
          </AppText>
        </AppColumn>
      </Box>
    </Box>
  )
}
