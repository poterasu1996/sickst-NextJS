import ProductDetailsSection from "../../components/ProductPage/ProductDetailsSection";
import img from "../../public/img/versace-eros.jpg";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import axios from "../../api/axios";
import { Spinner } from "react-bootstrap";
const PRODUCTS_URL = "/products";

const ProductDetails = () => {
    const router = useRouter();
    const {asPath, pathname, query, isReady} = useRouter();
    const [product, setProduct] = useState();
    const [error, setError] = useState(false);
    const [loading, setloading] = useState(true);

    const slickSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1
    } 

    function extractProductId(path) {
        const [productId] = path.split("/").slice(-1);
        return productId
    }

    
    useEffect(() => {
        if(isReady) {
            const prodId = extractProductId(asPath);
            // fetch product details
            const fetchProduct = async() => {
                await axios.get(`${PRODUCTS_URL}/${prodId}?populate=*`).then(resp => {
                    setProduct(resp.data.data);
                    setloading(preVal => !preVal);
                }, (error) => {
                    setloading(preVal => !preVal);
                    setError(preVal => !preVal);
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                })
            }

            fetchProduct();
        }
    }, [isReady])

    return <>
        <div className="product-details-content" >

            {error && <div className="no-product">
                Oops! Sorry, but the product you are searching <br /> for does not exist!
            </div>}

            {loading && <div className="loader">
                <Spinner animation="grow" style={{color: "#cc3633"}}/>
                <span>Fetching product data</span>
            </div>}

            {product && <>
                <ProductDetailsSection product = {product.attributes} />
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
            </>}

        </div>
    </> 
}

export default ProductDetails; 