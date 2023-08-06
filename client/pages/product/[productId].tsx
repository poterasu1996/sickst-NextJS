import ProductDetailsSection from "../../components/ProductPage/ProductDetailsSection";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";

import axios from "../../api/axios";
import { Spinner } from "react-bootstrap";
import ProductReviewsSection from "../../components/ProductPage/ProductReviewsSection";
import IProduct from "../../types/Product.interface";
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { ReviewCount } from "../../types/product/ProductReviews.interface";
import RequestMeta from "../../types/Axios.interface";
import AccountContext from "../../store/account-context";
import { IGETProductReview } from "../../models/ProductReview.model";
const PRODUCTS_URL = "/products";

interface Props {
    productRating: ReviewCount | null,
}

type AxiosProductReviewResponse = {
    data: IGETProductReview[],
    meta: RequestMeta
}

const ProductDetails = ({ productRating }: Props) => {
    const router = useRouter();
    const {asPath, pathname, query, isReady} = useRouter();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [loading, setloading] = useState<boolean>(true);
    const accountManager = useContext(AccountContext);

    function extractProductId(path: string) {
        const [productId] = path.split("/").slice(-1);
        return productId
    }
    
    function refreshProps() {
        router.replace(router.asPath);
    }

    useEffect(() => {
        // refresh page after a new review has been added
        refreshProps();
    }, [accountManager?.refresh]);

    useEffect(() => {
        if(isReady) {
            const prodId = extractProductId(asPath);
            // fetch product details
            const fetchProduct = async () => {
                await axios.get(`${PRODUCTS_URL}/${prodId}?populate=*`)
                .then(resp => {
                    setProduct(resp.data.data);
                })
                .catch(error => {
                    setError(preVal => !preVal);
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                })
            }

            fetchProduct();
        }
    }, [isReady])

    useEffect(() => {
        if (product || error)  setloading(false);
    }, [product])

    return <>
        <div className="layout product-details-content">

            {error && <div className="no-product">
                Oops! Sorry, but the product you are searching <br /> for does not exist!
            </div>}

            {loading && <div className="loader">
                <Spinner animation="grow" style={{color: "#cc3633"}}/>
                <span>Fetching product data</span>
            </div>}

            {product && <>
                <ProductDetailsSection product = {product} productRating={productRating} />
                <ProductReviewsSection product={product} productRating={productRating} />
            </>}

        </div>
    </> 
}

export default ProductDetails; 

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { params } = context;
    const id = params?.productId;

    let productRating: ReviewCount | null = null
    try {
        const revList: AxiosProductReviewResponse = await axios.get(`/product-reviews?filters[product_id][$eq]=${id}&sort[0]=updatedAt%3Adesc`)
            .then(resp => resp.data)
        
        const totalRev = revList.data.length;

        let prodRating = 0;
        revList.data.map((review: IGETProductReview) => {
            prodRating = prodRating + review.attributes?.rating;
        })
        if(totalRev > 0) {
            prodRating = prodRating / totalRev
        }

        let countFive = 0;
        let countFour = 0;
        let countThree = 0;
        let countTwo = 0;
        let countOne = 0;
        revList.data.map((review: IGETProductReview) => {
            review.attributes.rating === 5 && countFive++;
            review.attributes.rating === 4 && countFour++;
            review.attributes.rating === 3 && countThree++;
            review.attributes.rating === 2 && countTwo++;
            review.attributes.rating === 1 && countOne++;
        })

        productRating = {
            total_reviews: totalRev,
            medium_rate: prodRating,
            five_star: countFive,
            four_star: countFour,
            three_star: countThree,
            two_star: countTwo,
            one_star: countOne
        }
    } catch (error) {
        console.log(error)
    }

    return {
        props: {
            productRating
        }
    }
}