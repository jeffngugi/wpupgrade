import React from 'react'
import { AccountSetting, TLeaveItem } from '../types'
import { queryClient } from '~ClientApp';
import { settingQKeys } from '~api/QueryKeys';
import { Badge, Box } from 'native-base';
import { useTranslation } from 'react-i18next';

function LeaveStagesBadge({ item }: { item: TLeaveItem }) {
    const { t } = useTranslation('leaves')
    const accountSetting = queryClient.getQueryData<AccountSetting>(settingQKeys.account)
    const totalStages = item?.approval_stages?.length || accountSetting?.data?.leave_approve_stages;
    const localisedStageText = t('leave_approval_stage', { stage: item?.approved_attempts_count, total: totalStages })
    return (
        <Badge variant={'faded_success'} _text={
            {
                fontSize: '12px',
                color: 'green.100',
            }
        }
            borderColor={'green.50'} borderWidth={'1px'}
        >
            {localisedStageText}
        </Badge>
    )
}

export default LeaveStagesBadge