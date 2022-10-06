import ProductSection from "../../components/HomePage/ProductSection";
import CollectionSection from "../../components/ShopPage/CollectionSection";
import SubscriptionBanner from "../../components/ShopPage/SubscriptionBanner";


const ShopWoman = () => {

    return <div className="subs-body">
        <SubscriptionBanner />
        <CollectionSection />
        <ProductSection />
    </div>
}

export default ShopWoman;