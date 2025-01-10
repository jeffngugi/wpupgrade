import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Box, HStack, VStack, Text, Heading, Pressable } from 'native-base'
import { useEvents } from '~api/home'
import { formatDate } from '~utils/date'
import { Tevent, useEventsIcon } from '~utils/hooks/useEventsIcon'
import ChevRight from '~assets/svg/chev-r.svg'
import ChevLeft from '~assets/svg/chev-l.svg'
import { useAccountSettings } from '~api/settings'
import { reject } from 'lodash'

type UpcomingEvent = {
  date: string
  employee_id: number
  employee_no: string
  event: string
  event_type: Tevent
  profile_picture: string
}

type UpcomingEventsProps = {
  setRefetching: (value: boolean) => void
}

const UpcomingEvents = forwardRef(
  ({ setRefetching }: UpcomingEventsProps, ref) => {
    const { data, refetch, isRefetching } = useEvents()

    useEffect(() => {
      setRefetching(isRefetching)
    }, [isRefetching])

    const { data: settingData } = useAccountSettings()

    const anniversaryHidden = settingData?.data?.disable_work_anniversary_info
    const birthdayHidden = settingData?.data?.disable_birthday_info

    useImperativeHandle(ref, () => ({
      refetch,
    }))

    const itemCount = 6
    const showButtons = data?.data?.length > itemCount
    const eventsArr: UpcomingEvent[] = data?.data ?? []
    const [currentStateIndex, setCurrentStateIndex] = React.useState<number>(1)

    const filteredEvents = reject(eventsArr, event => {
      let shouldReject = false

      if (birthdayHidden && anniversaryHidden) {
        shouldReject =
          event.event_type.toLowerCase() === 'birthday' ||
          event.event_type.toLowerCase() === 'anniversary'
      } else if (birthdayHidden) {
        shouldReject = event.event_type.toLowerCase() === 'birthday'
      } else if (anniversaryHidden) {
        shouldReject = event.event_type.toLowerCase() === 'anniversary'
      }

      return shouldReject
    })

    const noOfPages = Math.ceil(eventsArr.length / itemCount)
    const noOfPagesArr = Array.from(Array(noOfPages).keys())

    const currEventItems = eventsArr.slice(
      (currentStateIndex - 1) * itemCount,
      currentStateIndex * itemCount,
    )

    const handleNext = () => {
      if (currentStateIndex === noOfPages) {
        return
      }
      setCurrentStateIndex(currentStateIndex + 1)
    }
    const handlePrev = () => {
      if (currentStateIndex === 1) {
        return
      }
      setCurrentStateIndex(currentStateIndex - 1)
    }

    const iconwidth = 44

    const Event = ({ item }: { item: UpcomingEvent }) => {
      const Icon = useEventsIcon(item.event_type)
      return (
        <HStack alignItems="center" my={'12px'} height={'64px'}>
          <Box h={'full'} justifyContent={'center'} pt={'1px'}>
            <Icon width={iconwidth} height={iconwidth} />
          </Box>
          <VStack marginLeft={3} width={'95%'}>
            <Text
              fontSize="16px"
              color="charcoal"
              lineHeight={'19px'}
              maxWidth={'80%'}>
              {item.event.trim() ?? '-'}
            </Text>
            <Text
              fontSize="14px"
              color="grey"
              marginTop="4px"
              lineHeight={'17px'}>
              {formatDate(item.date, 'dayMonth') ?? '-'}
            </Text>
          </VStack>
        </HStack>
      )
    }

    return (
      <Box marginTop="31px">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading fontSize="20px" color={'charcoal'} lineHeight={'24px'}>
            Your upcoming events
          </Heading>
          {showButtons ? (
            <>
              <Pressable
                ml={'auto'}
                borderWidth="1px"
                width={'32px'}
                background={currentStateIndex == 1 ? '#E3E5E8' : 'white'}
                opacity={currentStateIndex == 1 ? 0.3 : 1}
                borderColor={'#E3E5E8'}
                height={'32px'}
                onPress={handlePrev}
                alignItems={'center'}
                borderRadius={'16px'}>
                <ChevLeft color="green" />
              </Pressable>
              <Pressable
                borderWidth="1px"
                ml="24px"
                width={'32px'}
                background={
                  currentStateIndex == noOfPages ? '#E3E5E8' : 'white'
                }
                opacity={currentStateIndex == noOfPages ? 0.5 : 1}
                borderColor={'#E3E5E8'}
                height={'32px'}
                onPress={handleNext}
                alignItems={'center'}
                borderRadius={'16px'}>
                <ChevRight color="green" />
              </Pressable>
            </>
          ) : null}
        </HStack>
        <Box
          borderRadius={'8px'}
          borderWidth={1}
          borderColor="#D5D4D4"
          paddingX="16px"
          paddingY="14px"
          marginY="24px">
          {currEventItems.map((item, index) => (
            <Event key={index} item={item} />
          ))}
        </Box>

        <Box flexDirection={'row'} justifyContent={'center'}>
          {noOfPagesArr.map((item, index) => (
            <Pressable key={index}>
              <Box
                width="8px"
                height="8px"
                borderRadius="4px"
                mx="4px"
                backgroundColor={
                  currentStateIndex - 1 === index ? 'green.50' : '#D9D9D9'
                }
              />
            </Pressable>
          ))}
        </Box>
      </Box>
    )
  },
)
UpcomingEvents.displayName = 'UpcomingEvents'
export default UpcomingEvents
