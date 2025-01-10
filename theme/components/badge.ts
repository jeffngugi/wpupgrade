export default {
  baseStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    alignSelf: 'flex-start',
    px: 3,
    _text: {
      color: 'white',
      fontFamily: 'body',
      fontSize: '12px',
    },
  },
  defaultProps: {
    variant: 'success',
  },
  variants: {
    pending: {
      backgroundColor: 'chrome.50',
    },
    failed: {
      backgroundColor: 'red.50',
    },
    success: {
      backgroundColor: 'green.50',
    },
    faded_success: {
      backgroundColor: 'green.10',
    },
  },
}
