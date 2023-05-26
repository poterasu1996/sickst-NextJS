import { useContext, useEffect, useState, useRef } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AccountContext from "../../store/account-context";
import ShipmentForm from "./ShipmentForm";
import { IShippingInfo, IGETShippingInformation } from "../../models/ShippingInformation.model";
import { Bookmark, MoreVertical } from "react-feather";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";


const ShippingInformation = () => {
    const [show, setShow] = useState<boolean>(false);
    const [shippingInfo, setShippingInfo] = useState<IGETShippingInformation | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const accountManager = useContext(AccountContext);
    const optionsMenu = useRef<Menu>(null);
    const items: MenuItem[] = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Principala',
                    icon: 'pi pi-bookmark',
                    command: () => {handleSetPrimary(selectedIndex)}
                },
                {
                    label: 'Sterge',
                    icon: 'pi pi-times',
                    command: (e) => {handleDeleteAddress(selectedIndex)}
                },
            ]
        }
    ]

    // console.log(shippingInfo)
    function handleDeleteAddress(adrsIndex: number | null) {
        if(adrsIndex !== null) {
            const newList: IShippingInfo[] | undefined = shippingInfo?.attributes.shipping_info_list!.filter((item, index) => index !== adrsIndex);
            const newData = {
                data: {
                    user_id: shippingInfo!.attributes.user_id,
                    shipping_info_list: newList ? newList : [],
                }
            }
            accountManager?.editShippingAddress(shippingInfo!.id, newData)
        }
    }

    function handleSetPrimary(adrsIndex: number | null) {
        if(adrsIndex !== null) {
            // first, set primary flag to false for all addresses
            let _list = shippingInfo?.attributes.shipping_info_list?.map((el: IShippingInfo) => {
                return {
                    ...el,
                    primary: false
                }
            })
            if(_list) {
                _list[adrsIndex].primary = true;
                const newData = {
                    data: {
                        user_id: shippingInfo!.attributes.user_id,
                        shipping_info_list: _list
                    }
                }

                accountManager?.editShippingAddress(shippingInfo!.id, newData);
            }
        }
    }

    useEffect(() => {
        if(accountManager!.currentUser) {
            accountManager!.fetchShippingList()
                .then(resp => {
                    setShippingInfo(resp);
                })
                .catch(error => console.log('Shipping list error: ', error))
        }
    }, [accountManager!.currentUser, accountManager!.refresh])

    return (
        <>
            <div className="shipping-info">
                <div className="title">Shipping information</div>
                <div className="info">All shipping updates <b className="brand-color">MUST</b> be made <b className="brand-color">1 day</b> prior to your next billing date in order to receive your next product at the new address.</div>
                <div className="address-list">
                    {shippingInfo?.attributes.shipping_info_list && shippingInfo.attributes.shipping_info_list.map((item: IShippingInfo, index: number) => (
                        <div className={`address-card ${item.primary ? "active" : ""}`} key={index}>
                            <div className="card-info">
                                <div className="card-info--name">{item.full_name}</div>
                                <div className="card-info--address">{item.address}, {item.city}, {item.county}</div>
                            </div>
                            <button 
                                className="info-options" 
                                aria-controls="popup_options" 
                                aria-haspopup
                                onClick={(event) => {
                                    setSelectedIndex(index);
                                    optionsMenu.current?.toggle(event);
                                }}
                            ><MoreVertical height={18} width={18}/></button>
                            <Menu model={items} popup id="popup_options" ref={optionsMenu} />
                            {item.primary && <div className="ribbon"><Bookmark height={12} width={12}/> Primary</div>}
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
                show={show.toString()} 
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
                    <button className="cancel-btn" onClick={() => setShow(preVal => !preVal)}>Cancel</button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default ShippingInformation;