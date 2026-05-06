import { Box, HStack } from '@chakra-ui/react'
import { MdAccessTime, MdChatBubble, MdFavoriteBorder, MdLocationOn, MdVerified } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppBadge, AppButton, AppCard, AppColumn, AppIcon, AppImage, AppText } from '../Common'
import { themeColors } from '../../theme'

export type ProfilePrice = { hr: number; twoHr: number; allDay: number }

export type ProfileCardProps = {
  image: string
  name: string
  location: string
  age: number
  height: number
  chest: number
  prices: ProfilePrice
  tags: string[]
  detailHref?: string
  healthBadge?: boolean
  rankBadge?: string
  verified?: boolean
}

function StatDot() {
  return <Box bg={themeColors.brand.primary} borderRadius="full" boxSize="6px" />
}

function PriceItem({ value }: { value: string }) {
  return (
    <HStack
      bg="white"
      borderColor={themeColors.border.default}
      borderRadius="md"
      borderWidth="1px"
      gap="1"
      h="28px"
      px="2"
    >
      <AppIcon as={MdAccessTime} color={themeColors.brand.primary} size="14px" />
      <AppText color={themeColors.app.text} fontSize="xs" fontWeight="medium">
        {value}
      </AppText>
    </HStack>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <Box bg="#FBE9C7" borderRadius="md" color="#5A4716" fontSize="xs" px="2" py="1">
      {label}
    </Box>
  )
}

export function ProfileCard({
  image,
  name,
  location,
  age,
  height,
  chest,
  prices,
  tags,
  detailHref = '/profiles/1',
  healthBadge = false,
  rankBadge,
  verified = true,
}: ProfileCardProps) {
  const navigate = useNavigate()
  const goToDetail = () => navigate(detailHref)
  return (
    <AppCard hoverShadow>
      <Box position="relative">
        <Box
          cursor="pointer"
          h={{ base: '280px', md: '300px' }}
          onClick={goToDetail}
          overflow="hidden"
          w="100%"
        >
          <AppImage alt={name} src={image} h="100%" w="100%" />
        </Box>

        <Box left="3" position="absolute" top="3">
          <AppColumn align="start" gap="1.5">
            {healthBadge && (
              <AppBadge variant="success">
                <Box as="span" bg="white" borderRadius="full" boxSize="6px" />
                Health+
              </AppBadge>
            )}
            {rankBadge && <AppBadge variant="rank">{rankBadge}</AppBadge>}
          </AppColumn>
        </Box>

        <Box
          alignItems="center"
          bg="rgba(255,255,255,0.95)"
          borderRadius="full"
          boxSize="32px"
          color={themeColors.brand.primary}
          cursor="pointer"
          display="flex"
          justifyContent="center"
          position="absolute"
          right="3"
          top="3"
        >
          <AppIcon as={MdFavoriteBorder} color={themeColors.brand.primary} size="18px" />
        </Box>

        <HStack
          alignItems="center"
          bg="white"
          borderRadius="sm"
          bottom="3"
          color={themeColors.app.text}
          gap="1"
          h="22px"
          position="absolute"
          px="1.5"
          right="3"
        >
          <AppIcon as={MdChatBubble} color={themeColors.brand.primary} size="12px" />
          <AppText color={themeColors.app.text} fontSize="xs" fontWeight="medium">
            1
          </AppText>
        </HStack>

        <Box bg={themeColors.brand.primary} bottom="0" h="3px" left="0" position="absolute" w="35%" />
      </Box>

      <Box p="4">
        <AppColumn gap="3">
          <HStack gap="1.5">
            <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
              {name}
            </AppText>
            {verified && <AppIcon as={MdVerified} color="#1FA463" size="16px" />}
          </HStack>

          <HStack color={themeColors.app.textSecondary} gap="1">
            <AppIcon as={MdLocationOn} color={themeColors.app.textSecondary} size="14px" />
            <AppText color={themeColors.app.textSecondary} fontSize="sm">
              {location}
            </AppText>
          </HStack>

          <HStack gap="3">
            <HStack gap="1.5">
              <StatDot />
              <AppText color={themeColors.app.text} fontSize="sm">
                {age} years old
              </AppText>
            </HStack>
            <HStack gap="1.5">
              <StatDot />
              <AppText color={themeColors.app.text} fontSize="sm">
                {height} cm
              </AppText>
            </HStack>
            <HStack gap="1.5">
              <StatDot />
              <AppText color={themeColors.app.text} fontSize="sm">
                {chest} chest
              </AppText>
            </HStack>
          </HStack>

          <HStack gap="2" wrap="wrap">
            <PriceItem value={`${prices.hr}k₽/hr`} />
            <PriceItem value={`${prices.twoHr}k₽/2hr`} />
            <PriceItem value={`${prices.allDay}k₽`} />
          </HStack>

          <HStack gap="1.5" wrap="wrap">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </HStack>

          <AppButton fullWidth onClick={goToDetail}>
            Show Contacts
          </AppButton>
        </AppColumn>
      </Box>
    </AppCard>
  )
}
