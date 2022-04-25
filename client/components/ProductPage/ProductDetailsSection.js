import { Button } from "react-bootstrap";
import { Star } from "react-feather";
import Rating from "react-rating";
import orderImg from '../../public/img/order-img.png'
import Link from "next/link";

const ProductDetailsSection = ({ product }) => {
    return <>
        <div className="product container">
            <div className="product-image">
                <img src={product.image.src}></img>
            </div>
            <div className="product-details">
                <div className="title">{product.brand}</div>
                <div className="model">{product.model}</div>
                <div className="price-wrapper d-flex justify-content-between">
                    <div className="type">{product.type}</div>
                    <div className="retail"><b className="brand-color">RON {product.price}</b> Retail value</div>
                </div>
                <div className="rating">
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
                        <Button className="order-btn active">
                            <div className="order-btn-content">
                                <img src={orderImg.src}/>
                                <div className="order-info">
                                    <div className="volume">8 ml</div>
                                    <div className="type">Subscription <b>RON 60</b></div>
                                </div>
                            </div>
                        </Button>
                    </div>
                    <div className="order">
                        <Button className="order-btn">
                            <div className="order-btn-content">
                                <img src={orderImg.src}/>
                                <div className="order-info">
                                    <div className="volume">8 ml</div>
                                    <div className="type">Subscription <b>RON 60</b></div>
                                </div>
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="submit-btn">
                    <Link href="/">
                        <a className="button-second">Add to queue</a>
                    </Link>
                </div>
                <div className="fragrance-info">
                    <div className="title">About the fragrance</div>
                    <div className="info">{product.description}</div>
                </div>
            </div>
        </div>
    </>
}

export default ProductDetailsSection;