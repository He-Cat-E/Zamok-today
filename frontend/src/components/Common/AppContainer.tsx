import { Container } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ResponsiveValue } from './types'

type AppContainerProps = {
  children: ReactNode
  maxW?: ResponsiveValue<string>
  px?: ResponsiveValue<string>
  py?: ResponsiveValue<string>
}

export function AppContainer({
  children,
  maxW = '7xl',
  px = { base: '4', md: '6' },
  py,
}: AppContainerProps) {
  return (
    <Container maxW={maxW} px={px} py={py}>
      {children}
    </Container>
  )
}
