import { IGETCancelledOrder } from "./CancelledOrder.model"
import { IShippingInfo } from "./ShippingInformation.model"

export interface IOrderHistoryModel {
    cancelled_order?: number[] | null,
    is_cancelled: boolean,
    is_delivered: boolean,
    order_type: string,
    product_list: IOHProduct[] | null,
    session_id: string,
    shipping_details: IShippingInfo | null | undefined,
    total: number,
    txn_status: string,
    user_id: number,
}

export interface IGETOrderHistory {
    attributes: {
        cancelled_order?: { data: IGETCancelledOrder },
        createdAt: string,
        is_cancelled: boolean,
        is_delivered: boolean,
        order_type: string,
        product_list: IOHProduct[] | null,
        publishedAt: string,
        session_id: string,
        shipping_details: IShippingInfo[] | null,
        total: number,
        txn_status: string,
        updatedAt: string,
        user_id: number,
    },
    id: number
}

export interface IOHProduct {
    brand: string,
    model: string,
    price: number,
    product_id: number
    quantity: number,
}

export enum OrderTypeEnum {
    PAYMENT = "payment",
    COLLECTION = "collection",
}