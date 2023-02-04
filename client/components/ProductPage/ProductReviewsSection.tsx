import { useState } from "react";
import { Star } from "react-feather";
import Rating from "react-rating";
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import ProductCardReview from "./ProductCardReview";

const ProductReviewsSection = () => {
    const [selectedStarValue, setSelectedStarValue] = useState(null);

    const starsOptions = [
        { name: 'Toate', code: 0},
        { name: '5 stars', code: 5},
        { name: '4 stars', code: 4},
        { name: '3 stars', code: 3},
        { name: '2 stars', code: 2},
        { name: '1 stars', code: 1}
    ];
    
    const onStarChange = (e: any) => {
        setSelectedStarValue(e.value);
    }

    return(<>
        <div className="reviews-section">
            <ProductCardReview />
            <div className="reviews-section--filter">
                <div className="title">Filter reviews</div>
                <div className="dd-filters">

                    <Dropdown 
                        className="custom-filter-dd"
                        value={selectedStarValue} 
                        options={starsOptions} 
                        onChange={onStarChange} 
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
                    <div className="review">
                        <div className="review--user">
                            <div className="user">
                                <div className="avatar avatar-gradient-1">tc</div>
                                <div className="name">Taylor C.</div>
                            </div>
                            <div className="user-details">
                                <div className="c1">
                                    <div className="d-flex"><span>Reviews</span>15</div>
                                    <div className="d-flex"><span>Up votes</span>0</div>
                                </div>
                                <div className="c2">
                                    <div><span>Down votes</span>0</div>
                                    <div><span>Products received</span>10</div>
                                </div>
                            </div>
                        </div>
                        <div className="review--details">
                            <div className="rating-wrapper">
                                <Rating 
                                    fractions={2}
                                    initialRating={4}
                                    readonly={true}
                                    emptySymbol={<Star size={18} fill="#babfc7" stroke="#babfc7" />}
                                    fullSymbol={<Star size={18} fill="#cc3633" stroke="#cc3633" />}
                                />
                                <div className="date">04/19/2022</div>
                            </div>
                            <div className="subject">Want to smell like a literature professor?</div>
                            <div className="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                Perspiciatis, sed odit. Fugiat consequuntur architecto cumque tempora assumenda pariatur quos officiis 
                                totam soluta sequi rerum, incidunt veritatis eos. Magnam eaque explicabo cum eos facere ipsum ullam 
                                sint praesentium modi, porro cupiditate minus. Laboriosam neque obcaecati delectus sed, esse nisi animi placeat.
                            </div>
                            <div className="like-buttons">
                                <i className="pi pi-thumbs-up-fill" style={{'fontSize': '1.8rem'}}>0</i>
                                <i className="pi pi-thumbs-down-fill" style={{'fontSize': '1.8rem'}}>0</i>
                            </div>
                        </div>
                    </div>
                    <div className="review">
                        <div className="review--user">
                            <div className="user">
                                <div className="avatar avatar-gradient-7">tc</div>
                                <div className="name">Taylor C.</div>
                            </div>
                            <div className="user-details">
                                <div className="c1">
                                    <div className="d-flex"><span>Reviews</span>15</div>
                                    <div className="d-flex"><span>Up votes</span>0</div>
                                </div>
                                <div className="c2">
                                    <div><span>Down votes</span>0</div>
                                    <div><span>Products received</span>10</div>
                                </div>
                            </div>
                        </div>
                        <div className="review--details">
                            <div className="rating-wrapper">
                                <Rating 
                                    fractions={2}
                                    initialRating={4}
                                    readonly={true}
                                    emptySymbol={<Star size={18} fill="#babfc7" stroke="#babfc7" />}
                                    fullSymbol={<Star size={18} fill="#cc3633" stroke="#cc3633" />}
                                />
                                <div className="date">04/19/2022</div>
                            </div>
                            <div className="subject">Want to smell like a literature professor?</div>
                            <div className="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                Perspiciatis, sed odit. Fugiat consequuntur architecto cumque tempora assumenda pariatur quos officiis 
                                totam soluta sequi rerum, incidunt veritatis eos. Magnam eaque explicabo cum eos facere ipsum ullam 
                                sint praesentium modi, porro cupiditate minus. Laboriosam neque obcaecati delectus sed, esse nisi animi placeat.
                            </div>
                            <div className="like-buttons">
                                <i className="pi pi-thumbs-up-fill" style={{'fontSize': '1.8rem'}}>0</i>
                                <i className="pi pi-thumbs-down-fill" style={{'fontSize': '1.8rem'}}>0</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default ProductReviewsSection;