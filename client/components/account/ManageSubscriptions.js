import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Slider from "react-slick";


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

    const [winReady, setWinReady] = useState(false);
    const [subsOrder, updateSubsOrder] = useState(subsList);

    useEffect(() => {
        setWinReady(true)
    }, []);

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(subsOrder);
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
                            {subsOrder.map(({id, item}, index) => {
                                return (
                                    winReady && <Draggable key={id} draggableId={id} index={index}>
                                        {(provided) => (
                                            <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <div>{item}</div>
                                                <>DSADASD</>
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