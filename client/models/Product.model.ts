export interface IProductModel {

}

export interface IGETProduct {
    attributes: {
        brand: string,
        createdAt: string,
        description: string,
        image: any,
        model: string,
        otb_price: number,
        publishedAt: number,
        quantity: number,
        rating: number,
        retail_value: number,
        stripe_fullpriceLink: string,
        subscription_type: string,
        type: string,
        updatedAt: string
    },
    id: number
}