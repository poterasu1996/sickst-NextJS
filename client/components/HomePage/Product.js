import { useState, useContext } from "react";
import Rating from "react-rating";
import { Star, Check } from "react-feather";
import Image from "next/image";
import { Button, Spinner } from "react-bootstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import orderImg from "../../public/img/order-img.png";
import Link from "next/link";
import CartContext from "../../store/cart-context";

const SV_URL = "http://localhost:1337";

const Product = ({ product }) => {
  const [show, setShow] = useState(false);                  // for Read more modal
  const { cartManager } = useContext(CartContext);
  const [addedToCart, setAddedToCart] = useState(false);    // show the checkmark after added to cart
  const [loading, setLoading] = useState(false);            // used for loading animation

  setTimeout(() => {
    setLoading(false);  // to clear loading state
  }, 500);

  return (
    <div className="col col-sm-6 col-lg-4">
      <div className="product-card">
        <div className="product-card-image">
          <div className="product-card-image-wrapper">
            <img
              src={
                `${SV_URL}` + product.attributes.image.data[0].attributes.url
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
          {product.attributes.description && (product.attributes.description.substring(0, 195) + "...")}
          <Button onClick={() => setShow(!show)}>Read more</Button>
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
                        `${SV_URL}` +
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
                        <Button className="order-btn active">
                          <div className="order-btn-content">
                            <Image src={orderImg} />
                            <div className="order-info">
                              <div className="volume">8 ml</div>
                              <div className="type">
                                Subscription <b>RON {product.attributes.subscription_price}</b>
                              </div>
                            </div>
                          </div>
                        </Button>
                      </div>
                      <div className="order">
                        <Button className="order-btn">
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
                      <Link href="/register">
                        <a className="button-second">Add to queue</a>
                      </Link>
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
        </div>
        <div className="product-card-button">
          <div>
            {cartManager.hasProduct(product)
                ? loading 
                    ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                    : <div className="card-button disabled">
                        <div className="check">
                            <Check stroke={'#fff'} height={22} width={22} /> 
                        </div>
                        <span>Added</span>
                    </div>
                : <div className="card-button" onClick={() => {
                    setAddedToCart(true);
                    cartManager.addProduct(product, 1);
                    setLoading(true);
                }}>
                    <div className="plus"></div>Add to cart
                </div>
            }  
          </div>
          <div>
            <div className="price">RON: {product.attributes.retail_value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
