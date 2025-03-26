import { Modal, ModalHeader } from "reactstrap"

interface Props {
    show: boolean,
    setShow: () => void,
    headerTitle?: string,
    children: JSX.Element,
    footer: boolean
}

const SickstModal = ({ show, children, setShow, headerTitle, footer }: Props) => {
    return <>
        <Modal
            className="custom-modal"
            centered={true}
            size="lg"
            isOpen={show}
            toggle={setShow}
        >
            <ModalHeader toggle={setShow}>{headerTitle && headerTitle}</ModalHeader>
            {children}
            <button className="cancel-btn" onClick={setShow}>Cancel</button>
            {/* {footer && <ModalFooter>
            </ModalFooter>} */}
        </Modal>
    </>
}

export default SickstModal