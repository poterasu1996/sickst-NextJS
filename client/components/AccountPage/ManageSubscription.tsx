import { useContext, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ArrowRight, Check, Code, Move, Plus } from "react-feather";
import Slider from "react-slick";
import CartContext from "../../store/cart-context";
import { DateTime } from 'luxon';
import emptyBottle from '../../public/img/empty-bottle.png';
import UnsubscribedUser from './UnsubscribedUser';
import CartService from "../../shared/services/cartService";
import ICartProduct from "../../types/CartProduct.interface";

type Props = {
    subscribed: boolean | null
}

const ManageSubscription = ({ subscribed }: Props) => {
    // For future, here we want to manage the basic subscription list, where clients can have multiple product
    // choices at the same price, and for same subscription price, they can choose from multiple products
    const slickSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    } 

    const cartManager = useContext(CartContext);
    const [winReady, setWinReady] = useState(false);
    const [subsOrder, updateSubsOrder] = useState<ICartProduct[]>([]);

    useEffect(() => {
        setWinReady(true)
        updateSubsOrder([...CartService.subscriptionList()])
    }, [CartService.cart]);

    useEffect(() => {
        const quickTipsElem = document.getElementById("quick-tips");
        let elemWidth;
        if(screen.availWidth <= 400) {
            elemWidth = 360;
            quickTipsElem.style.maxWidth = `${elemWidth}px`
        } else if(screen.availWidth <= 600) {
            let padding = 40;
            elemWidth = screen.availWidth - padding;
            quickTipsElem.style.maxWidth = `${elemWidth}px`
        } else if(screen.availWidth <= 740) {
            elemWidth = screen.availWidth - 150 - (4 * 20) - 70;
            quickTipsElem.style.maxWidth = `${elemWidth}px`
        } else if(screen.availWidth <= 990) {
            elemWidth = screen.availWidth - 150 - (2 * 20) - (2 * 40) - 70;
            quickTipsElem.style.maxWidth = `${elemWidth}px`
        } else if(screen.availWidth <= 1200) {
            elemWidth = screen.availWidth - 780;
            quickTipsElem.style.maxWidth = `${elemWidth}px`
            quickTipsElem.style.minWidth = `${320}px`
        } else {
            quickTipsElem.style.maxWidth = `${450}px`
        }

        window.onresize = () => {
            if(screen.availWidth <= 400) {
                elemWidth = 360;
                quickTipsElem.style.maxWidth = `${elemWidth}px`
            } else if(screen.availWidth <= 600) {
                let padding = 40;
                elemWidth = screen.availWidth - padding;
                quickTipsElem.style.maxWidth = `${elemWidth}px`
            } else if(screen.availWidth <= 740) {
                elemWidth = screen.availWidth - 150 - (4 * 20) - 70;
                quickTipsElem.style.maxWidth = `${elemWidth}px`
            } else if(screen.availWidth <= 990) {
                elemWidth = screen.availWidth - 150 - (2 * 20) - (2 * 40) - 70;
                quickTipsElem.style.maxWidth = `${elemWidth}px`
            } else if(screen.availWidth <= 1200) {
                elemWidth = screen.availWidth - 780;
                quickTipsElem.style.maxWidth = `${elemWidth}px`
                quickTipsElem.style.minWidth = `${320}px`
            } else {
                quickTipsElem.style.maxWidth = `${450}px`
            }
        }
    }, [typeof window !== 'undefined' && window.onresize])

    function handleOnDragEnd(result: any) {
        console.log('result', result)
        if (!result.destination) return;
        if (!CartService.subscriptionList()) return;
        const items = Array.from(subsOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateSubsOrder(items);
    }

    function setMonth(index: any) {
        let subscriptionMonth;
        if(index >= 0) {
            subscriptionMonth = DateTime.fromISO(DateTime.now()).plus({months: index + 1}).toFormat('LLLL');
            return subscriptionMonth;
        } 
        return null;
    }

    return (<>
        <div className="manage-subscription">
            {!subscribed && <UnsubscribedUser />}
            <div className="left-side">
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

                {subsOrder.length === 0 && <ul className="subscriptions-list">
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
                </ul>}
                {subsOrder.length > 0 &&(<DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="subscriptions">
                        {(provided: any) => (
                            <ul className="subscriptions-list" {...provided.droppableProps} ref={provided.innerRef}>
                                {subsOrder.map((item, index) => {
                                    return (
                                        winReady && <Draggable key={item.cartProductId} draggableId={item.cartProductId.toString()} index={index} style={(_isDragging: any, draggableStyle: any) => ({ ...draggableStyle })}>
                                            {(provided: any) => (
                                                <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <div className="image-wrapper">
                                                        <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + item.product.attributes.image.data[0].attributes.url}></img>
                                                    </div>
                                                    <div className="details">
                                                        <div className="title"><span className="brand">{item.product.attributes.brand}</span> <div className="date">{setMonth(index)}</div></div>
                                                        <div className="model">{item.product.attributes.model}</div>
                                                        <a className="link">Details <ArrowRight width={40} height={20} /></a>
                                                        <div className="move"><Code /></div>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>)}
            </div>
        </div>
    </>);
}

export default ManageSubscription;