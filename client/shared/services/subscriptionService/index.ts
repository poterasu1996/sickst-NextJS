import axios from "axios";
import { API_V, ORDER_HISTORIES, SUBSCRIPTION_ORDERS, USER_PROFILE_DETAILS } from "../../utils/constants";
import { AppUtils } from "../../utils/app.utils";
import strapiAxios from "../../../api/axios";
import { ISubscriptionOrderModel } from "../../../models/SubscriptionOrder.model";
import stripeService from "../stripeService";
import userService from "../userService";

const NEXT_SUBSCRIPTION_ORDERS_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${SUBSCRIPTION_ORDERS}`;

class SubscriptionService {
    async getSubscriptionHistory(userId: number) {
        try {
            const response = await axios.get(`${NEXT_SUBSCRIPTION_ORDERS_API}?userId=${userId}`)
            return response.data;
        } catch (error) {
            AppUtils.toastNotification("OOPS! An error occured retrieving subscription order history list!", false);
        }
    }

    async populateSubscriptionHistory(subsData: ISubscriptionOrderModel) {
        const parsedData = {
            data: {
                ...subsData
            }
        }
        try {
            await strapiAxios.post(SUBSCRIPTION_ORDERS, parsedData)
                .then(() => AppUtils.toastNotification('Te-ai abonat cu succes!', true));
        } catch (error) {
            console.log(error)
            AppUtils.toastNotification('Oops, a intervenit o eroare la efectuarea platii!', false);
        }
    }

    async getActiveSubscriptionID(subscriptionID: string) {
        const queryFilter = `?filters[strapi_subscription_id][$eq]=${subscriptionID}`;
        const resp = await strapiAxios.get(`${SUBSCRIPTION_ORDERS}${queryFilter}`);
        return resp.data?.data[0].id;
    }

    async updateSubscriptionOrder(orderID: number) {
        // cancel the subscription from order table
        const data = {
            data: {
                is_cancelled: true
            }
        }
        const resp = await strapiAxios.put(`${SUBSCRIPTION_ORDERS}/${orderID}`, data);
        return resp.data;
    }


    async cancelSubscription(subscriptionID: string) {
        try {
            // cancel from stripe
            await stripeService.cancelSubscription(subscriptionID);
    
            // cancel subscription from order table
            const orderID = await this.getActiveSubscriptionID(subscriptionID);
            await this.updateSubscriptionOrder(orderID);
    
            // update account status - must be done in a separate service
            // const uDetailsID = await userService.getUserDetailsID();
            // await userService.updateUserSubscription(uDetailsID);
        } catch (error) {
           console.log(error) 
           AppUtils.toastNotification('Oops, a intervenit o eroare la anularea subscriptiei!', false)
        }
    }
    
}

export default new SubscriptionService();