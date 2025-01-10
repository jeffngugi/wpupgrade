import React from 'react';
import { Avatar, Box } from 'native-base';
import { ImageSourcePropType } from 'react-native';
import { SvgUri } from 'react-native-svg';

type width = `${number}px`;

type Props = {
    fallback: string;
    url?: string;
    source?: ImageSourcePropType | undefined;
    width?: width;
    fallbackFontSize?: string;
};

const FlagAvatar = ({ fallback, url, width, fallbackFontSize }: Props) => {
    const isSvg = url?.endsWith('.svg');

    return (
        <Box
            // bg="green.500"
            alignSelf="center"
            width={width ?? '80px'}
            height={width ?? '80px'}
            // backgroundColor="green.50"
            // borderRadius={width ?? '80px'}
            borderColor="white"
            borderWidth="3px"
            _text={{
                fontSize: fallbackFontSize ?? '24px',
            }}
        >
            {(isSvg && url) ? (
                <Box width={width ?? '36px'} height={width ?? '36px'}
                    overflow="hidden">
                    <SvgUri
                        width={width ?? '36px'}
                        height={width ?? '36px'}
                        uri={url}
                    />
                </Box>
            ) : (
                <Avatar
                    source={{
                        uri: url,
                    }}
                    width={width ?? '80px'}
                    height={width ?? '80px'}
                >
                    {fallback}
                </Avatar>
            )}
        </Box>
    );
};

export default FlagAvatar;
