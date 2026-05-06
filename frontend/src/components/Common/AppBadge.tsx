import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { themeColors } from '../../theme'

type AppBadgeVariant = 'success' | 'soft' | 'tag' | 'rank' | 'dark'

type AppBadgeProps = {
  children: ReactNode
  leftIcon?: ReactNode
  variant?: AppBadgeVariant
}

const variantStyles: Record<AppBadgeVariant, { bg: string; color: string; border?: string }> = {
  success: { bg: '#1FA463', color: '#FFFFFF' },
  soft: { bg: '#FBE9C7', color: '#5A4716' },
  tag: { bg: '#FBE9C7', color: '#5A4716' },
  rank: { bg: '#FFFFFF', color: themeColors.app.text, border: themeColors.border.default },
  dark: { bg: themeColors.app.text, color: '#FFFFFF' },
}

export function AppBadge({ children, leftIcon, variant = 'soft' }: AppBadgeProps) {
  const style = variantStyles[variant]

  return (
    <Box
      alignItems="center"
      bg={style.bg}
      borderColor={style.border}
      borderRadius="md"
      borderWidth={style.border ? '1px' : '0'}
      color={style.color}
      display="inline-flex"
      fontSize="xs"
      fontWeight="medium"
      gap="1.5"
      lineHeight="1"
      px="2"
      py="1.5"
    >
      {leftIcon}
      {children}
    </Box>
  )
}
