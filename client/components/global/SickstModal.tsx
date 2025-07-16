import Modal from '@mui/material/Modal';

interface Props {
    open: boolean,
    onClose: () => void,
    className?: string,
    size?: 'small' | 'medium' | 'large',
    children: JSX.Element,
    headerTitle?: string,
    footer?: boolean
}

const SickstModal = ({ 
    open, 
    onClose,
    className = "",
    size = 'medium',
    children, 
    headerTitle = "", 
    footer = true
}: Props) => {
    return <>
        <Modal
            className={`custom-modal ${className}`}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onClose={onClose}
        >
            <div className={`modal-content ${size}`}>
                <div className="modal-header">
                    <span className="modal-title">{headerTitle}</span>
                    <button className='btn-close' onClick={onClose}></button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">
                    <button className="cancel-btn">Cancel</button>
                </div>}
            </div>
        </Modal>
    </>
}

export default SickstModal