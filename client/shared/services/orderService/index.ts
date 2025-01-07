import strapiAxios from "../../../api/axios";
import { CANCELLED_ORDERS, ORDER_HISTORIES } from "../../utils/constants";
import { AppUtils } from "../../utils/app.utils";
import { IGETOrderHistory, IOrderHistoryModel } from "../../../models/OrderHistory.model";


class OrderService {
    async getOrderHistory(userId: number) {
        try {
            const queryFilter = `?filters[user_id][$eq]=${userId}`
            const response = await strapiAxios.get(`${ORDER_HISTORIES}${queryFilter}`)
            return response.data.data;
        } catch (error) {
            AppUtils.toastNotification("OOPS! An error occured retrieving order history list!", false);
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