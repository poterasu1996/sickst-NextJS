import ICartProduct from "../../../types/CartProduct.interface";
import IProduct from "../../../types/Product.interface";
import { PaymentEnums } from "../../enums/payment.enums";

class CartService {
    cart: ICartProduct[] = [];
    storageList: ICartProduct[] = [];
    cartLength: number = 0;

    constructor() {
        if (typeof window !== 'undefined') {
            const _storageValue = localStorage.getItem("cart");
            let _storageCart: ICartProduct[] = [];

            if(typeof _storageValue === "string") {
                try {
                    _storageCart = JSON.parse(_storageValue) || [];
                } catch (error) {
                    console.log('Failed to parse cart from storage', error);
                    _storageCart = []
                }
            }

            this.storageList = [..._storageCart];

            const _subscriptionItem = _storageCart.filter(item => item.payment === PaymentEnums.SUBSCRIPTION);
            const _otbList = _storageCart.filter(item => item.payment === PaymentEnums.FULL_PAYMENT);

            this.cart = [..._subscriptionItem, ..._otbList];
            // if (_storageCart) {
            //     this.storageList = [..._storageCart];
            //     const _subscriptionItem = _storageCart.filter((item: ICartProduct) => {
            //         return item.payment === PaymentEnums.SUBSCRIPTION;
            //     });
            //     const _otbList = _storageCart.filter((item: ICartProduct) => {
            //         return item.payment === PaymentEnums.FULL_PAYMENT;
            //     });
            //     if (_subscriptionItem) {
            //         this.cart = [..._subscriptionItem, ..._otbList];
            //         // set subs list?
            //     } else {
            //         this.cart = [..._otbList];
            //     }
            // }
        }
    }

    addProduct(product: IProduct, quantity: number, payment: string) {
        if(localStorage.getItem("cart") !== null) {
            const storageValue = localStorage.getItem("cart");
            let storageProducts = null;
            if(typeof storageValue === 'string') {
                storageProducts = JSON.parse(storageValue);
            }
            const cartProductId = storageProducts.length;
            let found = false;

            // check if the product already exist, to increase qt
            const newStoreList = storageProducts.map((item: ICartProduct) => {
                if (item.product.id === product.id && item.payment === payment && payment === PaymentEnums.FULL_PAYMENT) {
                    found = true;
                    const qt = item.quantity;
                    return { ...item, quantity: qt + 1} ;
                }
                return item;
            });

            if(found) {
               this.cart = [...newStoreList];
               localStorage.setItem("cart", JSON.stringify(newStoreList)); 
            } else {
                const newCartList = [
                    ...storageProducts,
                    { cartProductId, product, quantity, payment },
                ];

                const _subscriptionItem = newCartList.filter((item: ICartProduct) => {
                    return item.payment === PaymentEnums.SUBSCRIPTION;
                });
                const _fullPaymentItems = newCartList.filter((item: ICartProduct) => {
                    return item.payment === PaymentEnums.FULL_PAYMENT;
                });
                if (_subscriptionItem) {
                    this.cart = [..._subscriptionItem, ..._fullPaymentItems];
                    this.storageList = [..._subscriptionItem, ..._fullPaymentItems];
                } else {
                    this.cart = [..._fullPaymentItems]
                    this.storageList = [..._fullPaymentItems]
                }

                localStorage.setItem("cart", JSON.stringify(newCartList));
            }
        } else {
            localStorage.setItem('cart', JSON.stringify([{ cartProductId: 0, product, quantity, payment }]));
            this.cart = [{ cartProductId: 0, product, quantity, payment }];
            this.storageList = [{ cartProductId: 0, product, quantity, payment }];
        }
    }

