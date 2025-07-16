import IProduct from "../product";

export default interface ICartProduct {
    cartProductId: string,
    payment: string,
    product: IProduct,
    quantity: number
}