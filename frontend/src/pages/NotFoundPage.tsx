import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Container maxW="6xl" py={{ base: 10, md: 16 }}>
      <VStack align="start" gap={4}>
        <Heading as="h1" size={{ base: '2xl', md: '4xl' }}>
          Page not found
        </Heading>
        <Text color="fg.muted">The route you opened does not exist.</Text>
        <Button asChild colorPalette="brand">
          <RouterLink to="/">Go home</RouterLink>
        </Button>
      </VStack>
    </Container>
  )
}
