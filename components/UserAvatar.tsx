import React from 'react';
import { Avatar, Box } from 'native-base';
import { ImageSourcePropType } from 'react-native';
import { SvgUri } from 'react-native-svg';

type width = `${number}px`;

type Props = {
  fallback: string
  url?: string
  source?: ImageSourcePropType | undefined
  width?: width
  fallbackFontSize?: string
  bgColor?: '#DBE6F5'
  txtColor?: '#3E8BEF'
}


const UserAvatar = ({ fallback, url, width, fallbackFontSize,
  bgColor, txtColor }: Props) => {

  const isSvg = url?.endsWith('.svg');

  return (
    <Avatar
      bg="red"
      alignSelf="center"
      width={width ?? '80px'}
      height={width ?? '80px'}
      backgroundColor={bgColor ? bgColor : 'green.50'}
      borderRadius={width ?? '80px'}
      borderColor="white"
      borderWidth="3px"
      _text={{
        color: txtColor ? txtColor : 'white',
        fontSize: fallbackFontSize ?? '28px',
      }}
    >
      {isSvg && url ? (
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
    </Avatar>
  );
};

export default UserAvatar;
