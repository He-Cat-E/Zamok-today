import { Badge, Box, Heading, Text } from '@chakra-ui/react'
import { themeColors } from '../../theme'

export function AnimatedCard() {
  return (
    <Box
      className="animated-card"
      bg={themeColors.app.surface}
      borderRadius="lg"
      borderWidth="1px"
      p="5"
      shadow={themeColors.shadow.sm}
    >
      <Badge bg={themeColors.brand.primary} color={themeColors.app.overlayText}>
        Animated
      </Badge>
      <Heading mt="3" size="md">
        Hover effect card
      </Heading>
      <Text color={themeColors.app.textSecondary} mt="2">
        Smooth movement and shadow states are applied with CSS.
      </Text>
    </Box>
  )
}
