export interface IOrderHistoryModel {
    order_type: string,
    product_list: any,
    session_id: string,
    total: number,
    txn_status: boolean
    user_id: number,
}

export interface IOHProduct {
    brand: string,
    model: string,
    price: number,
    product_id: number
    quantity: number,
}