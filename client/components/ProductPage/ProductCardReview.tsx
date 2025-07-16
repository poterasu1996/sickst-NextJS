import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import Rating from "react-rating";
import { Star } from "react-feather";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { ReviewCount } from '../../types/product/ProductReviews.interface';
import { useContext, useState } from 'react';
import SickstModal from '../global/SickstModal';
import ReviewForm from './ReviewForm';
import AuthContext from '../../store/auth-context';
import { useRouter } from 'next/router';
import { IGETProductReview } from '../../models/ProductReview.model';
import IProduct from '../../types/product';

type Props = {
    product: IProduct,
    reviewList: IGETProductReview[];
    productRating: ReviewCount
}

const ProductCardReview = ({ product, reviewList, productRating }: Props) => {
    const [reviewModal, setReviewModal] = useState<boolean>(false);
    const { isAuth } = useContext(AuthContext);
    const router = useRouter();

    function starsProcentage(total: number, sliceNr: number) {
        return (100 * sliceNr) / total;
    }

    function handleShowReviewModal() {
        if(!isAuth) {
            router.push('/account/login')
        } else {
            setReviewModal(!reviewModal);
        }
    }

    return(<>
        <div className="reviews-section--title">Reviews</div>
        <div className="reviews-section--card">
            {
                productRating.total_reviews > 0
            ? <>
                <div className='left'>
                    <div className="rating">{productRating.medium_rate.toFixed(1)}</div>
                    <div className="stars">
                        {/* @ts-ignore */}
                        <Rating 
                            fractions={2}
                            initialRating={productRating.medium_rate}
                            readonly={true}
                            emptySymbol={<Star size={20} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={20} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <span className="total-ratings">{productRating.total_reviews} ratings</span>
                    </div>
                </div>
                <Divider layout="vertical" />
                <div className='right'>
                    <div className="rating-list">
                        <div className="rating-counter">
                            {/* @ts-ignore */}
                            <Rating 
                                initialRating={5}
                                readonly={true}
                                fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                                emptySymbol={<Star size={15} fill="#999" stroke="#999" />}
                            />
                            <ProgressBar 
                                className="custom-rating-progressbar"
                                value={starsProcentage(productRating.total_reviews, productRating.five_star)} 
                                showValue={false}
                                color={'#999'}
                            />
                            {productRating.five_star}
                        </div>
                        <div className="rating-counter">
                            {/* @ts-ignore */}
                            <Rating 
                                initialRating={4}
                                readonly={true}
                                fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                                emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                            />
                            <ProgressBar 
                                className="custom-rating-progressbar"
                                value={starsProcentage(productRating.total_reviews, productRating.four_star)} 
                                showValue={false}
                                color={'#999'}
                            />
                            {productRating.four_star}
                        </div>
                        <div className="rating-counter">
                            {/* @ts-ignore */}
                            <Rating 
                                initialRating={3}
                                readonly={true}
                                fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                                emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                            />
                            <ProgressBar 
                                className="custom-rating-progressbar"
                                value={starsProcentage(productRating.total_reviews, productRating.three_star)} 
                                showValue={false}
                                color={'#999'}
                            />
                            {productRating.three_star}
                        </div>
                        <div className="rating-counter">
                            {/* @ts-ignore */}
                            <Rating 
                                initialRating={2}
                                readonly={true}
                                fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                                emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                            />
                            <ProgressBar 
                                className="custom-rating-progressbar"
                                value={starsProcentage(productRating.total_reviews, productRating.two_star)} 
                                showValue={false}
                                color={'#999'}
                            />
                            {productRating.two_star}
                        </div>
                        <div className="rating-counter">
                            {/* @ts-ignore */}
                            <Rating 
                                initialRating={1}
                                readonly={true}
                                fullSymbol={<Star size={15} fill="#999" stroke="#999" />}
                                emptySymbol={<Star size={15} fill="#dee2e6" stroke="#dee2e6" />}
                            />
                            <ProgressBar 
                                className="custom-rating-progressbar"
                                value={starsProcentage(productRating.total_reviews, productRating.one_star)} 
                                showValue={false}
                                color={'#999'}
                            />
                            {productRating.one_star}
                        </div>
                    </div>
                    <div className="review-button">
                        <button className="button-second" onClick={handleShowReviewModal}>Write a review</button>
                    </div>
                </div>
            </>
            : <>
                <div className='left no-rating'>
                    <p className="title">Fii primul care scrie un review </p>
                    <div className="subtitle">Spune-ti parerea acordand o nota produsului</div>
                </div>
                <Divider layout="vertical" />
                <div className='right no-rating'>
                    <div className="stars">
                        {/* @ts-ignore */}
                        <Rating 
                            fractions={1}
                            initialRating={0}
                            readonly={false}
                            emptySymbol={<Star size={20} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={20} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <span className="total-ratings">Acorda o nota</span>
                    </div>
                    <div className="review-button">
                        <button className="button-second" onClick={handleShowReviewModal}>Write a review</button>
                    </div>
                </div>
            </>
            }
        </div>

        <SickstModal show={reviewModal} setShow={handleShowReviewModal} headerTitle="Adauga un review" footer={true}>
            <ReviewForm product={product} setShow={handleShowReviewModal}/>
        </SickstModal>
    </>);
}

export default ProductCardReview;