import { Box } from '@chakra-ui/react'
import { CollapsibleCard } from './CollapsibleCard'

export function OnMapCard() {
  return (
    <CollapsibleCard title="On Map">
      <Box
        borderRadius="md"
        h={{ base: '220px', md: '300px' }}
        overflow="hidden"
        position="relative"
        w="100%"
      >
        <iframe
          loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=37.5%2C55.7%2C37.7%2C55.8&layer=mapnik"
          style={{ border: 0, height: '100%', width: '100%' }}
          title="Profile location on map"
        />
      </Box>
    </CollapsibleCard>
  )
}
