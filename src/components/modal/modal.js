import React from 'react'

import './modal.css'

const Modal = ({ open, onClose, children }) => {
    const handleClose = (e) => {
        e.preventDefault()
        onClose()
    }
    return (
        <div className={`modal ${open ? 'open' : ''}`}>
            <div className="inner">
                <button className="closeButton" onClick={handleClose}>
                    ｘ
                </button>
                <div className="modalContent">{children}</div>
            </div>
        </div>
    )
}

export default Modal
