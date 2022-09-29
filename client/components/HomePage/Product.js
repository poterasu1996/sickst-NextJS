import { useState, useContext, Fragment } from "react";
import Rating from "react-rating";
import { Star, Check } from "react-feather";
import Image from "next/image";
import { Button, Spinner } from "react-bootstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import orderImg from "../../public/img/order-img.png";
import CartContext from "../../store/cart-context";
import AuthContext from "../../store/auth-context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Product = ({ product }) => {
  const [show, setShow] = useState(false); // for Read more modal
  const { cartManager } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const [addedToCart, setAddedToCart] = useState(false); // show the checkmark after added to cart
  const [loading, setLoading] = useState(false); // used for loading animation
  const [subscription, setSubscription] = useState(true);
  const router = useRouter();
  
  // in future, we must have 2 parameters: product and container (container will be the container price from DB, atm is static price)
  const containerPrice = 50;  // price of container

  const toastMsg = (
    <>
      <div className="toast-item">
        <div className="item-image">
          <img
            src={
              `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
              product.attributes.image.data[0].attributes.url
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

  function simplePrice(price) {
    const mlPrice = price / 100;    // price per ml of product

    const productPrice = containerPrice + (8 * mlPrice);   // price of full product for OTB
    return productPrice;
  }

  function subscriptionPrice(price) {
    // here we want the subscription to be cheaper than OTB, with -20 for example
    
    // subscription discount should be imported from DB;
    const discount = 20;

    const fullPrice = simplePrice(price);
    return fullPrice - discount;
  }

  const notify = () => {
    toast(toastMsg, {
      autoClose: 2000,
    });
  };

  setTimeout(() => {
    setLoading(false); // to clear loading state
  }, 500);

  // setTimeout(() => {
  //   setShowToast(false);  // to clear toast state
  // }, 3000);

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
                ></img>
              </div>
              <span className="tag black">Exclussive</span>
            </div>
            <div className="product-card-rating">
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
                product.attributes.description.substring(0, 195) + "..."}
              <span>Read more</span>
            </div>
          </div>
          <div className="product-card-button">
            {/* {console.log("auth", auth)} */}
            {/* {console.log(cartManager.hasProduct(product))} */}
            {cartManager.hasProduct(product) ? (
              loading ? (
                <Spinner animation="border" style={{ color: "#cc3663" }} />
              ) : (
                <div className="card-button disabled">
                  <div className="check">
                    <Check stroke={"#fff"} height={22} width={22} />
                  </div>
                  <span>Added</span>
                </div>
              )
            ) : auth ? (
              <div
                className="card-button"
                onClick={() => {
                  const paymentType = "subscription";
                  if (cartManager.subscriptionList.length >= 6) {
                    const msg = (
                      <>
                        <div>
                          Your subscription list hast more than{" "}
                          <b className="brand-color">6 products</b>!
                        </div>
                      </>
                    );
                    toast(msg, {
                      autoClose: 2000,
                    });
                    return;
                  }
                  notify();
                  cartManager.addProduct(product, 1, paymentType);
                  setAddedToCart(true);
                  setLoading(true);
                }}
              >
                <div className="plus"></div>Add to cart
              </div>
            ) : (
              <div
                className="card-button"
                onClick={() => {
                  router.push("/account/login");
                }}
              >
                <div className="plus"></div>Add to cart
              </div>
            )}
            <div className="price">
              RON:&nbsp;{subscriptionPrice(product.attributes.retail_value)}
            </div>
          </div>
        </div>
      </div>
      
      {/* product modal */}
      <Modal
        className="product-card-modal"
        centered={true}
        size="xl"
        isOpen={show}
        toggle={() => setShow(!show)}
      >
        <ModalHeader toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody>
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
                <div className="title">{product.attributes.brand}</div>
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
                      className={`order-btn ${subscription && "active"}`}
                      onClick={() => setSubscription(true)}
                    >
                      <div className="order-btn-content">
                        <Image src={orderImg} />
                        <div className="order-info">
                          <div className="volume">8 ml</div>
                          <div className="type">
                            Subscription{" "}
                            <b>
                              RON {subscriptionPrice(product.attributes.retail_value)}
                            </b>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  <div className="order">
                    <Button
                      className={`order-btn ${!subscription && "active"}`}
                      onClick={() => setSubscription(false)}
                    >
                      <div className="order-btn-content">
                        <Image src={orderImg} />
                        <div className="order-info">
                          <div className="volume">8 ml</div>
                          <div className="type">
                            One time{" "}
                            <b>RON {simplePrice(product.attributes.retail_value)}</b>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
                <div
                  className="submit-btn"
                  onClick={() => {
                    let paymentType;
                    // check if logged in
                    if (!auth) {
                      router.push("/account/login");
                    } else {
                      if (subscription) {
                        paymentType = "subscription";
                        if (cartManager.subscriptionList().length >= 6) {
                          toast(
                            "Your subscription list hast more than 6 products!",
                            {
                              autoClose: 2000,
                            }
                          );
                          return;
                        }
                      } else {
                        paymentType = "otb";
                      }
                      cartManager.addProduct(product, 1, paymentType);
                      notify();
                    }
                    // setLoading(true);
                  }}
                >
                  <div className="button-second">Add to queue</div>
                </div>
                <div className="fragrance-info">
                  <div className="title">About the fragrance</div>
                  <div className="info">
                    {product.attributes.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Product;
