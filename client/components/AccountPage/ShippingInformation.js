import { useContext, useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AccountContext from "../../store/account-context";
import ShipmentForm from "./ShipmentForm";


const ShippingInformation = () => {
    const [show, setShow] = useState(false);
    const { accountManager } = useContext(AccountContext);
    const [shippingList, setShippingList] = useState();

    useEffect(() => {
        if(accountManager.currentUser) {
            accountManager.fetchShippingList()
                .then(resp => {
                    setShippingList(resp[0].attributes.shipping_info_list);
                })
                .catch(error => console.log('Shipping list error: ', error))
        }
    }, [accountManager.refresh])

    return (
        <>
            <div className="shipping-info">
                <div className="title">Shipping information</div>
                <div className="info">All shipping updates MUST be made 1 day prior to your next billing date in order to receive your next product at the new address.</div>
                <div className="address-list">
                    {shippingList && shippingList.map((item, index) => (
                        <div className="address-card" key={index}>
                            <div className="card-info">
                                <div className="card-info--name">{item.first_name} {item.last_name}</div>
                                <div className="card-info--address">{item.address}, apt. {item.appartment}, {item.city}, {item.county}</div>
                            </div>
                            {item.primary && <div className="ribbon">Primary</div>}
                        </div>
                    ))}
                    <div className="new-address" onClick={() => setShow(preVal => !preVal)}>
                        <i className="pi pi-plus" style={{'fontSize': '1.8rem'}}/>
                        <span>Add a new address</span>
                    </div>
                </div>
            </div>

            <Modal 
                className="shipping-info-modal" 
                show={show} 
                centered
                size="lg"
                isOpen={show}
                toggle={() => setShow(preVal => !preVal)}
            >
                <ModalHeader toggle={() => setShow(preVal => !preVal)}>
                    Add a new address
                </ModalHeader>
                <ModalBody>
                    <div className="shipment-details">
                        <ShipmentForm onSubmit={() => setShow(preVal => !preVal)}/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="cancel-btn">Cancel</button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default ShippingInformation;