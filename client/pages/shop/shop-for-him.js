import { useEffect, useState } from "react";
import axios from "../../api/axios";
import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import ProductFilterSection from "../../components/ShopPage/ProductFilterSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";

const PRODUCTS_URL = "/products?populate=*";

const ShopMen = () => {
    const [manProducts, setManProducts] = useState([]);

    useEffect(() => {
        axios.get(PRODUCTS_URL).then(resp => {
            const prodList = [...resp.data.data];
            const filteredProducts = manFilter(prodList);
            setManProducts([...filteredProducts]);
        })
    }, [])

    function manFilter(products) {
        const filteredList = products.filter(product => {
            return product.attributes.categories?.data[0]?.attributes?.name?.toLowerCase() === 'male';
        })
        return filteredList;
    }

    return <div className="subs-body">
        <SubscriptionBanner />
        <CollectionSection />
        <NewProductSection />
        <TopRatedProducts />
        <ProductFilterSection products={manProducts}/>
    </div>
}

export default ShopMen;