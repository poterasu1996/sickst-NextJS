import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { Star } from "react-feather";
import Rating from "react-rating";
import { Dropdown } from 'primereact/dropdown';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.css';
// import 'primeicons/primeicons.css';
import ProductCardReview from "./ProductCardReview";
import { ReviewCount } from "../../types/product/ProductReviews.interface";
import RequestMeta from "../../types/Axios.interface";
import axios from "../../api/axios";
import { AppUtils } from "../../shared/utils/app.utils";
import noReview from "../../public/img/svg/no-reviews.svg";
import IProduct from "../../types/Product.interface";
import AccountContext from "../../store/account-context";
import { IGETProductReview } from "../../models/ProductReview.model";
import AuthContext from "../../store/auth-context";
import { useRouter } from "next/router";

type Props = {
    product: IProduct,
    productRating: ReviewCount | null
}

type AxiosProductReviewResponse = {
    data: IGETProductReview[],
    meta: RequestMeta
}


const ProductReviewsSection = ({ product, productRating }: Props) => {
    const [dateValue, setDateValue] = useState<string>('desc');
    const [selectedStarValue, setSelectedStarValue] = useState(0);
    const [reviews, setReviews] = useState<AxiosProductReviewResponse>();
    const [likedReviews, setLikedReviews] = useState<number[]>([]);
    const [dislikedReviews, setDislikedReviews] = useState<number[]>([]);
    const accountManager = useContext(AccountContext);
    const { isAuth } = useContext(AuthContext);
    const router = useRouter();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const dateOptions = [
        { name: 'Cele mai recente', value: 'desc'},
        { name: 'Cele mai vechi', value: 'asc'},
    ]

    const starsOptions = [
        { name: 'Toate', value: 0},
        { name: '5 stars', value: 5},
        { name: '4 stars', value: 4},
        { name: '3 stars', value: 3},
        { name: '2 stars', value: 2},
        { name: '1 stars', value: 1}
    ];
    
    const onDateChange = (e: any) => {
        setDateValue(e.value);
    }

    const onStarChange = (e: any) => {
        setSelectedStarValue(e.value);
    }

    useLayoutEffect(() => {
        window.scrollTo(scrollX, scrollY);
    });

    useEffect(() => {
        let queryUrl = `/product-reviews?populate=*&sort[0]=createdAt#3A${dateValue}`
        if (selectedStarValue > 0) {
            queryUrl = queryUrl + `&filters[rating][$eq]=${selectedStarValue}`
        }
        if (dateValue) {
            queryUrl = queryUrl + `&sort[0]=createdAt%3A${dateValue}`
        } 

        axios.get(queryUrl)
            .then((resp: any) => setReviews(resp.data))
    }, [selectedStarValue, dateValue, accountManager?.refresh]);

    useEffect(() => {
        let _likedReviews: number[] = [];
        let _dislikedReviews: number[] = [];
        reviews?.data.map((rev: IGETProductReview) => {
            if(rev.attributes.users_liked && rev.attributes.users_liked.find(uID => uID === accountManager?.userDetails?.id)) {
                _likedReviews.push(rev.id);
                console.log("_likedL", _likedReviews)
            }
            if(rev.attributes.users_disliked && rev.attributes.users_disliked.find(uID => uID === accountManager?.userDetails?.id)) {
                _dislikedReviews.push(rev.id);
            }
        })
        setLikedReviews([..._likedReviews]);
        setDislikedReviews([..._dislikedReviews]);
    }, [reviews, accountManager?.refresh])

    function handleLikeReviews(review: IGETProductReview) {
        if(!isAuth) {
            router.push('/account/login');
            return
        }
        accountManager!.likeReview(
            accountManager!.userDetails!.id, 
            review.id, 
            review.attributes.likes, 
            review.attributes.users_liked,
            review.attributes.dislikes,
            review.attributes.users_disliked
        );
    }

    function handleDislikeReviews(review: IGETProductReview) {
        if(!isAuth) {
            router.push('/account/login');
            return
        }
        accountManager!.dislikeReview(
            accountManager!.userDetails!.id, 
            review.id, 
            review.attributes.likes, 
            review.attributes.users_liked,
            review.attributes.dislikes,
            review.attributes.users_disliked
        );
    }

    function handleActiveLikes(revId: number) {
        if(likedReviews.find(lr => lr === revId)) {
            return 'active'
        } else {
            return ''
        }
    }

    function handleActiveDislikes(revId: number) {
        if(dislikedReviews.find(dr => dr === revId)) {
            return 'active';
        } else {
            return '';
        }
    }
    
    return(<>
        <div className="reviews-section">
            {(productRating && reviews) && <ProductCardReview product={product} reviewList={reviews.data} productRating={productRating} />}

            {(reviews) && <div className="reviews-section--filter">
                <div className="title">Filter reviews</div>
                <div className="dd-filters">
                    <Dropdown 
                        className="custom-filter-dd"
                        value={dateValue} 
                        options={dateOptions} 
                        onChange={onDateChange} 
                        optionLabel="name" 
                        placeholder="Recente" 
                    />
                    <Dropdown 
                        className="custom-filter-dd"
                        value={selectedStarValue} 
                        options={starsOptions} 
                        onChange={onStarChange} 
                        optionLabel="name" 
                        placeholder="All rating" 
                    />
                </div>

                <div className="review-list">
                    {reviews.data.length === 0 && <div className="review--user">
                        <div className="text-center">
                            <img className="no-review-img" src={noReview.src} />
                            <h4 className="h1 strong mt-4">0 rezultate...</h4>
                            <p>Filtrele aplicate nu au generat niciun rezultat.</p>
                        </div>
                    </div>}
                    {reviews.data.map((review: IGETProductReview) => (<div className="review" key={review.id}>
                            <div className="review--user">
                                <div className="user">
                                    <div className={`avatar avatar-gradient-${AppUtils.random7()}`}>
                                        {AppUtils.userFullNameInitials(
                                            review.attributes.user_profile_detail.data.attributes.first_name, 
                                            review.attributes.user_profile_detail.data.attributes.last_name)}
                                    </div>
                                    <div className="name">
                                        {review.attributes.user_profile_detail.data.attributes.first_name+" "
                                        +AppUtils.firstInitial(review.attributes.user_profile_detail.data.attributes.last_name)}
                                    </div>
                                </div>
                                <div className="user-details">
                                    <div className="c1">
                                        <div className="d-flex"><span>Reviews</span>{review.attributes.user_profile_detail.data.attributes.reviews}</div>
                                        <div><span>Products received</span>{review.attributes.user_profile_detail.data.attributes.products_received}</div>
                                    </div>

                                    <div className="c2">
                                        <div className="d-flex"><span>Up votes</span>0</div>
                                        <div><span>Down votes</span>0</div>
                                    </div>
                                </div>
                            </div>
                            <div className="review--details">
                                <div className="rating-wrapper">

                                    {/* @ts-ignore */}
                                    <Rating 
                                        fractions={1}
                                        initialRating={review.attributes.rating}
                                        readonly={true}
                                        emptySymbol={<Star size={18} fill="#babfc7" stroke="#babfc7" />}
                                        fullSymbol={<Star size={18} fill="#cc3633" stroke="#cc3633" />}
                                    />
                                    <div className="date">{AppUtils.isoToFormat(review.attributes.updatedAt)}</div>
                                </div>
                                <div className="subject">{review.attributes.title_review}</div>
                                <div className="text">{review.attributes.review}</div>
                                <div className="appreciate-review">
                                    <button onClick={() => handleLikeReviews(review)}>
                                        <i className={`pi pi-thumbs-up-fill ${handleActiveLikes(review.id)}`} style={{'fontSize': '1.8rem'}}>{review.attributes.likes}</i>
                                    </button>
                                    <button onClick={() => handleDislikeReviews(review)}>
                                        <i className={`pi pi-thumbs-down-fill ${handleActiveDislikes(review.id)}`} style={{'fontSize': '1.8rem'}}>{review.attributes.dislikes}</i>
                                    </button>
                                </div>
                            </div>
                        </div>)
                    )}
                    
                </div>
                
            </div>}

        </div>
    </>)
}

export default ProductReviewsSection;