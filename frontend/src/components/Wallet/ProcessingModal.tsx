import { Box } from '@chakra-ui/react'
import { useEffect } from 'react'
import { AppColumn, AppHeading, AppText } from '../Common'
import { themeColors } from '../../theme'

type ProcessingModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ProcessingModal({ isOpen, onClose }: ProcessingModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

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
        maxW="420px"
        onClick={(e) => e.stopPropagation()}
        p={{ base: '6', md: '8' }}
        w="100%"
      >
        <AppColumn align="center" gap="3">
          <Box
            borderColor="rgba(161, 18, 23, 0.2)"
            borderRadius="full"
            borderTopColor={themeColors.brand.primary}
            borderWidth="4px"
            className="app-spinner"
            h="56px"
            w="56px"
          />

          <AppHeading align="center" size={{ base: 'xl', md: '2xl' }}>
            Processing
          </AppHeading>

          <AppText align="center" color={themeColors.app.textSecondary} fontSize="sm">
            The amount will be transferred within 2–5 business days.
          </AppText>
        </AppColumn>
      </Box>
    </Box>
  )
}
