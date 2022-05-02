import ProductDetailsSection from "../../components/ProductPage/ProductDetailsSection";
import img from "../../public/img/versace-eros.jpg";
import Slider from "react-slick";
import Head from "next/head";


const ProductDetails = () => {
    const product = {
        image: img,
        brand: "Paco Rabanne",
        model: "Invictus",
        type: "Eau de toilette",
        price: "120",
        description: "Long product description",
    };

    const slickSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1
    } 

    return <>
        <Head>
            <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        </Head>

        <div className="product-details-content" >
            <ProductDetailsSection product = {product} />
            <div className="slider">
                <div className="container">
                    <Slider {...slickSettings}>
                        <div className="item">
                            <img src={img.src}></img>
                        </div>
                        <div className="item">
                            <img src={img.src}></img>
                        </div>
                        <div className="item">
                            <img src={img.src}></img>
                        </div>
                        <div className="item">
                            <img src={img.src}></img>
                        </div>
                        <div className="item">
                            <img src={img.src}></img>
                        </div>
                        <div className="item">
                            <img src={img.src}></img>
                        </div>
                        <div className="item">
                            <img src={img.src}></img>
                        </div>
                    </Slider>
                </div>
            </div>
        </div>
    </> 
}

export default ProductDetails; 