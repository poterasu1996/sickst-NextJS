import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import Rating from "react-rating";
import { Star } from "react-feather";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

const ProductCardReview = () => {
    return(<>
        <div className="reviews-section--title">Reviews</div>
        <div className="reviews-section--card">
            <div className="rating">3.5</div>
            <div className="stars">
                <Rating 
                    fractions={2}
                    initialRating={4}
                    readonly={true}
                    emptySymbol={<Star size={20} fill="#babfc7" stroke="#babfc7" />}
                    fullSymbol={<Star size={20} fill="#cc3633" stroke="#cc3633" />}
                />
                <span className="total-ratings">28 ratings</span>
            </div>
            <Divider layout="vertical" />
            <div className="rating-list">
                <div className="rating-counter">
                    <Rating 
                        initialRating={5}
                        readonly={true}
                        fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                        emptySymbol={<Star size={15} fill="#999" stroke="#999" />}
                    />
                    <ProgressBar 
                        className="custom-rating-progressbar"
                        value={70} 
                        showValue={false}
                        color={'#999'}
                    />
                    70
                </div>
                <div className="rating-counter">
                    <Rating 
                        initialRating={4}
                        readonly={true}
                        fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                        emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                    />
                    <ProgressBar 
                        className="custom-rating-progressbar"
                        value={30} 
                        showValue={false}
                        color={'#999'}
                    />
                    30
                </div>
                <div className="rating-counter">
                    <Rating 
                        initialRating={3}
                        readonly={true}
                        fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                        emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                    />
                    <ProgressBar 
                        className="custom-rating-progressbar"
                        value={20} 
                        showValue={false}
                        color={'#999'}
                    />
                    20
                </div>
                <div className="rating-counter">
                    <Rating 
                        initialRating={2}
                        readonly={true}
                        fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                        emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                    />
                    <ProgressBar 
                        className="custom-rating-progressbar"
                        value={10} 
                        showValue={false}
                        color={'#999'}
                    />
                    10
                </div>
                <div className="rating-counter">
                    <Rating 
                        initialRating={1}
                        readonly={true}
                        fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                        emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                    />
                    <ProgressBar 
                        className="custom-rating-progressbar"
                        value={5} 
                        showValue={false}
                        color={'#999'}
                    />
                    5
                </div>
            </div>
            <div className="review-button">
                <button className="button-second">Write a review</button>
            </div>
        </div>
    </>);
}

export default ProductCardReview;