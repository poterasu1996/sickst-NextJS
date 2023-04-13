import { TxnStatusEnum } from "../shared/enums/txn.enum"

export type FullPriceProductList = {
    brand: string,
    model: string,
    price: number,
    productId: number,
    quantity: number
}

// export type SubscriptionProductList = {
//     brand: string,
//     model: string,
//     productId: number,
//     quantity: number
// }

// export type ProductList = 
//     | FullPriceProductList 
//     | SubscriptionProductList;

// DTO for POST a subbscription order
export interface IPOSTSubscriptionHistory {
    session_id: string,
    user_id: number,
    expire_date: string | null,
    subscription_name: string,
    subscription_price: number,
    txn_status: TxnStatusEnum,
    subscription_list: any
}

// DTO from get/subscriptions
export interface GETSubscription {
    attributes: {
      createdAt: string,
      name: string,
      price: number,
      publishedAt: string,
      stripe_sub_link: string,
      updatedAt: string
    }
}

// DTO for POST an order history
export interface IPOSTOrderHistory {
    order_type: string,
    product_list: FullPriceProductList[],
    session_id: string,
    total: number,
    txn_status: boolean,
    user_id: number
}

// DTO from get/order-history
export interface IOrderHystoryList {
    attributes: {
        createdAt: string,
        order_type: string,
        product_list: FullPriceProductList[],
        publishedAt: string,
        total: number,
        txn_status: boolean,
        updatedAt: string, 
        user_id: number,
        session_id: string,
    },
    id: number
}