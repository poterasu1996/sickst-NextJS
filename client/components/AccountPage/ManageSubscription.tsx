import { useContext, useEffect, useState } from "react";
import { Check, Plus } from "react-feather";
import emptyBottle from "../../public/img/empty-bottle.png";
import UnsubscribedUser from "./UnsubscribedUser";
import CartService from "../../shared/services/cartService";
import ICartProduct from "../../types/CartProduct.interface";
import {
  IGETSubscriptionOrder,
  SubscriptionNameEnum,
  SubscriptionStatusEnum,
} from "../../models/SubscriptionOrder.model";
import axios from "../../api/axios";
import { Spinner } from "react-bootstrap";
import { Skeleton } from "@mui/material";
import { toast } from "react-toastify";
import ILocalUserInfo from "../../types/account/LocalUserInfo.interface";
import Link from "next/link";
import SubscriptionCardDetails from "./SubscriptionCardDetails";

// @ts-ignore
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// @ts-ignore
import Slider from "react-slick";
// @ts-ignore
import { DateTime } from "luxon";
// @ts-ignore
import AuthContext from "../../store/auth-context";
import { IGETProduct } from "../../models/Product.model";

import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { pickersLayoutClasses } from "@mui/x-date-pickers/PickersLayout";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers";
import DndCard from "./DndCard";
import { AppUtils } from "../../shared/utils/app.utils";

type Props = {
  userInfo: ILocalUserInfo;
  subscriptionHistory: IGETSubscriptionOrder[];
};

type SubscriptionOrderItem = {
  product_id: number;
  brand: string;
  model: string;
  image: string;
  delivery_month: string;
};

type FullSubOrderProduct = SubscriptionOrderItem | ICartProduct;

