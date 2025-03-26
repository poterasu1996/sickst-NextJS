import { useEffect, useState } from "react";

// Components
import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import ProductFilterSection from "../../components/ShopPage/ProductFilterSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";
import { CircularProgress } from "@mui/material";

// Storage & services
import productService from "../../shared/services/productService";

// Utils & constants
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
        {/* <CollectionSection /> */}
        {loading 
            && <div className="loader">
                <CircularProgress size={'2rem'} color="primary" thickness={7} />
            </div>}
        {newProducts?.data && <NewProductSection newProducts={newProducts.data}/>}
        {topRatedProducts?.data && <TopRatedProducts topProducts={topRatedProducts.data} />}
        {manProducts && <ProductFilterSection products={manProducts}/>}
    </div>
}

export default ShopMen;