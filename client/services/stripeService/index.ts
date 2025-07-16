import axios from "axios";

const CLIENT_URL = process.env.NEXT_PUBLIC_BASEURL;
const NEXT_API_STRIPE_CHECKOUT = '/api/v1/stripe/checkout';
const NEXT_API_STRIPE_SUBSCRIPTION = '/api/v1/stripe/subscription'

type Data = {
    action: "cancel" | "update" | "resume",
    subscription_id: string
}

class StripeService {

    async getSessionDetails(sessionId: string) {
        const sesInfo = await axios.post(`${CLIENT_URL}${NEXT_API_STRIPE_CHECKOUT}`, {subscription_id: sessionId})
        return sesInfo.data;
    }

    async cancelSubscription(subscriptionID: string) {
        const data: Data = {
            action: "cancel",
            subscription_id: subscriptionID
        }
        const result = await axios.post(`${CLIENT_URL}${NEXT_API_STRIPE_SUBSCRIPTION}`, data);
        return result;
    }
}

export default new StripeService();