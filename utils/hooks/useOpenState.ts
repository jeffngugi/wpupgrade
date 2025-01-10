import { useVisibleState } from './useVisibleState'

export function useOpenState(defaultValue = false) {
  const [isOpen, { show: open, hide: close, toggle, setIsVisible: setIsOpen }] =
    useVisibleState(defaultValue)

  const buttonProps = {
    onClick: open,
    disabled: isOpen,
  }

  const dialogProps = {
    onExit: close,
    isOpen,
  }

  const materialDialogProps = {
    onRequestClose: close,
    open: isOpen,
  }

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
    dialogProps,
    buttonProps,
    materialDialogProps,
  }
}
