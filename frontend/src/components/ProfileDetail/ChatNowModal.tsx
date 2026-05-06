import { Box } from '@chakra-ui/react'
import { useEffect, type ComponentType, type ReactNode } from 'react'
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { MdChatBubble, MdPhone } from 'react-icons/md'
import { AppColumn, AppHeading, AppIcon } from '../Common'
import { themeColors } from '../../theme'

type ChatNowModalProps = {
  isOpen: boolean
  onClose: () => void
  phone?: string
  telegramUrl?: string
  whatsappUrl?: string
}

export function ChatNowModal({
  isOpen,
  onClose,
  phone = '+7 (960) 270 09 16',
  telegramUrl = 'https://t.me/',
  whatsappUrl = 'https://wa.me/',
}: ChatNowModalProps) {
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

  const phoneHref = `tel:${phone.replace(/\s|\(|\)/g, '')}`

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
        maxW="440px"
        onClick={(e) => e.stopPropagation()}
        p={{ base: '6', md: '8' }}
        position="relative"
        w="100%"
      >
        <AppColumn align="center" gap="5">
          <Box
            alignItems="center"
            bg={themeColors.brand.primary}
            borderRadius="full"
            color={themeColors.app.overlayText}
            display="flex"
            h="64px"
            justifyContent="center"
            w="64px"
          >
            <AppIcon as={MdChatBubble} size="28px" />
          </Box>

          <AppHeading align="center" size={{ base: 'xl', md: '2xl' }}>
            Chat Now
          </AppHeading>

          <AppColumn align="stretch" gap="3">
            <ChatOption
              href={telegramUrl}
              icon={FaTelegramPlane}
              label="Telegram"
            />
            <ChatOption
              href={whatsappUrl}
              icon={FaWhatsapp}
              label="WhatsApp"
            />
            <ChatOption href={phoneHref} icon={MdPhone} label={phone} />
          </AppColumn>
        </AppColumn>
      </Box>
    </Box>
  )
}

function ChatOption({
  href,
  icon,
  label,
}: {
  href: string
  icon: ComponentType
  label: ReactNode
}) {
  return (
    <a href={href} rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }} target="_blank">
      <Box
        alignItems="center"
        bg="#FBE9C7"
        borderRadius="md"
        color="#5A4716"
        cursor="pointer"
        display="flex"
        fontSize="md"
        fontWeight="medium"
        gap="2"
        h="48px"
        justifyContent="center"
        px="4"
        transition="background 160ms ease"
        w="100%"
        _hover={{ bg: '#F7DEA8' }}
      >
        <AppIcon as={icon} color={themeColors.brand.primary} size="18px" />
        {label}
      </Box>
    </a>
  )
}
