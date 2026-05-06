import { Box, HStack } from '@chakra-ui/react'
import { useState, type ReactNode } from 'react'
import { FaCamera, FaImage, FaMapMarkerAlt } from 'react-icons/fa'
import {
  MdAttachFile,
  MdCall,
  MdChatBubble,
  MdDoneAll,
  MdMic,
  MdMoreVert,
  MdSend,
  MdSentimentSatisfiedAlt,
  MdVideocam,
} from 'react-icons/md'
import { AppCard, AppColumn, AppIcon, AppImage, AppText } from '../Common'
import { themeColors } from '../../theme'
import { conversationMessages, type ChatBubble } from './bookingData'

type ConversationPanelProps = {
  showAttachmentChips?: boolean
}

export function ConversationPanel({ showAttachmentChips = false }: ConversationPanelProps) {
  return (
    <AppCard>
      <AppColumn align="stretch" gap="0">
        <PanelHeader />

        <Box
          borderColor={themeColors.border.default}
          borderTopWidth="1px"
          maxH={{ base: '460px', md: '560px' }}
          overflowY="auto"
          p={{ base: '4', md: '5' }}
        >
          <AppColumn align="stretch" gap="3">
            {conversationMessages.map((msg, idx) => (
              <MessageRow key={idx} message={msg} />
            ))}
          </AppColumn>
        </Box>

        {showAttachmentChips && <AttachmentChips />}
        <MessageInput />
      </AppColumn>
    </AppCard>
  )
}

function PanelHeader() {
  return (
    <Box p={{ base: '4', md: '5' }}>
      <HStack align="center" justify="space-between">
        <HStack gap="3">
          <Box
            alignItems="center"
            bg={themeColors.app.text}
            borderRadius="full"
            color={themeColors.app.overlayText}
            display="flex"
            h="40px"
            justifyContent="center"
            w="40px"
          >
            <AppIcon as={MdChatBubble} size="20px" />
          </Box>
          <AppColumn align="start" gap="0">
            <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
              Conversation
            </AppText>
            <AppText color={themeColors.app.textSecondary} fontSize="xs">
              Booking Chat
            </AppText>
          </AppColumn>
        </HStack>

        <HStack gap="2">
          <CircleAction icon={MdCall} />
          <CircleAction icon={MdVideocam} />
          <Box color={themeColors.app.text} cursor="pointer" px="1">
            <AppIcon as={MdMoreVert} size="20px" />
          </Box>
        </HStack>
      </HStack>
    </Box>
  )
}

function CircleAction({ icon }: { icon: React.ComponentType }) {
  return (
    <Box
      alignItems="center"
      bg={themeColors.brand.primary}
      borderRadius="full"
      color={themeColors.app.overlayText}
      cursor="pointer"
      display="flex"
      h="32px"
      justifyContent="center"
      w="32px"
      _hover={{ bg: themeColors.brand.primaryHover }}
    >
      <AppIcon as={icon} size="16px" />
    </Box>
  )
}

