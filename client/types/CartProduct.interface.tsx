import IProduct from "./Product.interface"

export default interface ICartProduct {
    cartId: number,
    payment: string,
    product: IProduct,
    quantity: number
}