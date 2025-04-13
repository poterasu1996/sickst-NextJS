import { useState, useEffect } from 'react';
import { Star } from "react-feather";
import Rating from "react-rating";
import Link from 'next/link';
import IProduct from '../../../types/product';

type Props = {
    topProducts: IProduct[]
}

const TopRatedProducts = ({ topProducts }: Props) => {
    const [cardPair, setCardPair] = useState<IProduct[][]>();

    useEffect(() => {
        const pairedProducts = [];
        for(let i = 0; i < topProducts.length; i+=2) {
            pairedProducts.push([topProducts[i], topProducts[i + 1]]);
        }
        setCardPair([...pairedProducts])
    }, [])

    return(<>
        <div className="container top-rated-products">
            <div className="top-rated-products--header">Top rated products</div>
            <div className="top-rated-products--content custom-sb custom-sb-x">
                {/* double product card */}
                {cardPair && cardPair.map((pair: IProduct[], index: number) => (
                    <div className="top-rated-card" key={index}>
                        <div className="product">
                            <div className="product--img-wrapper">
                                <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}${pair[0].attributes.image.data[0].attributes.url}`}/>
                            </div>
                            <div className="product--details">
                                <div className="name">{pair[0].attributes.brand}</div>
                                <div className="model">{pair[0].attributes.model}</div>
                                {/* @ts-ignore */}
                                <Rating
                                    fractions={2}
                                    initialRating={pair[0].attributes.rating}
                                    readonly={true}
                                    emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                                    fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                                />
                            </div>
                            <div className="product-button">
                                <Link href={`../product/${pair[0].id}`}>
                                    <a className='btn product-btn'>Detalii</a>
                                </Link>
                            </div>
                        </div>
                        {pair[1] && <div className="product">
                            <div className="product--img-wrapper">
                                <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}${pair[1]?.attributes?.image?.data[0]?.attributes.url}`}/>
                            </div>
                            <div className="product--details">
                                <div className="name">{pair[1].attributes.brand}</div>
                                <div className="model">{pair[1].attributes.model}</div>
                                {/* @ts-ignore */}
                                <Rating
                                    fractions={2}
                                    initialRating={pair[1].attributes.rating}
                                    readonly={true}
                                    emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                                    fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                                />
                            </div>
                            <div className="product-button">
                                <Link href={`../product/${pair[1].id}`}>
                                    <a className='btn product-btn'>Detalii</a>
                                </Link>
                            </div>
                        </div>}
                    </div>
                ))
            }
            </div>
        </div>
    </>)
}

export default TopRatedProducts;