    quantityProduct(cartProduct: ICartProduct, operation: string) {
        const _storageValue = localStorage.getItem('cart');
        let storage = null;
        if(typeof _storageValue === 'string') {
            storage = JSON.parse(_storageValue);
        }

        if (operation === "remove") {
            const _newStoreList = storage.map((item: ICartProduct) => {
                if (item.cartProductId === cartProduct.cartProductId) {
                    const qt = item.quantity;
                    return { ...item, quantity: qt - 1};
                }
                return item;
            });

            const _subscriptionItem = _newStoreList.find((item: ICartProduct) => item.payment === PaymentEnums.SUBSCRIPTION);
            const _otbList = _newStoreList.filter((item: ICartProduct) => item.payment === PaymentEnums.FULL_PAYMENT);
            if (_subscriptionItem) {                       // if store contains 1 subs item
                this.cart = [_subscriptionItem, ..._otbList];    // update cart with 1 subs item
            } else {
                this.cart = [..._otbList];
            }
            localStorage.setItem("cart", JSON.stringify(_newStoreList)); // update store
        } else {
            const _newStoreList = storage.map((item: ICartProduct) => {
                if (item.cartProductId === cartProduct.cartProductId) {
                  const qt = item.quantity;
                  return { ...item, quantity: qt + 1 };
                }
                return item;
            });
            const _subscriptionItem = _newStoreList.find((item: ICartProduct) => item.payment === PaymentEnums.SUBSCRIPTION);
            const _otbList = _newStoreList.filter((item: ICartProduct) => item.payment === PaymentEnums.FULL_PAYMENT);
            if (_subscriptionItem) {
                this.cart = [_subscriptionItem, ..._otbList];
            } else {
                this.cart = [..._otbList];
            }
            localStorage.setItem("cart", JSON.stringify(_newStoreList)); // update store 
        }
    }

    removeProduct(cartProduct: ICartProduct) {
        if (this.cart !== null && this.cart !== undefined) {
            const _newList = this.cart.filter((el: ICartProduct) => {
                return el.cartProductId !== cartProduct.cartProductId;
            });
            if (_newList.length > 0) {
                this.cart = [..._newList];
                this.storageList = [..._newList];
                localStorage.setItem('cart', JSON.stringify(_newList));            
            } else {
                this.cart = _newList;
                this.storageList = _newList;
                localStorage.removeItem('cart');
            }
        }
    }

    removeLSSubscriptioProducts() {
        const _newList = this.storageList?.filter(prod => { return prod.payment !== PaymentEnums.SUBSCRIPTION });
        console.log(_newList)
        if(_newList) {
            this.storageList = [..._newList];
            localStorage.setItem('cart', JSON.stringify(_newList))
        }
    }

    singlePaymentList() {
        if (this.cart) {
            const _list = this.cart.filter((item: ICartProduct) => {
                return item.payment === PaymentEnums.FULL_PAYMENT;
            })
            return _list;
        }
        return null;
    }

    subscriptionList() {
        if(this.cart) {
            const list = this.cart.filter((item: ICartProduct) => {
              return item.payment === PaymentEnums.SUBSCRIPTION;
            })
            return list;
        }
        return [];
    }

    hasProduct(product: IProduct) {
        const _storageValue = localStorage.getItem("cart");
        if ( _storageValue !== null) {
            const _cartList = JSON.parse(_storageValue);
            const _exist = _cartList.filter((item: ICartProduct) => product.id === item.product.id);
            if (_exist.length > 0) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    productTotal(cartProduct: ICartProduct) {
        const _payment = cartProduct.payment;
        if (_payment === PaymentEnums.FULL_PAYMENT) {
            return cartProduct.quantity * cartProduct.product.attributes.otb_price;
        }
        return 0;
    }

    cartTotal(coupone?: number) {
        let cartTotalPrice = 0;
        this.cart?.map((item: ICartProduct) => {
            if(item.payment === PaymentEnums.SUBSCRIPTION) {
                return;
            } else {
                cartTotalPrice = cartTotalPrice + item.quantity * item.product.attributes.otb_price;
            }
        });
        if (coupone) {
            cartTotalPrice = cartTotalPrice - cartTotalPrice * (coupone / 100);
            return cartTotalPrice;
        }
        return cartTotalPrice;
    }

    getCartLength() {
        let _cartL = 0;
        this.cart?.map((product: ICartProduct) => _cartL += product.quantity);
        this.cartLength = _cartL;

        return _cartL;
    }

    clearCart() {
        this.cart = [];
        this.storageList = [];
        this.cartLength = 0;
        localStorage.removeItem('cart');
    }
}

export default new CartService();