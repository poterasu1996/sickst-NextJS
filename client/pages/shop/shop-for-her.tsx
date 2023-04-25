import { useEffect, useState } from "react";
import axios from "../../api/axios";
import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import ProductFilterSection from "../../components/ShopPage/ProductFilterSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";
import { CategoryEnums } from "../../shared/enums/category.enum";

const PRODUCTS_URL = "/products?populate=*";

type Product = {
    id: number,
    attributes: any
}

const ShopWoman = () => {
    const [womanProducts, setWomanProducts] = useState<Product[] | null>(null);

    useEffect(() => {
        axios.get(PRODUCTS_URL).then(resp => {
            const prodList = [...resp.data.data];
            const filteredProducts = womanFilter(prodList);
            setWomanProducts([...filteredProducts]);
        })
    }, [])

    function womanFilter(products: Product[]) {
        const filteredList = products.filter(product => {
            return product.attributes.categories?.data[0]?.attributes?.name?.toUpperCase() === CategoryEnums.FEMALE;
        })
        return filteredList;
    }

    return <div className="subs-body">
        <SubscriptionBanner />
        <CollectionSection />
        <NewProductSection />
        <TopRatedProducts />
        <ProductFilterSection products={womanProducts}/>
    </div>
}

export default ShopWoman;