import { useEffect, useState } from "react";
import { Star } from "react-feather";
import Rating from "react-rating";
import img from '../../public/img/creed-aventus.jpg';
import Link from "next/link";
import axios from '../../api/axios';

const PRODUCTS_URL = "/products?populate=*";

type Props = {
    newProducts: Product[]
}

type Product = {
    id: number,
    attributes: any
}

const NewProductSection = ({ newProducts }: Props) => {

    return(<>
        <div className="container new-product-section">
            <div className="new-product-section--header">
                <div className="title">New fine fragrances</div>
                {/* <div className="view-all">View all &gt;</div> */}
            </div>
            <div className="new-product-section--content">
                {newProducts && newProducts.map(product => (
                    <Link href={`../product/${product.id}`} key={product.id}>
                        <div className="new-product">
                            <div className="new-product--img-wrapper">
                                <img src={
                                    `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
                                    product.attributes.image.data[0].attributes.url
                                }/>
                            </div>
                            <div className="new-product--details">
                                <Rating
                                    fractions={2}
                                    initialRating={product.attributes.rating}
                                    readonly={true}
                                    emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                                    fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                                />
                                <div className="name">{product.attributes.brand}</div>
                                <div className="model">{product.attributes.model}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </>);
}

export default NewProductSection;