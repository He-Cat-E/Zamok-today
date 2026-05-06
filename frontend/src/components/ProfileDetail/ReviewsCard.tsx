import { Box, HStack } from '@chakra-ui/react'
import { MdStar, MdStarHalf } from 'react-icons/md'
import { AppColumn, AppIcon, AppImage, AppText } from '../Common'
import { themeColors } from '../../theme'
import { CollapsibleCard } from './CollapsibleCard'
import { profileReviews, type Review } from './profileDetailData'
import { ReviewForm } from './ReviewForm'

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  return (
    <HStack gap="0.5">
      {Array.from({ length: full }).map((_, idx) => (
        <AppIcon as={MdStar} color="#F5B400" key={idx} size="16px" />
      ))}
      {hasHalf && <AppIcon as={MdStarHalf} color="#F5B400" size="16px" />}
    </HStack>
  )
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <AppColumn align="stretch" gap="2">
      <HStack align="center" justify="space-between">
        <HStack gap="3">
          <Box borderRadius="full" h="40px" overflow="hidden" w="40px">
            <AppImage alt={review.name} h="100%" src={review.avatar} w="100%" />
          </Box>
          <AppColumn align="start" gap="0">
            <AppText color={themeColors.app.text} fontSize="sm" fontWeight="bold">
              {review.name}
            </AppText>
            <AppText color={themeColors.app.textSecondary} fontSize="xs">
              {review.location}
            </AppText>
          </AppColumn>
        </HStack>
        <Stars rating={review.rating} />
      </HStack>
      <AppText color={themeColors.app.text} fontSize="sm">
        {review.message}
      </AppText>
    </AppColumn>
  )
}

export function ReviewsCard() {
  return (
    <CollapsibleCard title="Reviews">
      <AppColumn align="stretch" gap="6">
        <AppColumn align="stretch" gap="6">
          {profileReviews.map((review, idx) => (
            <Box
              borderColor={themeColors.border.default}
              borderTopWidth={idx === 0 ? '0' : '1px'}
              key={review.name}
              pt={idx === 0 ? '0' : '5'}
            >
              <ReviewItem review={review} />
            </Box>
          ))}
        </AppColumn>

        <ReviewForm />
      </AppColumn>
    </CollapsibleCard>
  )
}
