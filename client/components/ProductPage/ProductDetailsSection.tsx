import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Star } from "react-feather";
import Rating from "react-rating";
import orderImg from '../../public/img/order-img.png'
import AuthContext from "../../store/auth-context";
import { useRouter } from "next/router";
import IProduct from "../../types/Product.interface";
import axios from "../../api/axios";
import { ReviewCount } from "../../types/product/ProductReviews.interface";

type Props = {
    product: IProduct,
    productRating: ReviewCount | null,
}

const ProductDetailsSection = ({ product, productRating }: Props) => {
    const authManager = useContext(AuthContext);
    const [subscription, setSubscription] = useState<boolean>(true);
    const router = useRouter();    
    
    const containerPrice = 50;  // price of container

    function simplePrice(price: any) {
        const mlPrice = price / 100;    // price per ml of product
    
        const productPrice = containerPrice + (8 * mlPrice);   // price of full product for OTB
        return productPrice;
    }

    function handleAddProduct() {
        if (!authManager.auth) {
            router.push("account/login");
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
                            <div className="rating-nr">{productRating?.total_reviews} ratings</div>
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
                        initialRating={4}
                        readonly={true}
                        emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                        fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
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
                                <img src={orderImg.src}/>
                                <div className="order-info">
                                    <div className="volume">8 ml</div>
                                    <div className="type">Requires{" "}<b>{product.attributes.subscription_type} plan</b></div>
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
                                <img src={orderImg.src}/>
                                <div className="order-info">
                                    <div className="volume">8 ml</div>
                                    <div className="type">Subscription <b>RON {simplePrice(product.attributes.retail_value)}</b></div>
                                </div>
                            </div>
                        </Button>
                    </div>
                </div>
                <button className="button-second" onClick={() => handleAddProduct()}>Add</button>
                <div className="fragrance-info">
                    <div className="title">About the fragrance</div>
                    <div className="info">{product.attributes.description}</div>
                </div>
            </div>
        </div>
    </>
}

export default ProductDetailsSection;