const ManageSubscription = ({ userInfo, subscriptionHistory }: Props) => {
  // since the app evolved, is not enough to check for userInfo.subscribed,
  // now we need to show custom message based on subscription type

  // For future, here we want to manage the basic subscription list, where clients can have multiple product
  // choices at the same price, and for same subscription price, they can choose from multiple products
  const slickSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { isAuth, token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const [header, setHeader] = useState<any>(null);
  const [winReady, setWinReady] = useState(false);
  const [dbSubsOrder, setDBSubsOrder] = useState<SubscriptionOrderItem[]>([]);
  const [cartSubsOrder, setCartSubsOrder] = useState<ICartProduct[]>([]);
  const [fullSubOrder, setFullSubOrder] = useState<FullSubOrderProduct[]>([]);
  const [highlightedDays, setHighlightedDays] = useState([15, 30]);
  const [updatedSubList, setUpdatedSubList] = useState<{
    data: {
      subscription_list: SubscriptionOrderItem[] | null;
    };
  }>();

  let activeSubscription: IGETSubscriptionOrder | undefined = undefined;
  if (subscriptionHistory) {
    activeSubscription = subscriptionHistory
      .reverse()
      .find(
        (sub: IGETSubscriptionOrder) =>
          sub.attributes.subscription_status === SubscriptionStatusEnum.ACTIVE
      );
  }

  async function fetchDBSubsOrders() {
    try {
      const { data }: { data: IDTOSubscriptionhistory } = await axios.get(
        `/subscription-orders?filters[user_id][$eq]=${userInfo.id}&filters[subscription_status][$eq]=active`,
        header
      );
      if (
        data.data.length > 0 &&
        data.data[0].attributes?.subscription_list !== null
      ) {
        setDBSubsOrder([...data.data[0].attributes.subscription_list]);
      } else {
        setDBSubsOrder([]);
      }
    } catch (error) {
      AppUtils.toastNotification("OOPS! An error occured retrieving subscription orders!", false);
      console.log(error);
    }
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

  function isCartOrder(item: FullSubOrderProduct): item is ICartProduct {
    return (item as ICartProduct).product !== undefined;
  }

  function prepareSubscriptionList(rawList: FullSubOrderProduct[]) {
    // prepare the subscription list that we need
    const newList: any[] = rawList.map(
      (product: FullSubOrderProduct, index: number) => {
        if (isCartOrder(product)) {
          return {
            product_id: product.product.id,
            brand: product.product.attributes.brand,
            model: product.product.attributes.model,
            image: product.product.attributes.image.data[0].attributes.url,
            delivery_month: DateTime.fromISO(DateTime.now())
              .plus({ months: index + 1 })
              .toFormat("LLLL"),
          };
        } else {
          return {
            product_id: product.product_id,
            brand: product.brand,
            model: product.model,
            image: product.image,
            delivery_month: DateTime.fromISO(DateTime.now())
              .plus({ months: index + 1 })
              .toFormat("LLLL"),
          };
        }
      }
    );

    setUpdatedSubList({
      data: {
        subscription_list: newList.length > 0 ? newList : null,
      },
    });
  }

  function handleDeleteCard(index: number) {
    const newList = fullSubOrder.filter((el, idx) => idx !== index);
    setFullSubOrder(newList);
    setUpdated(true);
  }

  interface IDTOSubscriptionhistory {
    data: IGETSubscriptionOrder[];
  }
  async function handleUpdateList() {
    // update order list
    try {
      const { data }: { data: IDTOSubscriptionhistory } = await axios.get(
        `/subscription-orders?filters[user_id][$eq]=${userInfo.id}`,
        header
      );

      if (data.data.length > 0) {
        const orderId = data.data[0].id;
        try {
          axios
            .put(`/subscription-orders/${orderId}`, updatedSubList, header)
            .then(() => {
              setLoadingButton(true);
              setUpdated(false);
              AppUtils.toastNotification("Lista a fost actualizata cu success!", true);
            });
        } catch (error) {
          console.log("nu s epuede", error);
          AppUtils.toastNotification("ERROR! Actiunea nu a putut fi finalizata!", false);
        }
        // remove sub items from cart
        CartService.storageList && CartService.removeLSSubscriptioProducts();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getMysteryProduct = async () => {
    // this will retrieve a mystery product for the user, but for the moment, we mimic it
    try {
      let prodList: IGETProduct[] = [];
      const data = await axios.get("/products?populate=*").then((resp) => {
        return resp.data.data.map((prod: IGETProduct) => {
          if (prod.attributes.subscription_type === SubscriptionNameEnum.BASIC)
            return prod;
        });
      });
      prodList = [...data.filter(Boolean)];
      const randomIndex = Math.floor(Math.random() * prodList.length);
      return [
        {
          product_id: prodList[randomIndex].id,
          brand: prodList[randomIndex].attributes.brand,
          model: prodList[randomIndex].attributes.model,
          image: prodList[randomIndex].attributes.image.data[0].attributes.url,
          delivery_month: DateTime.fromISO(DateTime.now()).toFormat("LLLL"),
        },
      ];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  function checkIfMystery() {
    if (
      activeSubscription?.attributes.subscription_name ===
      SubscriptionNameEnum.MYSTERY
    )
      return true;
    return false;
  }

  function checkIfBasicOrPremium() {
    if (
      activeSubscription?.attributes.subscription_name ===
        SubscriptionNameEnum.BASIC ||
      activeSubscription?.attributes.subscription_name ===
        SubscriptionNameEnum.PREMIUM
    )
      return true;
    return false;
  }

  function ServerDay(
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
  ) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0;

    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        className={isSelected ? "Mui-selected" : ""}
      />
    );
  }

  useEffect(() => {
    if (token) {
      setHeader({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [token]);

  useEffect(() => {
    cartSubsOrder.length > 0 && setUpdated(true);
  }, [cartSubsOrder]);

  useEffect(() => {
    header && fetchDBSubsOrders();
  }, [header]);

  useEffect(() => {
    setWinReady(true);
    setCartSubsOrder([...CartService.subscriptionList()]);
  }, [CartService.cart]);

  useEffect(() => {
    const fetchData = async () => {
      if (checkIfBasicOrPremium()) {
        setFullSubOrder([...dbSubsOrder, ...cartSubsOrder]);
      } else if (checkIfMystery()) {
        const mysteryProduct = await getMysteryProduct();
        console.log("mProd", mysteryProduct);
        setFullSubOrder([...mysteryProduct]);
      } else {
        setFullSubOrder([...cartSubsOrder]);
      }
    };
    fetchData();
  }, [dbSubsOrder, cartSubsOrder]);

  useEffect(() => {
    const quickTipsElem = document.getElementById("quick-tips");
    let elemWidth;
    if (quickTipsElem) {
      if (screen.availWidth <= 400) {
        elemWidth = 360;
        quickTipsElem!.style.maxWidth = `${elemWidth}px`;
      } else if (screen.availWidth <= 600) {
        let padding = 40;
        elemWidth = screen.availWidth - padding;
        quickTipsElem!.style.maxWidth = `${elemWidth}px`;
      } else if (screen.availWidth <= 1150) {
        let padding = 280;
        elemWidth = screen.availWidth - padding;
        quickTipsElem!.style.maxWidth = `${elemWidth}px`;
      } else {
        quickTipsElem!.style.maxWidth = `${450}px`;
      }

      window.onresize = () => {
        if (screen.availWidth <= 400) {
          elemWidth = 360;
          quickTipsElem!.style.maxWidth = `${elemWidth}px`;
        } else if (screen.availWidth <= 600) {
          let padding = 40;
          elemWidth = screen.availWidth - padding;
          quickTipsElem!.style.maxWidth = `${elemWidth}px`;
        } else if (screen.availWidth <= 1150) {
          let padding = 280;
          elemWidth = screen.availWidth - padding;
          quickTipsElem!.style.maxWidth = `${elemWidth}px`;
        } else {
          quickTipsElem!.style.maxWidth = `${450}px`;
        }
      };
    }
  }, [typeof window !== "undefined" && window.onresize]);

  useEffect(() => {
    setTimeout(() => {
      loading && setLoading(false);
      loadingButton && setLoadingButton(false);
    }, 500);
  }, [loading, loadingButton]);

  useEffect(() => {
    prepareSubscriptionList(fullSubOrder);
  }, [fullSubOrder]);

  return (
    <>
      <div className="manage-subscription">
        <div className="left-side">
          <SubscriptionCardDetails
            userSubscription={subscriptionHistory}
            userInfo={userInfo}
          />

          {checkIfMystery() && (
            <div className="plan-description">
              <div className="title">Ce-ti aduce abonamentul Mystery</div>
              <p>
                Fiecare luna, intr-o experienta captivanta, vei descoperi
                parfumuri noi, selectionate cu grija pentru a-ti satisface
                nevoile personale.
              </p>
            </div>
          )}
          {checkIfBasicOrPremium() && (
            <div className="quick-tips" id="quick-tips">
              <div className="title">Quick tips to customize your queue</div>
              <Slider {...slickSettings}>
                <div className="item">
                  <div className="title">
                    <b className="brand-color">1 of 3</b> - Edit your queue
                  </div>
                  <div className="details">
                    Switch the order of your items by holding down the two lines
                    on the right side, then dragging the product to move it
                    accordingly.
                  </div>
                </div>
                <div className="item">
                  <div className="title">
                    <b className="brand-color">2 of 3</b> - Edit your queue
                  </div>
                  <div className="details">
                    Switch the order of your items by holding down the two lines
                    on the right side, then dragging the product to move it
                    accordingly.
                  </div>
                </div>
                <div className="item">
                  <div className="title">
                    <b className="brand-color">3 of 3</b> - Edit your queue
                  </div>
                  <div className="details">
                    Switch the order of your items by holding down the two lines
                    on the right side, then dragging the product to move it
                    accordingly.
                  </div>
                </div>
              </Slider>
            </div>
          )}

          {activeSubscription && checkIfBasicOrPremium() ? (
            <>
              <div className="text-update">
                Nu uita sa apesi buton <b className="brand-color">Update</b>{" "}
                pentru a-ti actualiza lista de parfumuri, de fiecare data cand
                adaugi sau reordonezi lista!
              </div>
              <div className="btn-wrapper">
                <button
                  className="button-second"
                  disabled={!updated}
                  onClick={() => handleUpdateList()}
                >
                  {loadingButton ? (
                    <Spinner animation="border" style={{ color: "#fff" }} />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="unsubscriber">
                <div className="benefits">
                  <div className="title">Your benefits:</div>
                  <ul>
                    <li className="flex">
                      <Check stroke={"#cc3633"} className="mr-5"/> Over{" "} 
                      <span className="brand-color block mx-2">600 fragrances</span>to choose from, straight from the source
                    </li>
                    <li className="flex">
                      <Check stroke={"#cc3633"} className="mr-5"/> Get personal recommendations
                      based on scents you love
                    </li>
                    <li className="flex">
                      <Check stroke={"#cc3633"} className="mr-5"/>{" "}
                      <span className="brand-color block mr-2">
                        Flexible membership plans
                      </span>{" "}
                      that cater to your lifestyle
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="dnd-list">
          <div className="service-description">
            <div className="delivery-details">
              <div className="title">Detalii referitoare la livrare</div>
              <p>
                Fiind in curs de dezvoltare, pentru orice tip de abonament,
                livrarea produselor se va efectua bilunar, la mijlocul si la
                finalul fiecarei luni
              </p>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                disabled
                className={pickersLayoutClasses.contentWrapper}
                slots={{
                  day: ServerDay,
                }}
                slotProps={{
                  day: {
                    highlightedDays,
                  } as any,
                }}
              />
            </LocalizationProvider>
          </div>

          {loading ? (
            <div className="skeleton">
              <Skeleton variant="rounded" width={310} height={140} />
            </div>
          ) : (
            <>
              {fullSubOrder.length === 0 && (
                <ul className="subscriptions-list">
                  <li className="dnd-card">
                    <div className="image-wrapper">
                      <img
                        style={{ height: "80%" }}
                        src={emptyBottle.src}
                      ></img>
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
                        <span className="brand">Pick your next scent</span>
                      </div>
                      <div className="model">
                        If this slot is empty, we'll ship you our product of the
                        month.
                      </div>
                    </div>
                  </li>
                </ul>
              )}
              {fullSubOrder.length > 0 && (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="subscriptions">
                    {(provided: any) => (
                      <ul
                        className="subscriptions-list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {fullSubOrder.map((item, index) => {
                          return (
                            winReady && (
                              <DndCard
                                key={index}
                                index={index}
                                item={item}
                                isMystery={checkIfMystery()}
                                deleteCard={(idx) => handleDeleteCard(idx)}
                                mysteryProduct={undefined}
                              />
                            )
                          );
                        })}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageSubscription;
