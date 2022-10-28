import { Star } from "react-feather";
import Rating from "react-rating";
import img from '../../public/img/creed-aventus.jpg';

const TopRatedProducts = () => {
    return(<>
        <div className="container top-rated-products">
            <div className="top-rated-products--header">Top rated products</div>
            <div className="top-rated-products--content">
                <div className="top-rated-card">
                    <div className="product">
                        <div className="product--img-wrapper">
                            <img src={img.src}/>
                        </div>
                        <div className="product--details">
                            <div className="name">Creed</div>
                            <div className="model">The one</div>
                            <Rating
                                fractions={2}
                                initialRating={4.3}
                                readonly={true}
                                emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                                fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                            />
                        </div>
                        <div className="product-button">
                            <button className="btn product-btn">Add</button>
                        </div>
                    </div>
                    <div className="product">
                        <div className="product--img-wrapper">
                            <img src={img.src}/>
                        </div>
                        <div className="product--details">
                            <div className="name">Creed</div>
                            <div className="model">The one</div>
                            <Rating
                                fractions={2}
                                initialRating={4.3}
                                readonly={true}
                                emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                                fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                            />
                        </div>
                        <div className="product-button">
                            <button className="btn product-btn">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default TopRatedProducts;