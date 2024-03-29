export default interface IProduct {
    attributes: {
        brand: string,
        categories: any,
        createdAt: string,
        description: string | null,
        image: any,
        model: string,
        otb_price: number,
        publishedAt: string,
        quantity: number,
        rating: number,
        retail_value: number,
        stripe_fullpriceLink: string,
        subscription_type: string,
        tags: any,
        type: string, 
        updatedAt: string
    },
    id: number
}