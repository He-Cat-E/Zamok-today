import { Box, HStack } from '@chakra-ui/react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { themeColors } from '../../theme'
import { AppIcon } from './AppIcon'
import { AppText } from './AppText'

type AppPaginationProps = {
  currentPage: number
  onPageChange?: (page: number) => void
  totalPages: number
}

const buildPages = (current: number, total: number): (number | 'dots')[] => {
  if (total <= 5) {
    return Array.from({ length: total }).map((_, i) => i + 1)
  }
  const pages: (number | 'dots')[] = []
  pages.push(1)
  if (current > 3) pages.push('dots')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let p = start; p <= end; p += 1) pages.push(p)
  if (current < total - 2) pages.push('dots')
  pages.push(total)
  return pages
}

function PageCell({
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  const bg = active ? themeColors.brand.primary : 'white'
  const color = active ? themeColors.app.overlayText : themeColors.app.text

  return (
    <Box
      alignItems="center"
      bg={bg}
      borderColor={themeColors.border.default}
      borderRadius="md"
      borderWidth="1px"
      color={color}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      display="flex"
      fontSize="sm"
      fontWeight="medium"
      h="36px"
      justifyContent="center"
      minW="36px"
      onClick={disabled ? undefined : onClick}
      opacity={disabled ? 0.5 : 1}
      px="2"
      _hover={!disabled && !active ? { bg: themeColors.app.surfaceSoft } : undefined}
    >
      {children}
    </Box>
  )
}

export function AppPagination({ currentPage, onPageChange, totalPages }: AppPaginationProps) {
  const pages = buildPages(currentPage, totalPages)
  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange?.(page)
  }

  return (
    <HStack gap="2" justify="center">
      <PageCell disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)}>
        <AppIcon as={MdChevronLeft} size="18px" />
      </PageCell>

      {pages.map((p, idx) =>
        p === 'dots' ? (
          <PageCell key={`dots-${idx}`} disabled>
            <AppText color={themeColors.app.textSecondary} fontSize="sm">
              …
            </AppText>
          </PageCell>
        ) : (
          <PageCell active={p === currentPage} key={p} onClick={() => goTo(p)}>
            {p}
          </PageCell>
        ),
      )}

      <PageCell disabled={currentPage === totalPages} onClick={() => goTo(currentPage + 1)}>
        <AppIcon as={MdChevronRight} size="18px" />
      </PageCell>
    </HStack>
  )
}
