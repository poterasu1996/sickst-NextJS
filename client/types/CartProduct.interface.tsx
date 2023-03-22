import IProduct from "./Product.interface"

export default interface ICartProduct {
    cartProductId: number,
    payment: string,
    product: IProduct,
    quantity: number
}