import { chakra, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { themeColors } from '../../theme'
import type { ResponsiveValue } from './types'

const ChakraLabel = chakra('label')

type AppTextProps = {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  as?: 'p' | 'span' | 'label' | 'div'
  color?: string
  fontSize?: ResponsiveValue<string>
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  htmlFor?: string
  lineHeight?: string | number
  truncate?: boolean
}

export function AppText({
  children,
  align,
  as = 'p',
  color = themeColors.app.textBody,
  fontSize = { base: 'sm', md: 'md' },
  fontWeight = 'normal',
  htmlFor,
  lineHeight,
  truncate,
}: AppTextProps) {
  if (as === 'label') {
    return (
      <ChakraLabel
        color={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        htmlFor={htmlFor}
        lineHeight={lineHeight}
        textAlign={align}
      >
        {children}
      </ChakraLabel>
    )
  }

  return (
    <Text
      as={as}
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      textAlign={align}
      truncate={truncate}
    >
      {children}
    </Text>
  )
}
