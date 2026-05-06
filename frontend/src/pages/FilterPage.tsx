import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { MdChevronRight, MdSearch } from 'react-icons/md'
import {
  AppButton,
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppInput,
  AppText,
} from '../components/Common'
import {
  AppearanceParametersCard,
  PricesCard,
  type PriceTab,
  QuickFilterChips,
  ServicesCard,
} from '../components/Filter'
import { themeColors } from '../theme'

const bodyTypeOptions = ['Slim', 'Curvy', 'Athletic', 'Average']
const skinToneOptions = ['Light', 'Fair', 'Medium', 'Olive', 'Tan', 'Dark']
const breastSizeOptions = ['163 cm', '160 cm', '173 cm', '175 cm']
const tattoosOptions = ['No Tattoos', 'Few Tattoos', 'Many Tattoos']
const piercingsOptions = ['No Piercings', 'Ears Only', 'Multiple Piercings']
const servicesOptions = [
  'Dinner date / companionship',
  'Travel',
  'Party',
  'Video call',
  'Massage',
  'online session',
  'Massage',
  'Video call',
  'online session',
  'Couples',
]

export function FilterPage() {
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 25])
  const [weightRange, setWeightRange] = useState<[number, number]>([45, 60])
  const [bodyType, setBodyType] = useState<string[]>(['Slim'])
  const [skinTone, setSkinTone] = useState<string[]>(['Fair', 'Olive', 'Tan'])
  const [breastSize, setBreastSize] = useState<string[]>(['160 cm', '175 cm'])
  const [tattoos, setTattoos] = useState<string[]>(['No Tattoos'])
  const [piercings, setPiercings] = useState<string[]>(['No Piercings'])
  const [services, setServices] = useState<string[]>(['Party__2', 'Massage__6'])
  const [priceTab, setPriceTab] = useState<PriceTab>('apartments')
  const [hourly, setHourly] = useState({ from: '30k₽', to: '60k₽' })
  const [twoHour, setTwoHour] = useState({ from: '', to: '' })
  const [night, setNight] = useState({ from: '', to: '' })

  const reset = () => {
    setAgeRange([20, 25])
    setWeightRange([45, 60])
    setBodyType([])
    setSkinTone([])
    setBreastSize([])
    setTattoos([])
    setPiercings([])
    setServices([])
    setPriceTab('apartments')
    setHourly({ from: '', to: '' })
    setTwoHour({ from: '', to: '' })
    setNight({ from: '', to: '' })
  }

  return (
    <Box bg={themeColors.app.surface} py={{ base: '6', md: '8' }} w="100%">
      <AppContainer>
        <AppColumn align="stretch" gap="6">
          <Breadcrumb />

          <HStack
            align={{ base: 'stretch', md: 'center' }}
            flexDirection={{ base: 'column', md: 'row' }}
            gap="4"
            justify="space-between"
          >
            <AppHeading size={{ base: '2xl', md: '3xl' }}>
              Filter Escorts By Preferences
            </AppHeading>
            <Box maxW={{ md: '360px' }} w="100%">
              <AppInput
                borderRadius="full"
                hideLabel
                label="Search"
                leftIcon={<AppIcon as={MdSearch} color="#9CA3AF" size="20px" />}
                placeholder="Search by name, phone"
              />
            </Box>
          </HStack>

          <QuickFilterChips />

          <AppearanceParametersCard
            ageRange={ageRange}
            bodyType={{ options: bodyTypeOptions, selected: bodyType, title: 'Body type' }}
            breastSize={{ options: breastSizeOptions, selected: breastSize, title: 'Breast Size' }}
            onChangeAge={setAgeRange}
            onChangeBodyType={setBodyType}
            onChangeBreastSize={setBreastSize}
            onChangePiercings={setPiercings}
            onChangeSkinTone={setSkinTone}
            onChangeTattoos={setTattoos}
            onChangeWeight={setWeightRange}
            piercings={{ options: piercingsOptions, selected: piercings, title: 'Piercings' }}
            skinTone={{ options: skinToneOptions, selected: skinTone, title: 'Skin Tone' }}
            tattoos={{ options: tattoosOptions, selected: tattoos, title: 'Tattoos' }}
            weightRange={weightRange}
          />

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
            <ServicesCard
              onChange={setServices}
              options={servicesOptions}
              selected={services}
            />
            <PricesCard
              hourly={hourly}
              night={night}
              onChangeHourly={setHourly}
              onChangeNight={setNight}
              onChangeTab={setPriceTab}
              onChangeTwoHour={setTwoHour}
              tab={priceTab}
              twoHour={twoHour}
            />
          </SimpleGrid>

          <HStack gap="4" justify="center" pt="2">
            <AppButton onClick={reset} variant="outline">
              Clear
            </AppButton>
            <AppButton>Apply Filter</AppButton>
          </HStack>
        </AppColumn>
      </AppContainer>
    </Box>
  )
}

function Breadcrumb() {
  return (
    <HStack gap="1.5">
      <RouterLink to="/" style={{ textDecoration: 'none' }}>
        <AppText color={themeColors.app.textSecondary} fontSize="sm">
          Home
        </AppText>
      </RouterLink>
      <AppIcon as={MdChevronRight} color={themeColors.app.textSecondary} size="16px" />
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        Filter
      </AppText>
    </HStack>
  )
}
