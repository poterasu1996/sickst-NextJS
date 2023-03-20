import ICartProduct from "../CartProduct.interface";
import IProduct from "../Product.interface";

export default interface ICartContext {
    refresh: boolean,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
    // cart: ICartProduct[] | null,
    // setCart: React.Dispatch<React.SetStateAction<ICartProduct[] | null>>,
    // addProduct: (product: IProduct, quantity: number, payment: string) => void,
    // removeProduct: (cartProduct: ICartProduct) => void,
    // hasProduct: (product: IProduct) => boolean,
    // quantityProduct: (cartProduct: ICartProduct, operation: string) => void,
    // productTotal: (cartProduct: ICartProduct) => number,
    // total: (coupone?: number) => number,
    // subscriptionList: () => ICartProduct[],
    // singlePaymentList: () => ICartProduct[] | null,
    // subsList: ICartProduct[] | null,
    // setSubsList: React.Dispatch<React.SetStateAction<ICartProduct[] | null>>,
    // cartTotal: number,
    // subscriptionTotal,
}