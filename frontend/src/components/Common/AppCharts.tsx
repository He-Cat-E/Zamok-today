import { Box, Flex, Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { themeColors } from '../../theme'

const bars = [
  { label: 'Mon', value: 38 },
  { label: 'Tue', value: 64 },
  { label: 'Wed', value: 48 },
  { label: 'Thu', value: 82 },
  { label: 'Fri', value: 58 },
]

export function AppCharts() {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
      <HStack align="end" h="180px" justify="space-between">
        {bars.map((bar) => (
          <Stack align="center" flex="1" gap="2" h="100%" justify="end" key={bar.label}>
            <Box
              bg={themeColors.chart.bar}
              borderTopRadius="md"
              h={`${bar.value}%`}
              minH="24px"
              w="70%"
            />
            <Text color={themeColors.app.textTertiary} fontSize="xs">
              {bar.label}
            </Text>
          </Stack>
        ))}
      </HStack>

      <Flex align="center" justify="center">
        <Flex
          align="center"
          bg={themeColors.chart.donut}
          borderRadius="full"
          boxSize={{ base: '150px', md: '170px' }}
          justify="center"
        >
          <Flex
            align="center"
            bg={themeColors.app.surface}
            borderRadius="full"
            boxSize={{ base: '96px', md: '110px' }}
            direction="column"
            justify="center"
          >
            <Heading size="lg">70%</Heading>
            <Text color={themeColors.app.textTertiary} fontSize="xs">
              Reach
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </SimpleGrid>
  )
}
