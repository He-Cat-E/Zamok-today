import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { themeColors } from '../../theme'
import type { ResponsiveValue } from './types'

type AppCardProps = {
  children: ReactNode
  bg?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  hoverShadow?: boolean
  overflow?: 'hidden' | 'visible'
  p?: ResponsiveValue<string>
}

export function AppCard({
  children,
  bg = themeColors.app.surface,
  borderColor = themeColors.border.default,
  borderRadius = 'lg',
  borderWidth = '1px',
  hoverShadow = false,
  overflow = 'hidden',
  p = '0',
}: AppCardProps) {
  return (
    <Box
      bg={bg}
      borderColor={borderColor}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
      overflow={overflow}
      p={p}
      shadow={themeColors.shadow.sm}
      transition="transform 200ms ease, box-shadow 200ms ease"
      _hover={
        hoverShadow
          ? { transform: 'translateY(-4px)', shadow: '0 24px 48px rgba(43, 27, 27, 0.12)' }
          : undefined
      }
    >
      {children}
    </Box>
  )
}
