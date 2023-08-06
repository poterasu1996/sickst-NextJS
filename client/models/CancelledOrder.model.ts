export interface ICancelledOrderModel {
    user_id: number,
    order_history: number[],
    order_refunded: boolean
}