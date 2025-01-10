
import { Text } from 'react-native'
import React from 'react'
import { Badge, Pressable } from 'native-base'

type BadgeButtonProps = {
    bgColor: string
    label: string
    labelColor: string
    onPress: () => void
}

const BadgeButton = ({
    bgColor,
    label,
    labelColor,
    onPress
}: BadgeButtonProps) => {
    return (
        <Pressable
            onPress={onPress}>
            <Badge
                size="sm"
                align="center"
                borderRadius="19px"
                px={'14px'}
                py={'8px'}
                bg={bgColor}
                _text={{
                    color: labelColor
                }}
                color={'charcoal'}
                fontFamily={'body'}
                fontSize={'14px'}
                my={'auto'}>
                {label}
            </Badge>
        </Pressable>
    )
}

export default BadgeButton