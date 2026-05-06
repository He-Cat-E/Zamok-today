import { Button } from '@chakra-ui/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { themeColors } from '../../theme'

type AppButtonVariant = 'solid' | 'outline' | 'ghost' | 'white'
type AppButtonSize = 'sm' | 'md' | 'lg'

type AppButtonProps = {
  children: ReactNode
  disabled?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  size?: AppButtonSize
  variant?: AppButtonVariant
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'>

const sizeMap: Record<AppButtonSize, { h: string; px: string; fontSize: string }> = {
  sm: { h: '36px', px: '14px', fontSize: 'sm' },
  md: { h: '44px', px: '20px', fontSize: 'md' },
  lg: { h: '52px', px: '28px', fontSize: 'md' },
}

export function AppButton({
  children,
  disabled = false,
  fullWidth = false,
  leftIcon,
  onClick,
  rightIcon,
  size = 'md',
  type = 'button',
  variant = 'solid',
}: AppButtonProps) {
  const sizing = sizeMap[size]

  const styles = (() => {
    switch (variant) {
      case 'solid':
        return {
          bg: themeColors.brand.primary,
          color: themeColors.app.overlayText,
          borderWidth: '0',
          hoverBg: themeColors.brand.primaryHover,
        }
      case 'outline':
        return {
          bg: 'transparent',
          color: themeColors.brand.primary,
          borderColor: themeColors.brand.primary,
          borderWidth: '1px',
          hoverBg: themeColors.brand.primarySoft,
        }
      case 'ghost':
        return {
          bg: 'transparent',
          color: themeColors.app.textBody,
          borderWidth: '0',
          hoverBg: themeColors.app.surfaceSoft,
        }
      case 'white':
        return {
          bg: themeColors.app.surface,
          color: themeColors.app.text,
          borderWidth: '0',
          hoverBg: themeColors.app.surfaceSoft,
        }
    }
  })()

  return (
    <Button
      bg={styles.bg}
      borderColor={styles.borderColor}
      borderRadius="md"
      borderWidth={styles.borderWidth}
      color={styles.color}
      disabled={disabled}
      fontSize={sizing.fontSize}
      fontWeight="medium"
      gap="2"
      h={sizing.h}
      onClick={onClick}
      px={sizing.px}
      type={type}
      w={fullWidth ? '100%' : undefined}
      _hover={{ bg: styles.hoverBg }}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Button>
  )
}
