import { IconButton } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { themeColors } from '../../theme'

type AppIconButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft'

type AppIconButtonProps = {
  ariaLabel: string
  children: ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: AppIconButtonVariant
}

const sizeMap = {
  sm: '32px',
  md: '40px',
  lg: '48px',
}

export function AppIconButton({
  ariaLabel,
  children,
  onClick,
  size = 'md',
  variant = 'solid',
}: AppIconButtonProps) {
  const dimension = sizeMap[size]

  const styles = (() => {
    switch (variant) {
      case 'solid':
        return { bg: themeColors.brand.primary, color: themeColors.app.overlayText, hoverBg: themeColors.brand.primaryHover }
      case 'outline':
        return { bg: 'transparent', color: themeColors.brand.primary, hoverBg: themeColors.brand.primarySoft, border: themeColors.brand.primary }
      case 'ghost':
        return { bg: 'transparent', color: themeColors.app.textBody, hoverBg: themeColors.app.surfaceSoft }
      case 'soft':
        return { bg: themeColors.app.surface, color: themeColors.brand.primary, hoverBg: themeColors.app.surfaceSoft }
    }
  })()

  return (
    <IconButton
      aria-label={ariaLabel}
      bg={styles.bg}
      borderColor={styles.border}
      borderRadius="md"
      borderWidth={styles.border ? '1px' : '0'}
      color={styles.color}
      h={dimension}
      minW={dimension}
      onClick={onClick}
      w={dimension}
      _hover={{ bg: styles.hoverBg }}
    >
      {children}
    </IconButton>
  )
}
