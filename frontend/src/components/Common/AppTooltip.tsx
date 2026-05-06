import { Box, Button } from '@chakra-ui/react'
import { themeColors } from '../../theme'

export function AppTooltip() {
  return (
    <Box className="tooltip-wrap" display="inline-block" position="relative">
      <Button size="sm" variant="outline">
        Hover info
      </Button>
      <Box
        className="tooltip-box"
        bg={themeColors.app.textHeading}
        borderRadius="md"
        bottom="calc(100% + 8px)"
        color={themeColors.app.overlayText}
        fontSize="xs"
        left="50%"
        px="3"
        py="2"
        position="absolute"
        transform="translateX(-50%)"
        whiteSpace="nowrap"
        zIndex="1"
      >
        Tooltip component
      </Box>
    </Box>
  )
}
