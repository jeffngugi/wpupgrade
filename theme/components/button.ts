export default {
  defaultProps: {
    variant: 'defaultButton',
  },
  variants: {
    url: {
      _text: {
        fontFamily: 'body',
        fontSize: '16px',
        fontWeight: '300',
        color: 'grey',
        textAlign: 'center',
      },
      _pressed: {
        _text: {
          fontFamily: 'body',
          fontSize: '16px',
          color: 'charcoal',
          textAlign: 'center',
        },
      },
    },
    outlined: {
      _text: {
        fontFamily: 'heading',
        fontSize: '16px',
        fontWeight: '500',
        color: 'green.50',
        textAlign: 'center',
      },
      backgroundColor: 'transparent',
      borderRadius: '6px',
      borderColor: 'green.50',
      borderWidth: 1,
      _pressed: { backgroundColor: 'green.10' },
    },
    defaultButton: {
      _text: {
        fontFamily: 'heading',
        fontSize: '16px',
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
      },
      backgroundColor: 'green.50',
      height: '56px',
      borderRadius: '6px',
      _pressed: { backgroundColor: 'green.60' },
    },
  },
}
