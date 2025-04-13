import { useContext, useEffect, useState } from "react";
import { Star } from "react-feather";
import Rating from "react-rating";
import orderImg from '../../public/img/order-img.png'
import AuthContext from "../../store/auth-context";
import { useRouter } from "next/router";
import axios from "../../api/axios";
import { ReviewCount } from "../../types/product/ProductReviews.interface";
import cartService from "../../shared/services/cartService";
import { AppUtils } from "../../shared/utils/app.utils";
import { PAYMENT_TYPE } from "../../shared/utils/constants";
import CartContext from "../../store/cart-context";
import { useCheckMysterySub } from "../../shared/hooks/useCheckMysterySub";
import IProduct from "../../types/product";

type Props = {
    product: IProduct,
    productRating: ReviewCount | null,
}

const ProductDetailsSection = ({ product, productRating }: Props) => {
    const { isAuth } = useContext(AuthContext);
    const [subscription, setSubscription] = useState(true);
    const router = useRouter();    
    // const cartManager = useContext(CartContext);
    const { isMystery } = useCheckMysterySub();
    
    const containerPrice = 50;  // price of container

    function simplePrice(price: any) {
        const mlPrice = price / 100;    // price per ml of product
    
        const productPrice = containerPrice + (8 * mlPrice);   // price of full product for OTB
        return productPrice;
    }

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

    function handleAddProduct() {
        let paymentType;
        if (!isAuth) {
            router.push("account/login");
        } else {
            if(subscription) {
                if(isMystery) {
                    AppUtils.toastNotification("You need to change subscription plan", false);
                    return;
                }
                paymentType = PAYMENT_TYPE.subscription;
                if(cartService.subscriptionList().length >= 6) {
                    AppUtils.toastNotification("", false, customToast6Products);
                    return;
                }
            } else {
                paymentType = PAYMENT_TYPE.oneTimeBuy;
            }
            cartService.addProduct(product, 1, paymentType);
            // cartManager.refreshContext();
            AppUtils.toastNotification("", true, customToastTemplate);
        }
    }

    return <>
        <div className="product container">
            <div className="product-image">
                <img 
                    src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + product.attributes.image.data[0].attributes.url} 
                />
            </div>
            <div className="product-details">
                <div className="product-wrapper">
                    <div className="product-wrapper--l">
                        <img 
                            src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + product.attributes.image.data[0].attributes.url} 
                        />
                    </div>
                    <div className="product-wrapper--r">
                        <div className="title">{product.attributes.brand}</div>
                        <div className="model">{product.attributes.model}</div>
                        <div className="price-wrapper justify-content-between">
                            <div className="type">{product.attributes.type}</div>
                            <div className="retail"><b className="brand-color">RON {product.attributes.retail_value}</b> Retail value</div>
                        </div>
                        <div className="rating">
                            {/* @ts-ignore */}
                            <Rating 
                                fractions={2}
                                initialRating={productRating?.medium_rate}
                                readonly={true}
                                emptySymbol={<Star size={18} fill="#babfc7" stroke="#babfc7" />}
                                fullSymbol={<Star size={18} fill="#cc3633" stroke="#cc3633" />}
                            />
                            <div className="rating-nr">{productRating?.total_reviews ?? 0} ratings</div>
                        </div>
                    </div>
                    
                </div>
                <div className="price-wrapper justify-content-between">
                    <div className="type">{product.attributes.type}</div>
                    <div className="retail"><b className="brand-color">RON {product.attributes.retail_value}</b> Retail value</div>
                </div>
                <div className="rating">
                    {/* @ts-ignore */}
                    <Rating 
                        fractions={2}
                        initialRating={productRating?.medium_rate}
                        readonly={true}
                        emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                        fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                    />
                    <div className="rating-nr">{productRating?.total_reviews ?? 0} ratings</div>
                </div>
                <div className="order-type">
                    <div className="order">
                        <button 
                            className={`order-btn ${subscription && "active"}`}
                            onClick={() => setSubscription(true)}
                        >
                            <div className="order-btn-content">
                                <img src={orderImg.src}/>
                                <div className="order-info">
                                    <div className="volume">8 ml</div>
                                    <div className="type">Requires{" "}<b>{product.attributes.subscription_type} plan</b></div>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className="order">
                        <button 
                            className={`order-btn ${!subscription && "active"}`}
                            onClick={() => setSubscription(false)}   
                        >
                            <div className="order-btn-content">
                                <img src={orderImg.src}/>
                                <div className="order-info">
                                    <div className="volume">8 ml</div>
                                    <div className="type">One time <b>RON {simplePrice(product.attributes.retail_value)}</b></div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                <button className="button-second" onClick={() => handleAddProduct()}>{subscription ? 'Add to queue' : 'Add to cart'}</button>
                <div className="fragrance-info">
                    <div className="title">About the fragrance</div>
                    <div className="info">{product.attributes.description}</div>
                </div>
            </div>
        </div>
    </>
}

export default ProductDetailsSection;
