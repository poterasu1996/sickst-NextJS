import { useEffect, useState } from "react"
import { useRouter } from "next/router";

// Components
import ShopBanner from "../../features/shop/components/ShopBanner";
import NewProductSkeleton from "../../features/shop/components/NewProductSkeleton";
import NewProductSection from "../../features/shop/components/NewProductSection";
import TopRatedProductsSkeleton from "../../features/shop/components/TopRatedProductsSkeleton";
import TopRatedProducts from "../../features/shop/components/TopRatedProducts";
import ProductFilterSection from "../../features/shop/components/ProductFilterSection";

// Hooks
import useProducts from "../../features/shop/hooks/useProducts";

// Utils & Constants
import IProduct from "../../types/Product.interface";
import { DEFAULT_SELECTED_FILTERS } from "../../shared/types";

const Shop = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [filters, setFilters] = useState(DEFAULT_SELECTED_FILTERS);
    
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
    } = useProducts({ search, filters });

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
    }, [allProducts, respPage]);

    const handleLoadMoreProducts = () => {
        setPage(respPage + 1);
    }

    const handleFilters = (selectedFilters: any) => {
        setFilters({...selectedFilters})
    } 

    return (<>
        <ShopBanner />
        <div className="layout">
            {!search && (<>
                    {loading &&  <NewProductSkeleton />}
                    {newProducts?.data && <NewProductSection newProducts={newProducts.data} />}

                    {loading && <TopRatedProductsSkeleton />}
                    {topRatedProducts?.data && <TopRatedProducts topProducts={topRatedProducts.data} />}
            </>)}

            {allProducts && <ProductFilterSection products={products} showMore={showMore} handleShowMore={handleLoadMoreProducts} handleFilters={handleFilters} />}
        </div>
    </>)
}

export default Shop;