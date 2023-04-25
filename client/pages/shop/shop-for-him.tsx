import { useEffect, useState } from "react";
import axios from "../../api/axios";
import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import ProductFilterSection from "../../components/ShopPage/ProductFilterSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";
import { CategoryEnums } from "../../shared/enums/category.enum";
import productService from "../../shared/services/productService";
import { Spinner } from "react-bootstrap";

const PRODUCTS_URL = "/products?populate=*";

type Product = {
    id: number,
    attributes: any
}

interface ProductResponse {
    data?: any,
    meta?: any,
    error?: {
        status: number,
        name: string, 
        message: string
    }
}

const ShopMen = () => {
    const [manProducts, setManProducts] = useState<ProductResponse>();
    const [newProducts, setNewProducts] = useState<ProductResponse>();
    const [topRatedProducts, setTopRatedProducts] = useState<ProductResponse>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // axios.get(PRODUCTS_URL).then(resp => {
        //     const prodList = [...resp.data.data];
        //     const filteredProducts = manFilter(prodList);
        //     setManProducts([...filteredProducts]);
        // })
        productService.getMaleProducts().then((resp: any) => {
            setManProducts(resp);
            // console.log('MALE PROD ', resp) 
        })

        productService.getNewMaleProducts().then((resp: ProductResponse) => {
            setNewProducts(resp);
            setLoading(false);
        })

        productService.getTopRatedMaleProducts().then((resp: ProductResponse) => {
            setTopRatedProducts(resp);
        })
    }, [])

    // topRatedProducts?.data && console.log('topRatedProd: ', topRatedProducts)
    // function manFilter(products: Product[]) {
    //     const filteredList = products.filter(product => {
    //         return product.attributes.categories?.data[0]?.attributes?.name?.toUpperCase() === CategoryEnums.MALE;
    //     })
    //     return filteredList;
    // }

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