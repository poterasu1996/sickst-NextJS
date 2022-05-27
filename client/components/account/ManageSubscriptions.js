import { useContext, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ArrowRight, Code, Move } from "react-feather";
import Slider from "react-slick";
import CartContext from "../../store/cart-context";
import { DateTime } from 'luxon';

const ManageSubscription = () => {
    const slickSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    } 

    const subsList = [
        {
            id: 'unu',
            item: 'Item 1'
        },
        {   
            id: 'doi',
            item: 'Item 2'
        },
        {
            id: 'trei',
            item: 'Item 3'
        },
    ]
    const { cartManager } = useContext(CartContext);
    const [winReady, setWinReady] = useState(false);
    const [subsOrder, updateSubsOrder] = useState([]);

    useEffect(() => {
        setWinReady(true)
        if (cartManager.subsList) {
            updateSubsOrder(cartManager.subsList)
        }
    }, [cartManager.subsList]);
    
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
        <div className="quick-tips">
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