import { Heading } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { themeColors } from '../../theme'

type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

type AppHeadingProps = {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: string
  size?: HeadingSize | { base?: HeadingSize; sm?: HeadingSize; md?: HeadingSize; lg?: HeadingSize; xl?: HeadingSize }
  weight?: 'medium' | 'semibold' | 'bold' | 'extrabold'
}

export function AppHeading({
  children,
  align,
  as = 'h2',
  color = themeColors.app.textHeading,
  size = { base: 'xl', md: '3xl' },
  weight = 'bold',
}: AppHeadingProps) {
  return (
    <Heading as={as} color={color} fontWeight={weight} size={size} textAlign={align}>
      {children}
    </Heading>
  )
}