function MessageRow({ message }: { message: ChatBubble }) {
  switch (message.kind) {
    case 'date':
      return (
        <HStack justify="center">
          <Box
            bg={themeColors.app.text}
            borderRadius="md"
            color={themeColors.app.overlayText}
            fontSize="xs"
            px="3"
            py="1"
          >
            {message.text}
          </Box>
        </HStack>
      )
    case 'system':
      return (
        <HStack justify="center">
          <Box
            bg="#FBE9C7"
            borderRadius="md"
            color="#5A4716"
            fontSize="xs"
            px="3"
            py="1.5"
          >
            {message.text}
          </Box>
        </HStack>
      )
    case 'them':
      return (
        <HStack align="end" gap="2" justify="start">
          <Box borderRadius="full" h="32px" overflow="hidden" w="32px">
            <AppImage alt="Sender" h="100%" src={message.avatar} w="100%" />
          </Box>
          <Bubble side="them">
            <HStack align="end" gap="2">
              <AppText color={themeColors.app.text} fontSize="sm">
                {message.text}
              </AppText>
              <AppText color={themeColors.app.textSecondary} fontSize="xs">
                {message.time}
              </AppText>
            </HStack>
          </Bubble>
        </HStack>
      )
    case 'me':
      return (
        <HStack justify="end">
          <Bubble side="me">
            <HStack align="end" gap="2">
              <AppText color={themeColors.app.text} fontSize="sm">
                {message.text}
              </AppText>
              <AppText color={themeColors.app.textSecondary} fontSize="xs">
                {message.time}
              </AppText>
              <AppIcon as={MdDoneAll} color="#3B82F6" size="14px" />
            </HStack>
          </Bubble>
        </HStack>
      )
    case 'location':
      return (
        <HStack justify="end">
          <Box bg="#F4ECEA" borderRadius="md" maxW="260px" px="3" py="2.5">
            <HStack align="center" gap="2">
              <Box
                alignItems="center"
                bg={themeColors.brand.primary}
                borderRadius="full"
                color="white"
                display="flex"
                h="28px"
                justifyContent="center"
                w="28px"
              >
                <AppIcon as={FaMapMarkerAlt} size="14px" />
              </Box>
              <AppColumn align="start" gap="0">
                <AppText color={themeColors.app.text} fontSize="sm" fontWeight="bold">
                  {message.place}
                </AppText>
                <AppText color={themeColors.app.textSecondary} fontSize="xs">
                  {message.subtitle}
                </AppText>
              </AppColumn>
              <HStack gap="1">
                <AppText color={themeColors.app.textSecondary} fontSize="xs">
                  {message.time}
                </AppText>
                <AppIcon as={MdDoneAll} color="#3B82F6" size="14px" />
              </HStack>
            </HStack>
          </Box>
        </HStack>
      )
  }
}

function Bubble({ children, side }: { children: ReactNode; side: 'me' | 'them' }) {
  return (
    <Box
      bg={side === 'me' ? '#EAF2FE' : '#F4ECEA'}
      borderRadius="md"
      maxW={{ base: '80%', md: '320px' }}
      px="3"
      py="2"
    >
      {children}
    </Box>
  )
}

function AttachmentChips() {
  const chips = [
    { color: '#7C3AED', icon: FaImage, label: 'Gallery' },
    { color: '#EC4899', icon: FaCamera, label: 'Camera' },
    { color: '#22C55E', icon: FaMapMarkerAlt, label: 'Location' },
  ]

  return (
    <HStack gap="2" px={{ base: '4', md: '5' }} py="3" wrap="wrap">
      {chips.map((chip) => (
        <HStack
          bg="white"
          borderColor={themeColors.border.default}
          borderRadius="md"
          borderWidth="1px"
          gap="1.5"
          h="30px"
          key={chip.label}
          px="2.5"
        >
          <AppIcon as={chip.icon} color={chip.color} size="14px" />
          <AppText color={themeColors.app.text} fontSize="xs" fontWeight="medium">
            {chip.label}
          </AppText>
        </HStack>
      ))}
    </HStack>
  )
}

function MessageInput() {
  const [value, setValue] = useState('')

  return (
    <Box
      borderColor={themeColors.border.default}
      borderTopWidth="1px"
      p={{ base: '3', md: '4' }}
    >
      <HStack
        bg="white"
        borderColor={themeColors.border.default}
        borderRadius="full"
        borderWidth="1px"
        gap="2"
        h="44px"
        px="3"
      >
        <AppIcon as={MdSentimentSatisfiedAlt} color={themeColors.app.textSecondary} size="20px" />
        <Box flex="1">
          <input
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a message"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              outline: 'none',
              width: '100%',
            }}
            value={value}
          />
        </Box>
        <AppIcon as={MdAttachFile} color={themeColors.app.textSecondary} size="18px" />
        <AppIcon as={MdMic} color={themeColors.app.textSecondary} size="18px" />
        <Box
          alignItems="center"
          bg={themeColors.brand.primary}
          borderRadius="full"
          color="white"
          cursor="pointer"
          display="flex"
          h="30px"
          justifyContent="center"
          w="30px"
          _hover={{ bg: themeColors.brand.primaryHover }}
        >
          <AppIcon as={MdSend} size="14px" />
        </Box>
      </HStack>
    </Box>
  )
}
