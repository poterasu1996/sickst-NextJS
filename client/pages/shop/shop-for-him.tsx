import { useEffect, useState } from "react";
import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import ProductFilterSection from "../../components/ShopPage/ProductFilterSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";
import productService from "../../shared/services/productService";
import { Spinner } from "react-bootstrap";
import ProductResponse from "../../types/shop/ProductResponse.interface";

const ShopMen = () => {
    const [manProducts, setManProducts] = useState<ProductResponse>();
    const [newProducts, setNewProducts] = useState<ProductResponse>();
    const [topRatedProducts, setTopRatedProducts] = useState<ProductResponse>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        productService.getMaleProducts().then((resp: ProductResponse) => {
            setManProducts(resp);
        })

        productService.getNewMaleProducts().then((resp: ProductResponse) => {
            setNewProducts(resp);
            setLoading(false);
        })

        productService.getTopRatedMaleProducts().then((resp: ProductResponse) => {
            setTopRatedProducts(resp);
        })
    }, [])

    return <div className="subs-body">
        <SubscriptionBanner />
        <CollectionSection />
        {loading 
            && <div className="loader">
                <Spinner animation="border" style={{color: "#cc3633"}}/>
            </div>}
        {newProducts?.data && <NewProductSection newProducts={newProducts.data}/>}
        {topRatedProducts?.data && <TopRatedProducts topProducts={topRatedProducts.data} />}
        <ProductFilterSection products={manProducts}/>
    </div>
}

export default ShopMen;