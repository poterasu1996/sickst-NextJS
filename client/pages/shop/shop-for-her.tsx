import { useEffect, useState } from "react";
import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import ProductFilterSection from "../../components/ShopPage/ProductFilterSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";
import ProductResponse from "../../types/shop/ProductResponse.interface";
import productService from "../../shared/services/productService";
import { Spinner } from "react-bootstrap";

const ShopWoman = () => {
    const [womanProducts, setWomanProducts] = useState<ProductResponse>();
    const [newProducts, setNewProducts] = useState<ProductResponse>();
    const [topRatedProducts, setTopRatedProducts] = useState<ProductResponse>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        productService.getFemaleProducts().then((resp: ProductResponse) => {
            setWomanProducts(resp);
        });

        productService.getNewFemaleProducts().then((resp: ProductResponse) => {
            setNewProducts(resp);
            setLoading(false);
        });

        productService.getTopRatedFemaleProducst().then((resp: ProductResponse) => {
            setTopRatedProducts(resp);
        })

    }, [])

    console.log('womanProd', womanProducts)
    return <div className="subs-body">
        <SubscriptionBanner />
        <CollectionSection />
        {loading
            && <div className="loader">
                <Spinner animation="border" style={{color: "#cc3633"}}/>
            </div>}
        {newProducts?.data && <NewProductSection newProducts={newProducts.data} />}
        {topRatedProducts?.data && <TopRatedProducts topProducts={topRatedProducts.data} />}
        {/* de rezolvat daca fetchul esueaza */}
        {womanProducts && <ProductFilterSection products={womanProducts}/>}
    </div>
}

export default ShopWoman;