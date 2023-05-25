import { ModalBody, ModalFooter } from "react-bootstrap";
import { Modal, ModalHeader } from "reactstrap"

type Props = {
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
            <ModalBody>
                {children}
            </ModalBody>
            {footer && <ModalFooter>
                <button className="cancel-btn" onClick={setShow}>Cancel</button>
            </ModalFooter>}
        </Modal>
    </>
}

export default SickstModal