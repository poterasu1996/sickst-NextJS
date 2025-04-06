import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Components
import CollectionSection from "../../features/shop/components/CollectionSection";
import NewProductSection from "../../features/shop/components/NewProductSection";
import ProductFilterSection from "../../features/shop/components/ProductFilterSection";
import SliderBanner from "../../features/shop/components/SliderBanner";
import TopRatedProducts from "../../features/shop/components/TopRatedProducts";
import NewProductSkeleton from "../../features/shop/components/NewProductSkeleton";
import TopRatedProductsSkeleton from "../../features/shop/components/TopRatedProductsSkeleton";

// Utils & constants
import useManProducts from "../../features/shop/shop-for-him/hooks/useManProducts";
import IProduct from "../../types/Product.interface";
import { DEFAULT_SELECTED_FILTERS } from "../../shared/types";

const ShopMen = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [filters, setFilters] = useState(DEFAULT_SELECTED_FILTERS)
    
    const router = useRouter();
    const search = typeof router.query.search === "string" ? router.query.search : "";

    const { 
        allProducts,
        newProducts,
        topRatedProducts,
        loading,
        respPage, 
        setPage,
        error
    } = useManProducts({ search, filters });

    const handleLoadMoreProducts = () => {
        setPage(respPage + 1);
    }

    const handleFilters = (selectedFilters: any) => {
        setFilters({...selectedFilters})
    } 

    useEffect(() => {
        if(allProducts?.data) {
            const totalPages = allProducts.meta?.pagination.pageCount || 1;
            if(respPage === 1) {
                setProducts([...allProducts.data]);
                if (respPage >= totalPages) {
                    setShowMore(false)
                } else {
                    setShowMore(true)
                }
            } else {
                setProducts(prevVal => [...prevVal, ...allProducts?.data]);
                if (respPage >= totalPages) {
                    setShowMore(false)
                } else {
                    setShowMore(true)
                }
            }
        }
    }, [allProducts, respPage])

    return (<>
        <SliderBanner />
        <div className="layout">
            {/* <CollectionSection /> */}
            {!search && (<>
                {loading &&  <NewProductSkeleton />}
                {newProducts?.data && <NewProductSection newProducts={newProducts.data}/>}

                {loading && <TopRatedProductsSkeleton />}
                {topRatedProducts?.data && <TopRatedProducts topProducts={topRatedProducts.data} />}
            </>)}

            {allProducts && <ProductFilterSection products={products} showMore={showMore} handleShowMore={handleLoadMoreProducts} handleFilters={handleFilters} />}
        </div>
    </>)
}

export default ShopMen;