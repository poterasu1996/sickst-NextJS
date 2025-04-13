// @ts-ignore
import { Draggable } from "react-beautiful-dnd";
// @ts-ignore
import { DateTime } from "luxon";
import ICartProduct from "../../shared/types/cart/cart-product.interface";
import { ArrowRight, Code, Plus, X } from "react-feather";
import emptyBottle from "../../public/img/empty-bottle.png";

type Props = {
  index: number;
  item: FullSubOrderProduct;
  isMystery: boolean;
  deleteCard: (idx: number) => void;
  mysteryProduct: ICartProduct | undefined; // in future, we will use a backend service to get user-specific mystery product
};
type SubscriptionOrderItem = {
  product_id: number;
  brand: string;
  model: string;
  image: string;
  delivery_month: string;
};
type FullSubOrderProduct = SubscriptionOrderItem | ICartProduct;

const DndCard = ({
  index,
  item,
  isMystery,
  deleteCard,
  mysteryProduct,
}: Props) => {
  function isCartOrder(item: FullSubOrderProduct): item is ICartProduct {
    return (item as ICartProduct).product !== undefined;
  }

  function setMonth(index: any) {
    let subscriptionMonth;
    if (index >= 0) {
      subscriptionMonth = DateTime.fromISO(DateTime.now())
        .plus({ months: index + 1 })
        .toFormat("LLLL");
      return subscriptionMonth;
    }
    return null;
  }

  return (
    <>
      {isCartOrder(item) ? (
        <>
          <Draggable
            key={index.toString()}
            draggableId={index.toString()}
            index={index}
            // style={(_isDragging: any, draggableStyle: any) => ({ ...draggableStyle })}
          >
            {(provided: any) => (
              <li
                className="dnd-card"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                <div className="image-wrapper">
                  <img
                    src={
                      `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
                      item.product.attributes.image.data[0].attributes.url
                    }
                  ></img>
                </div>
                <div className="details">
                  <div className="title">
                    <span className="brand">
                      {item.product.attributes.brand}
                    </span>
                  </div>
                  <div className="model">
                    {item.product.attributes.model}
                    <div className="date">{setMonth(index)}</div>
                  </div>
                  <a className="link" style={{display: 'flex'}}>
                    Details <ArrowRight width={40} height={20} />
                  </a>
                  <div className="move">
                    <Code />
                  </div>
                </div>
                <button
                  className="remove-card"
                  onClick={() => deleteCard(index)}
                >
                  <X stroke={"#cc3633"} />
                </button>
              </li>
            )}
          </Draggable>
        </>
      ) : (
        <>
          {isMystery ? (
            mysteryProduct ? (
              <>Mystery prod template</>
            ) : (
              <ul className="subscriptions-list">
                <li className="dnd-card">
                  <div className="image-wrapper">
                    <img style={{ height: "80%" }} src={emptyBottle.src}></img>
                    <div className="plus">
                      <Plus
                        width={20}
                        height={20}
                        stroke={"#fff"}
                        strokeWidth={2.7}
                      />
                    </div>
                  </div>
                  <div className="details">
                    <div className="title">
                      <span className="brand">Mystery ???</span>
                    </div>
                    <div className="model">
                      Vei primi mai multe detalii cu 2-3 zile inaintea livrarii.
                    </div>
                  </div>
                </li>
              </ul>
            )
          ) : (
            <Draggable
              key={index.toString()}
              draggableId={index.toString()}
              index={index}
              // style={(_isDragging: any, draggableStyle: any) => ({ ...draggableStyle })}
            >
              {(provided: any) => (
                <li
                  className="dnd-card"
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <div className="image-wrapper">
                    <img
                      src={
                        `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + item.image
                      }
                    ></img>
                  </div>
                  <div className="details">
                    <div className="title">
                      <span className="brand">{item.brand}</span>{" "}
                    </div>
                    <div className="model">
                      {item.model}
                      <div className="date">{setMonth(index)}</div>
                    </div>
                    <a className="link" style={{display: 'flex'}}>
                      Details <ArrowRight width={40} height={20} />
                    </a>
                    <div className="move">
                      <Code />
                    </div>
                  </div>
                  {!isMystery && (
                    <button
                      className="remove-card"
                      onClick={() => deleteCard(index)}
                    >
                      <X stroke={"#cc3633"} />
                    </button>
                  )}
                </li>
              )}
            </Draggable>
          )}
        </>
      )}
    </>
  );
};

export default DndCard;
