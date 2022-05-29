import ProductSection from "../../components/HomePage/ProductSection";
import CollectionSection from "../../components/SubscriptionPage/CollectionSection";
import SubscriptionBanner from "../../components/SubscriptionPage/SubscriptionBanner";


const SubscriptionsWoman = () => {

    return <div className="subs-body">
        <SubscriptionBanner />
        <CollectionSection />
        <ProductSection />
    </div>
}

export default SubscriptionsWoman;