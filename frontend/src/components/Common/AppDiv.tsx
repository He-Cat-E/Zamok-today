import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ResponsiveValue } from './types'

type AppDivProps = {
  children?: ReactNode
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main' | 'aside'
  bg?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  h?: ResponsiveValue<string>
  maxW?: ResponsiveValue<string>
  mx?: ResponsiveValue<string>
  my?: ResponsiveValue<string>
  p?: ResponsiveValue<string>
  px?: ResponsiveValue<string>
  py?: ResponsiveValue<string>
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky'
  shadow?: string
  w?: ResponsiveValue<string>
}

export function AppDiv({ children, as = 'div', ...rest }: AppDivProps) {
  return (
    <Box as={as} {...rest}>
      {children}
    </Box>
  )
}
