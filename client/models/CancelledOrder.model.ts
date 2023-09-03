export interface ICancelledOrderModel {
    user_id: number,
    order_history: number[],
    order_refunded: boolean
}

export interface IGETCancelledOrder {
   attributes: {
        createdAt: string,
        order_refunded: boolean,
        publishedAt: string,
        updatedAt: string,
        user_id: number 
   },
   id: number 
}