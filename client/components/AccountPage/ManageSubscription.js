import { useContext, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ArrowRight, Check, Code, Move, Plus } from "react-feather";
import Slider from "react-slick";
import CartContext from "../../store/cart-context";
import { DateTime } from 'luxon';
import emptyBottle from '../../public/img/empty-bottle.png';
import subscriptionBanner from '../../public/img/subscribe-banner.jpg';
import Link from "next/link";

const ManageSubscription = ({ subscription }) => {
    // For future, here we want to manage the basic subscription list, where clients can have multiple product
    // choices at the same price, and for same subscription price, they can choose from multiple products
    const slickSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    } 
    
    const { cartManager } = useContext(CartContext);
    const [winReady, setWinReady] = useState(false);
    const [subsOrder, updateSubsOrder] = useState([]);

    useEffect(() => {
        setWinReady(true)
        if (cartManager.subsList) {
            updateSubsOrder(cartManager.subsList)
        }
    }, [cartManager.subsList]);

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
    }, [window.onresize])

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        if (!cartManager.subsList) return;
        const items = Array.from(subsOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateSubsOrder(items);
    }

    function setMonth(index) {
        let subscriptionMonth;
        if(index >= 0) {
            subscriptionMonth = DateTime.fromISO(DateTime.now()).plus({months: index + 1}).toFormat('LLLL');
            return subscriptionMonth;
        } 
        return null;
    }

    return (<>
        <div className="manage-subscription">
            <div className="left-side">
                <div className="subscribe-banner card">
                    <img src={subscriptionBanner.src} />
                    <div className="title">Get 50% off today</div>
                    <div className="text">Subscribe today and get your next product at $10</div>
                    <Link href="/payment/subscription">
                        <a className="button-second">Subscribe</a>
                    </Link>
                </div>
                <div className="benefits">
                    <div className="title">Your benefits:</div>
                    <ul>
                        <li><Check stroke={"#cc3633"}/> Over <span className="brand-color">600 fragrances</span> to choose from, straight from the source</li>
                        <li><Check stroke={"#cc3633"}/> Get personal recommendations based on scents you love</li>
                        <li><Check stroke={"#cc3633"}/> <span className="brand-color">Flexible membership plans</span> that cater to your lifestyle</li>
                    </ul>
                </div>
                <button className="button-second">Update list</button>
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
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="subscriptions">
                        {(provided) => (
                            <ul className="subscriptions-list" {...provided.droppableProps} ref={provided.innerRef}>
                                {subsOrder.map((item, index) => {
                                    // setMonth(index);
                                    return (
                                        winReady && <Draggable key={item.cartId} draggableId={item.cartId.toString()} index={index} style={(_isDragging, draggableStyle) => ({ ...draggableStyle, position: 'static' })}>
                                            {(provided) => (
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
                </DragDropContext>
            </div>
        </div>
    </>);
}

export default ManageSubscription;