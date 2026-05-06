import { Box } from '@chakra-ui/react'
import { themeColors } from '../../theme'

type AppDividerProps = {
  color?: string
  my?: string
}

export function AppDivider({ color = themeColors.border.default, my = '2' }: AppDividerProps = {}) {
  return <Box bg={color} h="1px" my={my} w="100%" />
}
