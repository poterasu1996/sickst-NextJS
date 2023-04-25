export default interface IGETSubscriptionHistory {
    attributes: {
        createdAt: string,
        expire_date: string | null,
        last_payment_date: string,
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