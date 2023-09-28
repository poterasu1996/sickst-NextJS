export interface ISubscriptionOrderModel {
    is_cancelled: boolean,
    expire_date: string | null,
    last_payment_date: string | null,
    session_id: string,
    subscription_list: any,
    subscription_name: string,
    subscription_price: number,
    subscription_status: string,
    txn_status: string,
    user_id: number,
}

export interface IGETSubscriptionOrder {
    attributes: {
        createdAt: string,
        expire_date: string | null,
        is_cancelled: boolean,
        last_payment_date: string | null,
        publishedAt: string,
        session_id: string,
        subscription_list: any,
        subscription_name: string,
        subscription_price: number,
        subscription_status: string,
        txn_status: string,
        updatedAt: string,
        user_id: number
    },
    id: number
}

export interface ISubscriptionList {
    brand: string,
    image: string,
    model: string,
    product_id: number,
    delivery_month: string
}

export enum SubscriptionStatusEnum {
    ACTIVE = 'active',
    PAUSED = 'paused',
    CANCELLED = 'cancelled',
}

export enum SubscriptionNameEnum {
    MYSTERY = 'mystery',
    BASIC = 'basic',
    PREMIUM = 'premium'
}