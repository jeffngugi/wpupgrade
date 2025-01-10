import { Box, HStack, Text, VStack } from 'native-base'
import { TTask } from '../WelcomeCard'
import Vase from '../../assets/svg/flowervase.svg'
import { windowWidth } from '~utils/appConstants'

const Card = ({ item, index }: { item: TTask; index: number }) => (
  <HStack
    paddingX={2}
    paddingTop={3}
    borderRadius={6}
    borderWidth={1}
    borderColor={'#3E8BEF'}
    bgColor={'#E7F1FD90'}
    width={windowWidth * 0.9}
    ml={index > 0 ? '32px' : 0}
    py={'26px'}
    justifyContent="space-between">
    <VStack alignSelf="center" flex={3}>
      <Text
        fontWeight="500"
        color="charcoal"
        fontSize="18px"
        marginBottom="6px">
        {item?.title ?? '-'}
      </Text>
      <Text marginBottom="8px" fontSize={'16px'} color="charcoal">
        {item?.description ?? ''}
      </Text>
    </VStack>
    <Box height={90} overflow={'hidden'} bottom={0} flex={1}>
      <Vase height={'100%'} width="100%" />
    </Box>
  </HStack>
)

export default Card
