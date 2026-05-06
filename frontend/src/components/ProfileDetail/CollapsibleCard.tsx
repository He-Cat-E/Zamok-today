import { Box, HStack } from '@chakra-ui/react'
import { useState, type ReactNode } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { AppCard, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'

type CollapsibleCardProps = {
  children: ReactNode
  defaultOpen?: boolean
  title: string
}

export function CollapsibleCard({ children, defaultOpen = true, title }: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <AppCard>
      <Box p={{ base: '4', md: '5' }}>
        <HStack align="center" justify="space-between">
          <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
            {title}
          </AppText>
          <Box
            alignItems="center"
            bg={themeColors.brand.primary}
            borderRadius="md"
            color={themeColors.app.overlayText}
            cursor="pointer"
            display="flex"
            h="28px"
            justifyContent="center"
            onClick={() => setOpen((v) => !v)}
            w="28px"
            _hover={{ bg: themeColors.brand.primaryHover }}
          >
            <AppIcon as={open ? MdKeyboardArrowUp : MdKeyboardArrowDown} size="20px" />
          </Box>
        </HStack>

        {open && (
          <Box borderColor={themeColors.border.default} borderTopWidth="1px" mt="4" pt="4">
            {children}
          </Box>
        )}
      </Box>
    </AppCard>
  )
}
