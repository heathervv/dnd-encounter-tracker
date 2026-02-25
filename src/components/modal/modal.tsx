import type { MouseEvent, ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ open, onClose, children }: ModalProps) => {
  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 card bg-base-100 card-border p-2 rounded-b-none border-base-300 z-1 h-[75%]">
      <div>
        <button
          className="btn btn-xs btn-neutral absolute right-2 top-2"
          onClick={handleClose}
        >
          close
        </button>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
