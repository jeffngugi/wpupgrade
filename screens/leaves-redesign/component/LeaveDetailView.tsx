import React from 'react'
import { Badge, Box, Divider, HStack, Pressable, ScrollView, Text, VStack } from 'native-base'
import DetailItem from '~components/DetailItem'
import { TLeaveItem } from '../types'
import { dateToString } from '~utils/date'
import { isEmpty, noop } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useLeaveStatus } from '~hooks/useLeaveStatus'
import { FileScrollView } from '~components/FilesScrollView'
import HelpQuestionSvg from '~assets/svg/help-question.svg'

import LeaveStagesBadge from './LeaveStagesBadge'
import InfoModal from '~components/modals/InfoModal'

type Receipt = { attachment: string };

const LeaveDetailView = ({ item }: { item: TLeaveItem }) => {
  const { t } = useTranslation('leaves')
  const { status, variant } = useLeaveStatus(item.status)
  const [showInfoModal, setShowInfoModal] = React.useState(false)

  const receipts: Receipt[] =
    item?.document_link?.map(file => {
      return {
        attachment: file,
      }
    }) ?? []

  return (
    <ScrollView flex={1} pt={'24px'}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize="24px" color="charcoal">
          {item.leave_type_name}
        </Text>
        <Badge variant={variant}>{status}</Badge>
      </HStack>
      {item.is_half_day ? (
        <Text color="charcoal" fontSize="20px">
          {t('half_day')}
        </Text>
      ) : (
        <Text color="charcoal" fontSize="20px">
          {t(item?.duration)}
        </Text>
      )}
      <DetailItem
        label={t('from_date')}
        value={dateToString(item.from, 'do MMM y') ?? '-'}
      />
      {item.is_half_day ? (
        <DetailItem label={t('half_day')} value={item.duration} />
      ) : null}

      {item.to ? (
        <DetailItem
          label={t('to_date')}
          value={dateToString(item.to, 'do MMM y') ?? '-'}
        />
      ) : null}

      <DetailItem
        label={t('reliever')}
        value={!isEmpty(item.reliever_name) ? item.reliever_name : '-'}
        valueColor="green.50"
      />
      <Text color="charcoal" mt="20px" fontSize={'14px'}>
        {t('reason')}
      </Text>
      <Text fontFamily={'heading'} fontSize={'16px'} mb={'20px'}>
        {item.reason ?? '-'}
      </Text>
      <Divider my="10px" />
      <Box mt="10px">
        <FileScrollView
          files={[]}
          receipts={receipts ?? []}
          setFiles={noop}
          setPrevReceipts={noop}
          hasDelete={false}
        />
      </Box>
      <HStack mt="20px" alignItems="center" >
        <Text color="charcoal" fontSize="16px" fontFamily={'heading'} mr={'4px'}>
          Approval Details
        </Text>
        <Pressable onPress={() => setShowInfoModal(true)}>
          <HelpQuestionSvg />
        </Pressable>
      </HStack>
      <HStack alignItems="center" justifyContent="space-between" my={'10px'}>
        <Text fontSize="14px" color="grey">
          Approval Stage
        </Text>
        <LeaveStagesBadge item={item} />
      </HStack>

      {/* approval stages */}
      {
        item.approved_attempts.map((stage, index) => (
          <VStack key={index} mt={'8px'} space={2}>
            <Text fontSize="14px" color="grey">
              Approver {index + 1}
            </Text>
            <HStack alignItems="center" justifyContent="space-between" mt={'5px'} key={index}>

              {/* <UserAvatar fallback="WP" width="48px" url={stage.approver_avatar} /> */}
              <Text fontSize="16px" color="charcoal" w={'50%'}>
                {stage.user_name ?? '-'}
              </Text>
              <Badge variant={stage.action_taken === 'REJECTED' ? 'failed' : stage.action_taken === 'APPROVED' ? 'success' : 'pending'} >{stage.action_taken}</Badge>
            </HStack>
            <Divider />
          </VStack>
        ))
      }

      <InfoModal
        title={''}
        description={
          'Shows the number of approvals required and the specific stage the request is currently at'
        }
        isVisible={showInfoModal}
        hideModal={() => setShowInfoModal(false)}
        onConfirm={noop}
        loading={false}

      />

    </ScrollView>
  )
}

export default LeaveDetailView
