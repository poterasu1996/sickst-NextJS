import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// Components
import { Star, Check, ChevronRight } from "react-feather";
import Rating from "react-rating";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import SickstModal from "../global/SickstModal";

// Storage & services
import AuthContext from "../../store/auth-context";
import CartService from "../../shared/services/cartService/index";

// Hooks
import { useCheckMysterySub } from "../../shared/hooks/useCheckMysterySub";
import { updateCart, useCart } from "../../features/cart/hooks/useCart";

// Utils
import { AppUtils } from "../../shared/utils/app.utils";

// Constants & Assets
import orderImg from "../../public/img/order-img.png";
import { PaymentEnums } from "../../shared/enums/payment.enums";

interface Props {
  product: any;
}

const Product = ({ product }: Props) => {
  const [show, setShow] = useState(false); // for Read more modal
  const [loading, setLoading] = useState(false); // used for loading animation
  const [subscription, setSubscription] = useState(true);
  const { isAuth } = useContext(AuthContext);
  const { isMystery } = useCheckMysterySub();
  const router = useRouter();

  useCart();  // connect to cartService changes

  const customToastTemplate = (
    <>
      <div className="toast-item">
        <div className="item-image">
          <img
            src={
              `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
              product!.attributes!.image!.data[0].attributes.url
            }
          ></img>
        </div>
        <div className="item-details">
          <div className="title">{product.attributes.brand}</div>
          <div className="subtitle">{product.attributes.model}</div>
          <div className="added">was added to cart</div>
        </div>
      </div>
    </>
  );

  const customToast6Products = (
    <>
      <div className="toast-item">
        <div className="content">
          <div className="title">Error</div>
          <div className="message">
            Your subscription list hast more than{" "}
            <b className="brand-color">6 products</b>!
          </div>
        </div>
      </div>
    </>
  );

  const handleAddProduct = () => {
    let paymentType;
    // check if logged in
    if (!isAuth) {
      router.push("/account/login");
    } else {
      if (subscription) {
        paymentType = "subscription";
        if (isMystery) {
          AppUtils.toastNotification(
            "You need to change subscription plan",
            false
          );
          return;
        }
        if (CartService.subscriptionList().length >= 6) {
          AppUtils.toastNotification("", false, customToast6Products);
          return;
        }
      } else {
        paymentType = "otb";
      }
      CartService.addProduct(product, 1, paymentType);
      updateCart();
      AppUtils.toastNotification("", true, customToastTemplate);
    }
  }

  const handleQueueProduct = () => {
    if (!isAuth) {
      // if not logged in, route to login page
      router.push("/account/login");
      return;
    }
    if (isMystery) {
      // check if user is subscribed with mystery plan
      AppUtils.toastNotification("You need to change subscription plan", false);
    } else {
      const paymentType = PaymentEnums.SUBSCRIPTION;
      if (CartService.subscriptionList().length >= 6) {
        AppUtils.toastNotification("", false, customToast6Products);
        return;
      }
      AppUtils.toastNotification("", true, customToastTemplate);
      CartService.addProduct(product, 1, paymentType);
      updateCart();
      setLoading(true);
    }
  };

  setTimeout(() => {
    setLoading(false); // to clear loading state
  }, 500);

  return (
    <>
      <div className="col col-sm-6 col-lg-4">
        <div className="product-card">
          <div className="product-wrapper" onClick={() => setShow(!show)}>
            <div className="product-card-image">
              <div className="product-card-image-wrapper">
                <img
                  src={
                    `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
                    product.attributes.image.data[0].attributes.url
                  }
                />
              </div>
              <span className="tag black">Exclussive</span>
            </div>
            <div className="product-card-rating">
              {/* @ts-ignore */}
              <Rating
                fractions={2}
                initialRating={product.attributes.rating}
                readonly={true}
                emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
              />
            </div>
            <div className="product-card-title">
              <span className="brand">{product.attributes.brand}</span>
              <span className="model">{product.attributes.model}</span>
            </div>
            <div className="product-card-fragrance">Fragrance elements</div>
            <div className="product-card-description">
              {product.attributes.description &&
                product.attributes.description.substring(0, 180) + "..."}
              <span>Read more</span>
            </div>
          </div>
          <div className="product-card-button">
            {CartService.hasProduct(product) ? (
              loading ? (
                <CircularProgress
                  sx={{ width: "30px !important", height: "30px !important" }}
                />
              ) : (
                <div className="card-button disabled">
                  <div className="check">
                    <Check stroke={"#fff"} height={22} width={22} />
                  </div>
                  <span>Added</span>
                </div>
              )
            ) : (
              <div className="card-button" onClick={handleQueueProduct}>
                <div className="plus"></div>Add to cart
              </div>
            )}
          </div>
        </div>
      </div>

      {/* product modal */}
      <SickstModal
        className="product-card-modal"
        open={show}
        size="large"
        onClose={() => setShow(!show)}
        footer={false}
      >
        <div className="row modal-container">
          <div className="col-12 col-md-4 col-lg-6">
            <div className="img-wrapper">
              <img
                src={
                  `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
                  product.attributes.image.data[0].attributes.url
                }
              ></img>
            </div>
          </div>
          <div className="col col-md-8 col-lg-6">
            <div className="product-details">
              <div className="title">
                {product.attributes.brand}
                <Link href={`/product/${product.id}`}>
                  <a>
                    Detalii produs{" "}
                    <ChevronRight height={"2rem"} width={"2rem"} />
                  </a>
                </Link>
              </div>
              <div className="model">{product.attributes.model}</div>
              <div className="price-wrapper d-flex justify-content-between">
                <div className="type">{product.attributes.type}</div>
                <div className="retail">
                  <b className="brand-color">
                    RON {product.attributes.retail_value}
                  </b>{" "}
                  Retail value
                </div>
              </div>
              <div className="rating">
                {/* @ts-ignore */}
                <Rating
                  fractions={2}
                  initialRating={product.attributes.rating}
                  readonly={true}
                  emptySymbol={
                    <Star size={15} fill="#babfc7" stroke="#babfc7" />
                  }
                  fullSymbol={
                    <Star size={15} fill="#cc3633" stroke="#cc3633" />
                  }
                />
                <div className="rating-nr">35 ratings</div>
              </div>
              <div className="order-type">
                <div className="order">
                  <Button
                    sx={{ textTransform: "none" }}
                    className={`order-btn ${subscription && "active"}`}
                    onClick={() => setSubscription(true)}
                  >
                    <div className="order-btn-content">
                      <Image src={orderImg} />
                      <div className="order-info">
                        <div className="volume">8 ml</div>
                        <div className="type">
                          Requires{" "}
                          <b>{product.attributes.subscription_type} plan</b>
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
                <div className="order">
                  <Button
                    sx={{ textTransform: "none" }}
                    className={`order-btn ${!subscription && "active"}`}
                    onClick={() => setSubscription(false)}
                  >
                    <div className="order-btn-content">
                      <Image src={orderImg} />
                      <div className="order-info">
                        <div className="volume">8 ml</div>
                        <div className="type">
                          One time <b>RON {product.attributes.otb_price}</b>
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="submit-btn">
                <button
                  className="button-second"
                  onClick={handleAddProduct}
                >
                  Add to queue
                </button>
              </div>
              <div className="fragrance-info">
                <div className="title">About the fragrance</div>
                <div className="info">{product.attributes.description}</div>
              </div>
            </div>
          </div>
        </div>
      </SickstModal>
    </>
  );
};

export default Product;
