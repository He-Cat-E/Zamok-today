import { Link as ChakraLink } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { themeColors } from '../../theme'

type AppLinkProps = {
  children: ReactNode
  color?: string
  external?: boolean
  fontSize?: string
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  to: string
}

export function AppLink({
  children,
  color = themeColors.app.textBody,
  external = false,
  fontSize = 'sm',
  fontWeight = 'normal',
  to,
}: AppLinkProps) {
  if (external) {
    return (
      <ChakraLink
        color={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        href={to}
        rel="noreferrer"
        target="_blank"
        transition="color 160ms ease"
        _hover={{ color: themeColors.brand.primary, textDecoration: 'none' }}
      >
        {children}
      </ChakraLink>
    )
  }

  return (
    <ChakraLink
      asChild
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      transition="color 160ms ease"
      _hover={{ color: themeColors.brand.primary, textDecoration: 'none' }}
    >
      <RouterLink to={to}>{children}</RouterLink>
    </ChakraLink>
  )
}
