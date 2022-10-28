import { Star } from "react-feather";
import Rating from "react-rating";
import img from '../../public/img/creed-aventus.jpg';

const NewProductSection = () => {
    return(<>
        <div className="container new-product-section">
            <div className="new-product-section--header">
                <div className="title">New fine fragrances</div>
                <div className="view-all">View all &gt;</div>
            </div>
            <div className="new-product-section--content">
                <div className="new-product">
                    <div className="new-product--img-wrapper">
                        <img src={img.src}/>
                    </div>
                    <div className="new-product--details">
                        <Rating
                            fractions={2}
                            initialRating={4.3}
                            readonly={true}
                            emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <div className="name">Creed</div>
                        <div className="model">Aventuous</div>
                    </div>
                </div>
                <div className="new-product">
                    <div className="new-product--img-wrapper">
                        <img src={img.src}/>
                    </div>
                    <div className="new-product--details">
                        <Rating
                            fractions={2}
                            initialRating={4.3}
                            readonly={true}
                            emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <div className="name">Sue Phillips - Artisan Scent</div>
                        <div className="model">eau de toilette</div>
                    </div>
                </div>
                <div className="new-product">
                    <div className="new-product--img-wrapper">
                        <img src={img.src}/>
                    </div>
                    <div className="new-product--details">
                        <Rating
                            fractions={2}
                            initialRating={4.3}
                            readonly={true}
                            emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <div className="name">rag & bone</div>
                        <div className="model">eau de toilette</div>
                    </div>
                </div>
                <div className="new-product">
                    <div className="new-product--img-wrapper">
                        <img src={img.src}/>
                    </div>
                    <div className="new-product--details">
                        <Rating
                            fractions={2}
                            initialRating={4.3}
                            readonly={true}
                            emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <div className="name">rag & bone</div>
                        <div className="model">eau de toilette</div>
                    </div>
                </div>
                <div className="new-product">
                    <div className="new-product--img-wrapper">
                        <img src={img.src}/>
                    </div>
                    <div className="new-product--details">
                        <Rating
                            fractions={2}
                            initialRating={4.3}
                            readonly={true}
                            emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <div className="name">rag & bone</div>
                        <div className="model">eau de toilette</div>
                    </div>
                </div>
                <div className="new-product">
                    <div className="new-product--img-wrapper">
                        <img src={img.src}/>
                    </div>
                    <div className="new-product--details">
                        <Rating
                            fractions={2}
                            initialRating={4.3}
                            readonly={true}
                            emptySymbol={<Star size={15} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={15} fill="#cc3633" stroke="#cc3633" />}
                        />
                        <div className="name">rag & bone</div>
                        <div className="model">eau de toilette</div>
                    </div>
                </div>

            </div>
        </div>
    </>);
}

export default NewProductSection;