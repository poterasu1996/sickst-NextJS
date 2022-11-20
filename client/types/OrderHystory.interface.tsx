interface ProductOrder {
    data: {
        brand: string,
        model: string,
        price: number,
        productId: number,
        quantity: number
    }
}

export default interface IOrderHystoryList {
    attributes: {
        createdAt: string,
        order_type: string,
        product_list: ProductOrder[] | null,
        publishedAt: string,
        total: number,
        txn_status: boolean,
        updatedAt: string, 
        user_id: number
    },
    id: number
}