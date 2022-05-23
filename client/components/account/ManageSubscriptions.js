import { useContext, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ArrowRight, Code, Move } from "react-feather";
import Slider from "react-slick";
import CartContext from "../../store/cart-context";


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
    // const [subscriptionList, setSubscriptionList] = useState();
    
    // const subscriptionList = cartList.filter(item => item.payment === 'subscription')
    // console.log(subscriptionList)

    const [winReady, setWinReady] = useState(false);
    const [subsOrder, updateSubsOrder] = useState(subsList);

    // console.log(cartManager.subsList)
    useEffect(() => {
        setWinReady(true)
    }, []);
    
    // const subscriptionList = cartManager.subscriptionList();
    // console.log(subscriptionList)

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        if (!cartManager.subsList) return;
        const items = Array.from(cartManager.subsList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateSubsOrder(items);
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
                            {cartManager.subsList.map((item, index) => {
                                return (
                                    winReady && <Draggable key={item.cartId} draggableId={item.cartId.toString()} index={index} style={(_isDragging, draggableStyle) => ({ ...draggableStyle, position: 'static' })}>
                                        {(provided) => (
                                            <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <div className="image-wrapper">{console.log(item)}
                                                    <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + item.product.attributes.image.data[0].attributes.url}></img>
                                                </div>
                                                <div className="details">
                                                    <div className="title">{item.product.attributes.brand}</div>
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
    </>);
}

export default ManageSubscription;