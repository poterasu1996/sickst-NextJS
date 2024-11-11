import { useContext, useEffect, useState, useRef } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AccountContext from "../../store/account-context";
import ShipmentForm from "./ShipmentForm";
import { IShippingInfo, IGETShippingInformation } from "../../models/ShippingInformation.model";
import { Bookmark, MoreVertical } from "react-feather";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRecoilState } from "recoil";
import { shippingListR } from "../../shared/recoil-states";
import shippingService from "../../shared/services/shippingService";

const ShippingInformation = () => {
    const [show, setShow] = useState<boolean>(false);
    const [shippingInfo, setShippingInfo] = useState<IGETShippingInformation | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const accountManager = useContext(AccountContext);
    const optionsMenu = useRef<Menu>(null);
    // const [, setShippingListR] = useRecoilState(shippingListR);
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

    function handleDeleteAddress(adrsIndex: number | null) {
        if(adrsIndex !== null) {
            const newList: IShippingInfo[] | undefined = shippingInfo?.attributes.shipping_info_list?.filter((item, index) => index !== adrsIndex);
            const newData = {
                data: {
                    user_id: shippingInfo!.attributes.user_id,
                    shipping_info_list: newList ? newList : [],
                }
            }
            shippingService.editShippingAddress(shippingInfo!.id, newData).then(() => accountManager!.refreshContext());
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
                const payload = {
                    data: {
                        user_id: shippingInfo!.attributes.user_id,
                        shipping_info_list: _list
                    }
                }

                shippingService.editShippingAddress(shippingInfo!.id, payload).then(() => accountManager!.refreshContext());
            }
        }
    }

    useEffect(() => {
        if(accountManager!.currentUser) {
            const userId = accountManager?.currentUser.id;
            shippingService.getShippingList(userId ?? 0).then((resp: IGETShippingInformation) => {
                setShippingInfo(resp);
                // setShippingListR(resp.attributes.shipping_info_list)
            });

            // accountManager!.fetchShippingList()
                // .then((resp: IGETShippingInformation) => {
            //         setShippingInfo(resp);
            //         setShippingListR(resp.attributes.shipping_info_list);
            //     })
            //     .catch(error => console.log('Shipping list error: ', error))
        }
    }, [accountManager!.currentUser, accountManager!.refresh])


    return (
        <>
            <div className="shipping-info">
                <div className="title">Detalii livrare</div>
                <div className="info">Toate detaliile<b className="brand-color"> TREBUIESC</b> a fi modificate cu cel putin <b className="brand-color">1 zi</b> inainte de data urmatoarei facturari, pentru a primi produsul la noua adresa.</div>
                <div className="info">Poti avea una sau mai multe adrese de livrare. Te rugam sa adaugi cel putin o adresa si sa fie setata ca adresa principala!</div>
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