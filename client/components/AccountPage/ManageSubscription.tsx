import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ArrowRight, Check, Code, Move, Plus, X } from "react-feather";
import Slider from "react-slick";
import { DateTime } from 'luxon';
import emptyBottle from '../../public/img/empty-bottle.png';
import UnsubscribedUser from './UnsubscribedUser';
import CartService from "../../shared/services/cartService";
import ICartProduct from "../../types/CartProduct.interface";
import IGETSubscriptionHistory from "../../types/Subscription.interface";
import Cookies from 'js-cookie';
import axios from "../../api/axios";
import { Spinner } from "react-bootstrap";
import { Skeleton } from "@mui/material";
import { toast } from "react-toastify";
import ILocalUserInfo from "../../types/account/LocalUserInfo.interface";
import Link from "next/link";
import SubscriptionCardDetails from "./SubscriptionCardDetails";

type Props = {
    userInfo: ILocalUserInfo,
    subscriptionHistory: IGETSubscriptionHistory[]
}

type SubscriptionOrderItem = {
    product_id: number,
    brand: string,
    model: string,
    image: string,
    delivery_month: string
}

type FullSubOrderProduct = SubscriptionOrderItem | ICartProduct

const ManageSubscription = ({ userInfo, subscriptionHistory }: Props) => {
    // For future, here we want to manage the basic subscription list, where clients can have multiple product
    // choices at the same price, and for same subscription price, they can choose from multiple products
    const slickSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    } 

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);
    const [header, setHeader] = useState<any>(null);
    const [winReady, setWinReady] = useState(false);
    const [orderDetails, setOrderDetails] = useState<IGETSubscriptionHistory>();
    const [dbSubsOrder, setDBSubsOrder] = useState<SubscriptionOrderItem[]>([]);
    const [cartSubsOrder, setCartSubsOrder] = useState<ICartProduct[]>([]);
    const [fullSubOrder, setFullSubOrder] = useState<FullSubOrderProduct[]>([]);
    const [updatedSubList, setUpdatedSubList] = useState<{ 
        data: {
            subscription_list: SubscriptionOrderItem[]
        }
    }>();

    async function fetchDBSubsOrders() {
        try {
            const { data }: { data: IDTOSubscriptionhistory } = await 
                axios.get(`/subscription-orders?filters[user_id][$eq]=${userInfo.id}&filters[subscription_status][$eq]=active`, header);
            if(data.data[0].attributes.subscription_list === null) {
                setDBSubsOrder([]);
                setOrderDetails(data.data[0]);
            } else {
                setOrderDetails(data.data[0]);
                setDBSubsOrder([...data.data[0].attributes.subscription_list]);
            }
        } catch (error) {
            console.log(error);            
        }
    }

    function notify(message: string) {
        toast(message, { autoClose: 2000 });
    }

    function isCartOrder(item: FullSubOrderProduct): item is ICartProduct {
        return (item as ICartProduct).product !== undefined;
    }

    function handleOnDragEnd(result: any) {
        if (!result.destination) return;
        if (!CartService.subscriptionList()) return;
        const items = Array.from(fullSubOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFullSubOrder(items);
        setUpdated(true);
    }

    function setMonth(index: any) {
        let subscriptionMonth;
        if(index >= 0) {
            subscriptionMonth = DateTime.fromISO(DateTime.now()).plus({months: index + 1}).toFormat('LLLL');
            return subscriptionMonth;
        } 
        return null;
    }

    function prepareSubscriptionList(rawList: FullSubOrderProduct[]) {
        // prepare the subscription list that we need
        const newList = rawList.map((product: FullSubOrderProduct, index: number) => {
            if(isCartOrder(product)) {
                return {
                    product_id: product.product.id,
                    brand: product.product.attributes.brand,
                    model: product.product.attributes.model,
                    image: product.product.attributes.image.data[0].attributes.url,
                    delivery_month: DateTime.fromISO(DateTime.now()).plus({months: index + 1}).toFormat('LLLL')
                }
            } else {
                return {
                    product_id: product.product_id,
                    brand: product.brand,
                    model: product.model,
                    image: product.image,
                    delivery_month: DateTime.fromISO(DateTime.now()).plus({months: index + 1}).toFormat('LLLL')
                }
            }
        })

        setUpdatedSubList({ 
            data: {
                subscription_list: newList
            }
        });
    }

    function handleDeleteCard(index: number) {
        const newList = fullSubOrder.filter((el, idx) => idx !== index);
        setFullSubOrder(newList);
    }

    interface IDTOSubscriptionhistory {
        data: IGETSubscriptionHistory[]
    }
    async function handleUpdateList() {
        // update order list
        try {
            const { data }: { data: IDTOSubscriptionhistory } = await axios.get(`/subscription-orders?filters[user_id][$eq]=${userInfo.id}`, header)

            if(data.data.length > 0) {
                const orderId = data.data[0].id;
                try {
                    axios.put(`/subscription-orders/${orderId}`, updatedSubList, header)
                        .then(() => {
                            setLoadingButton(true);
                            setUpdated(false);
                            notify('Lista a fost actualizata cu success!');
                        });
                } catch (error) {
                    console.log('nu s epuede', error);
                    notify('ERROR! Actiunea nu a putut fi finalizata!');                    
                }
                // remove sub items from cart
                CartService.storageList && CartService.removeLSSubscriptioProducts()
            }
        } catch (error) {
            console.log(error)   
        }
    }

    useEffect(() => {
        const jwt = Cookies.get("jwt");
        if(jwt) {
            setHeader({
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            })
        }
    }, [])

    useEffect(() => {
        (cartSubsOrder.length > 0) && setUpdated(true);
    }, [cartSubsOrder])

    useEffect(() => {
        header && fetchDBSubsOrders();
    }, [header]);

    useEffect(() => {
        setWinReady(true)
        setCartSubsOrder([...CartService.subscriptionList()])
    }, [CartService.cart]);

    useEffect(() => {
        if(userInfo?.subscribed) {
            setFullSubOrder([...dbSubsOrder, ...cartSubsOrder]);
        } else {
            setFullSubOrder([...cartSubsOrder]);
        }
    }, [dbSubsOrder, cartSubsOrder])

    useEffect(() => {
        const quickTipsElem = document.getElementById("quick-tips");
        let elemWidth;
        if(screen.availWidth <= 400) {
            elemWidth = 360;
            quickTipsElem!.style.maxWidth = `${elemWidth}px`
        } else if(screen.availWidth <= 600) {
            let padding = 40;
            elemWidth = screen.availWidth - padding;
            quickTipsElem!.style.maxWidth = `${elemWidth}px`
        } else if(screen.availWidth <= 1150) {
            let padding = 280;
            elemWidth = screen.availWidth - padding;
            quickTipsElem!.style.maxWidth = `${elemWidth}px`;
        } else {
            quickTipsElem!.style.maxWidth = `${450}px`
        }

        window.onresize = () => {
            if(screen.availWidth <= 400) {
                elemWidth = 360;
                quickTipsElem!.style.maxWidth = `${elemWidth}px`
            } else if(screen.availWidth <= 600) {
                let padding = 40;
                elemWidth = screen.availWidth - padding;
                quickTipsElem!.style.maxWidth = `${elemWidth}px`
            } else if(screen.availWidth <= 1150) {
                let padding = 280;
                elemWidth = screen.availWidth - padding;
                quickTipsElem!.style.maxWidth = `${elemWidth}px`;
            } else {
                quickTipsElem!.style.maxWidth = `${450}px`
            }
        }
    }, [typeof window !== 'undefined' && window.onresize])

    useEffect(() => {
        setTimeout(() => {
            loading && setLoading(false);
            loadingButton && setLoadingButton(false);
        }, 500);
    }, [loading, loadingButton]);

    useEffect(() => {
        prepareSubscriptionList(fullSubOrder);
    }, [fullSubOrder])

    return (<>
        <div className="manage-subscription">
            <div className="left-side">
                <SubscriptionCardDetails orderDetails={orderDetails} userSubscription={subscriptionHistory} userInfo={userInfo} />
                {userInfo?.subscribed
                    ? <>
                            <div className="text-update">Nu uita sa apesi buton <b className="brand-color">Update</b> pentru a-ti actualiza lista de parfumuri,
                            de fiecare data cand adaugi sau reordonezi lista!</div>
                            <div className="btn-wrapper">
                                <button className="button-second" disabled={!updated} onClick={() => handleUpdateList()}>
                                    {loadingButton 
                                        ? <Spinner animation="border" style={{color: "#fff"}} />
                                        : 'Update'
                                    }
                                </button>
                            </div>
                        </>
                    : <>
                        <div className='unsubscriber'>
                            <div className="benefits">
                                <div className="title">Your benefits:</div>
                                <ul>
                                    <li><Check stroke={"#cc3633"}/> Over <span className="brand-color">600 fragrances</span> to choose from, straight from the source</li>
                                    <li><Check stroke={"#cc3633"}/> Get personal recommendations based on scents you love</li>
                                    <li><Check stroke={"#cc3633"}/> <span className="brand-color">Flexible membership plans</span> that cater to your lifestyle</li>
                                </ul>
                            </div>
                        </div>
                    </>
                }
            </div>
            <div className="dnd-list">
                <div className="quick-tips" id="quick-tips">
                    <div className="title">Quick tips to customize your queue</div>
                    <Slider {...slickSettings}>
                        <div className="item">
                            <div className="title"><b className="brand-color">1 of 3</b> - Edit your queue</div> 
                            <div className="details">Switch the order of your items by holding down the two lines on the right side, then dragging the product to move it accordingly.</div>
                        </div>
                        <div className="item">
                            <div className="title"><b className="brand-color">2 of 3</b> - Edit your queue</div> 
                            <div className="details">Switch the order of your items by holding down the two lines on the right side, then dragging the product to move it accordingly.</div>
                        </div>
                        <div className="item">
                            <div className="title"><b className="brand-color">3 of 3</b> - Edit your queue</div> 
                            <div className="details">Switch the order of your items by holding down the two lines on the right side, then dragging the product to move it accordingly.</div>
                        </div>
                    </Slider>
                </div>

                {loading
                    ?  <div className="skeleton">
                            <Skeleton variant="rounded" width={310} height={140} />
                            <Skeleton variant="rounded" width={310} height={140} />
                        </div>
                    : <>
                        {fullSubOrder.length === 0 && <ul className="subscriptions-list">
                            <li>
                                <div className="image-wrapper">
                                    <img style={{height: '80%'}} src={emptyBottle.src}></img>
                                    <div className="plus">
                                        <Plus width={20} height={20} stroke={'#fff'} strokeWidth={2.7} />
                                    </div>
                                </div>
                                <div className="details">
                                    <div className="title"><span className="brand">Pick your next scent</span></div>
                                    <div className="model">If this slot is empty, we'll ship you our product of the month.</div>
                                </div>

                            </li>
                        </ul>}{console.log(fullSubOrder)}
                        {fullSubOrder.length > 0 && (<DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="subscriptions">
                                    {(provided: any) => (
                                        <ul className="subscriptions-list" {...provided.droppableProps} ref={provided.innerRef}>
                                            {fullSubOrder.map((item, index) => {
                                                if(isCartOrder(item)) {
                                                    return (
                                                        winReady && <Draggable key={index.toString()} draggableId={index.toString()} index={index} style={(_isDragging: any, draggableStyle: any) => ({ ...draggableStyle })}>
                                                            {(provided: any) => (
                                                                <li className="dnd-card" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                    <div className="image-wrapper">
                                                                        <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +  item.product.attributes.image.data[0].attributes.url }></img>
                                                                    </div>
                                                                    <div className="details">
                                                                        <div className="title"><span className="brand">{item.product.attributes.brand}</span></div>
                                                                        <div className="model">{item.product.attributes.model}<div className="date">{setMonth(index)}</div></div>
                                                                        <a className="link">Details <ArrowRight width={40} height={20} /></a>
                                                                        <div className="move"><Code /></div>
                                                                    </div>
                                                                    <button className="remove-card" onClick={() => handleDeleteCard(index)}><X stroke={"#cc3633"}/></button>
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    )
                                                } else {
                                                    return (
                                                        winReady && <Draggable key={index.toString()} draggableId={index.toString()} index={index} style={(_isDragging: any, draggableStyle: any) => ({ ...draggableStyle })}>
                                                            {(provided: any) => (
                                                                <li className="dnd-card" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                    <div className="image-wrapper">
                                                                        <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +  item.image }></img>
                                                                    </div>
                                                                    <div className="details">
                                                                        <div className="title"><span className="brand">{item.brand}</span> </div>
                                                                        <div className="model">{item.model}<div className="date">{setMonth(index)}</div></div>
                                                                        <a className="link">Details <ArrowRight width={40} height={20} /></a>
                                                                        <div className="move"><Code /></div>
                                                                    </div>
                                                                    <button className="remove-card" onClick={() => handleDeleteCard(index)}><X stroke={"#cc3633"}/></button>
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    ) 
                                                }
                                            })}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </DragDropContext>)
                        }
                    </>
                }
            </div>
        </div>
    </>);
}

export default ManageSubscription;
