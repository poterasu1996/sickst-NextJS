import axios from "axios";
import { API_V, ORDER_HISTORIES, SUBSCRIPTION_ORDERS } from "../../utils/constants";
import { AppUtils } from "../../utils/app.utils";

const NEXT_ORDER_HISTORY_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${ORDER_HISTORIES}`;
const NEXT_SUBSCRIPTION_ORDERS_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${SUBSCRIPTION_ORDERS}`;

class OrderService {
    async getOrderHistory(userId: number) {
        try {
            const response = await axios.get(`${NEXT_ORDER_HISTORY_API}?userId=${userId}`)
            return response.data;
        } catch (error) {
            AppUtils.toastNotification("OOPS! An error occured retrieving order history list!", false);
        }
    }

    async getSubscriptionHistory(userId: number) {
        try {
            const response = await axios.get(`${NEXT_SUBSCRIPTION_ORDERS_API}?userId=${userId}`)
            return response.data;
        } catch (error) {
            AppUtils.toastNotification("OOPS! An error occured retrieving subscription order history list!", false);
        }
    }
}

export default new OrderService();