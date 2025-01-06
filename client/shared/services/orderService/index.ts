import axios from "axios";
import strapiAxios from "../../../api/axios";
import { API_V, CANCELLED_ORDERS, ORDER_HISTORIES, SUBSCRIPTION_ORDERS } from "../../utils/constants";
import { AppUtils } from "../../utils/app.utils";
import { IGETOrderHistory, IOrderHistoryModel } from "../../../models/OrderHistory.model";
import { ISubscriptionOrderModel } from "../../../models/SubscriptionOrder.model";

const NEXT_SUBSCRIPTION_ORDERS_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${SUBSCRIPTION_ORDERS}`;

class OrderService {
    async getOrderHistory(userId: number) {
        try {
            const response = await strapiAxios.get(`${ORDER_HISTORIES}?userId=${userId}`)
            return response.data.data;
        } catch (error) {
            AppUtils.toastNotification("OOPS! An error occured retrieving order history list!", false);
        }
    }

    async populateSubscriptionHistory(subsData: ISubscriptionOrderModel) {
        const newData = {
            data: {
                ...subsData
            }
        }
        try {
            await axios.post(SUBSCRIPTION_ORDERS, newData)
                .then(() => AppUtils.toastNotification('Te-ai abonat cu succes!', true));
        } catch (error) {
            console.log(error);
            AppUtils.toastNotification('Plata nu a fost efectuata!', false)
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

    async populateOrderHistory(orderData: IOrderHistoryModel) {
        const newData = {
            data: {
                ...orderData,
            }
        }
        try {
            await strapiAxios.post(ORDER_HISTORIES, newData)
        } catch (error) {
            console.log(error);
            AppUtils.toastNotification('Oops, a intervenit o eroare la efectuarea platii!', false)
        }
    }

    async cancelOrder(orderId: number, order: IGETOrderHistory) {
        const { createdAt, publishedAt, updatedAt, ...data } = order["attributes"];
        const cancelData = {
            data: {
              ...data,
              is_cancelled: true,
            },
        };
        const cancelledOrderData = {
            data: {
                user_id: order.attributes.user_id,
                order_history: [order.id],
            },
        };
        try {
            await strapiAxios.post(CANCELLED_ORDERS, cancelledOrderData);
            await strapiAxios.put(`${ORDER_HISTORIES}/${orderId}`, cancelData);
            AppUtils.toastNotification("Comanda a fost anulata cu succes!", true);
        } catch (error) {
            console.log(error);
            AppUtils.toastNotification("OOPS! An error occured while canceling the order!", false);
        }
    }
}

export default new OrderService();