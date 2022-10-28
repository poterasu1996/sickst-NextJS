import CollectionSection from "../../components/ShopPage/CollectionSection";
import NewProductSection from "../../components/ShopPage/NewProductSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";
import TopRatedProducts from "../../components/ShopPage/TopRatedProducts";


const ShopWoman = () => {

    return <div className="subs-body">
        <SubscriptionBanner />
        <CollectionSection />
        <NewProductSection />
        <TopRatedProducts />
    </div>
}

export default ShopWoman;