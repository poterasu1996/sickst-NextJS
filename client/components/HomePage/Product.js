import { useState } from "react"
import Rating from 'react-rating'
import { Star } from 'react-feather'
import Image from "next/image";
import { Button } from "react-bootstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import orderImg from '../../public/img/order-img.png'
import Link from "next/link";

const Product = ({image, brand, model, type, price}) => {
    const [show, setShow] = useState(false);
    const description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur esse quia officia, inventore rerum reprehenderit sed placeat excepturi perspiciatis natus laboriosam quibusdam unde? Consequuntur esse quia officia, inventore rerum reprehenderit sed placeat excepturi perspiciatis natus laboriosam quibusdam unde?'

    return <div className="col-6 col-lg-4">
        <div className="product-card">
            <div className="product-card-image">
                <div className="product-card-image-wrapper">
                    <Image src={image}/>
                </div>
                <span className="tag black">Exclussive</span>
            </div>
            <div className="product-card-rating">
                <Rating 
                    fractions={2}
                    initialRating={3}
                    readonly={true}
                    emptySymbol={<Star size={15} fill='#babfc7' stroke='#babfc7' />}
                    fullSymbol={<Star size={15} fill='#cc3633' stroke='#cc3633'/>}
                />
            </div>
            <div className="product-card-title">
                <span className="brand">{brand}</span>
                <span className="model">{model}</span>
            </div>
            <div className="product-card-fragrance">Fragrance elements</div>
            <div className="product-card-description">
                {description.substring(0, 200) + '...'}
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
                            <div className="col-6">
                                <div className="img-wrapper">
                                    <Image src={image}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="product-details">
                                    <div className="title">{brand}</div>
                                    <div className="model">{model}</div>
                                    <div className="price-wrapper d-flex justify-content-between">
                                        <div className="type">{type}</div>
                                        <div className="retail"><b className="brand-color">RON {price}</b> Retail value</div>
                                    </div>
                                    <div className="rating">
                                        <Rating 
                                            fractions={2}
                                            initialRating={3}
                                            readonly={true}
                                            emptySymbol={<Star size={15} fill='#babfc7' stroke='#babfc7' />}
                                            fullSymbol={<Star size={15} fill='#cc3633' stroke='#cc3633'/>}
                                        />
                                        <div className="rating-nr">35 ratings</div>
                                    </div>
                                    <div className="order-type">
                                        <div className="order">
                                            <Button className="order-btn active">
                                                <div className="order-btn-content">
                                                    <Image src={orderImg}/>
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
                                                    <Image src={orderImg}/>
                                                    <div className="order-info">
                                                        <div className="volume">8 ml</div>
                                                        <div className="type">One time <b>RON 80</b></div>
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
                                        <div className="info">{description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div className="product-card-button">
                <div>
                    <a className="card-button" href="#">Add to cart</a>
                </div>
                <div>
                    <span className="price">RON: {price}</span>
                </div>
            </div>
        </div>
    </div>
}

export default Product;