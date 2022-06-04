import { useContext, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ArrowRight, Code, Move, Plus } from "react-feather";
import Slider from "react-slick";
import CartContext from "../../store/cart-context";
import { DateTime } from 'luxon';
import emptyBottle from '../../public/img/empty-bottle.png';

const ManageSubscription = ({ subscription }) => {
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
        const quickTipsElem = document.getElementById("quick-tips")
        if (window.innerWidth > 600 & window.innerWidth < 1101) {
            const elemWidth = window.innerWidth - 150 - (2 * 40) - 40;
            quickTipsElem.style.maxWidth = `${elemWidth}px`
        } else if(window.innerWidth <= 600) {
            let padding = 80;
            if (window.innerWidth <= 400) {
                padding = 40;
            }
            const elemWidth = window.innerWidth - padding;
            quickTipsElem.style.maxWidth = `${elemWidth}px`
        }

        window.onresize = () => {
            if (window.innerWidth > 600 & window.innerWidth < 1101) {
                const elemWidth = window.innerWidth - 150 - (2 * 40) - 40;
                quickTipsElem.style.maxWidth = `${elemWidth}px`
            } else if(window.innerWidth <= 600) {
                let padding = 80;
                if (window.innerWidth <= 400) {
                    padding = 40;
                }
                const elemWidth = window.innerWidth - padding;
                quickTipsElem.style.maxWidth = `${elemWidth}px`
            } else {
                quickTipsElem.style.maxWidth = '440px';
            }
        }
    }, [])

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
        <div className="dnd-list">
            
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
                            {/* {provided.placeholder} */}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    </>);
}

export default ManageSubscription;