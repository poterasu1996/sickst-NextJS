import { useState, useEffect } from 'react';
import { Star } from "react-feather";
import Rating from "react-rating";
import img from '../../public/img/creed-aventus.jpg';
import ProductResponse from "../../types/shop/ProductResponse.interface";
import IProduct from '../../types/Product.interface';

type Props = {
    topProducts: IProduct[]
}

// type Product = {
//     id: number,
//     attributes: IProduct
// }

const TopRatedProducts = ({ topProducts }: Props) => {
    const [cardPair, setCardPair] = useState<IProduct[][]>();
    console.log('topRated ', topProducts)
    

    useEffect(() => {
        const pairedProducts = [];
        for(let i = 0; i < topProducts.length; i+=2) {
            pairedProducts.push([topProducts[i], topProducts[i + 1]]);
        }

        setCardPair([...pairedProducts])
        // console.log('PAIRED ', pairedProducts)
    }, [])

    console.log(cardPair)

    return(<>
        <div className="container top-rated-products">
            <div className="top-rated-products--header">Top rated products</div>
            <div className="top-rated-products--content custom-sb custom-sb-x">
                {/* double product card */}
                {cardPair && cardPair.map((pair: IProduct[]) => {
                    return (<>
                        <div className="top-rated-card">
                            <div className="product">
                                <div className="product--img-wrapper">
                                    <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}${pair[0].attributes.image.data[0].attributes.url}`}/>
                                </div>
                                <div className="product--details">
                                    <div className="name">{pair[0].attributes.brand}</div>
                                    <div className="model">{pair[0].attributes.model}</div>
                                    <Rating
                                        fractions={2}
                                        initialRating={pair[0].attributes.rating}
                                        readonly={true}
                                        emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                                        fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                                    />
                                </div>
                                <div className="product-button">
                                    <button className="btn product-btn">Detalii</button>
                                </div>
                            </div>
                            {pair[1] && <div className="product">
                                <div className="product--img-wrapper">
                                    <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}${pair[1]?.attributes?.image?.data[0]?.attributes.url}`}/>
                                </div>
                                <div className="product--details">
                                    <div className="name">{pair[1].attributes.brand}</div>
                                    <div className="model">{pair[1].attributes.model}</div>
                                    <Rating
                                        fractions={2}
                                        initialRating={pair[1].attributes.rating}
                                        readonly={true}
                                        emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                                        fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                                    />
                                </div>
                                <div className="product-button">
                                    <button className="btn product-btn">Detalii</button>
                                </div>
                            </div>}
                        </div>
                    </>)
                })}
            </div>
        </div>
    </>)
}

export default TopRatedProducts;