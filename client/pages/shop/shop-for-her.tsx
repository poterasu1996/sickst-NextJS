// Components
import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import ProductFilterSection from "../../components/ShopPage/ProductFilterSection";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";
import { CircularProgress } from "@mui/material";

// Utils & constants
import SliderBanner from "../../components/ShopPage/SliderBanner";
import useWomanProducts from "../../features/shop/shop-for-her/hooks/useWomanProducts";
import NewProductSkeleton from "../../features/shop/components/NewProductSkeleton";
import TopRatedProductsSkeleton from "../../features/shop/components/TopRatedProductsSkeleton";

const ShopWoman = () => {
    const { 
        allProducts,
        newProducts,
        topRatedProducts,
        loading, 
        error
    } = useWomanProducts();

    return (
        <>
            <SliderBanner />
            <div className="layout">
                {/* <CollectionSection /> */}
                {loading &&  <NewProductSkeleton />}
                {newProducts?.data && <NewProductSection newProducts={newProducts.data} />}

                {loading && <TopRatedProductsSkeleton />}
                {topRatedProducts?.data && <TopRatedProducts topProducts={topRatedProducts.data} />}

                {/* de rezolvat daca fetchul esueaza */}
                {allProducts && <ProductFilterSection products={allProducts}/>}
            </div>
        </>
    ) 
}

export default ShopWoman;