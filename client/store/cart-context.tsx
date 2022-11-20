import React, { useEffect, useState } from "react";
import IProduct from "../types/Product.interface";
import ICartProduct from "../types/CartProduct.interface";
import ICartContext from "../types/context-interfaces/CartContext.interface";

const CartContext = React.createContext<ICartContext | null>(null);

type Props = {
  children: JSX.Element
}

export const CartProvider = ({ children }: Props) => {
  const [refresh, setRefresh] = useState<boolean>(false);                         // reset cart each time add/delete action is made
  const [cart, setCart] = useState<ICartProduct[] | null>(null);                  // set the cart list
  const [cartTotal, setCartTotal] = useState<number>(0);                          // set cart total
  const [storageList, setStorageList] = useState<ICartProduct[] | null>(null);    // set localStorage list
  const [subsList, setSubsList] = useState<ICartProduct[] | null>(null);          // set subscriptions list from local storage

  useEffect(() => {
    const storageValue = localStorage.getItem("cart");
    let storageCart = null;
    if(typeof storageValue === 'string') {
        storageCart = JSON.parse(storageValue);
    }
    if (storageCart) {
      setStorageList([...storageCart]);
      const subscriptionItem = storageCart.filter((item: any) => {
        return item.payment === "subscription";
      });
      const otbList = storageCart.filter((item: any) => {
        return item.payment === "otb";
      });
      if (subscriptionItem) {
        setCart([...subscriptionItem, ...otbList]);
        setSubsList(storageCart.filter((item: any) => {
          return item.payment === "subscription";
        }))
      } else {
        setCart([...otbList]);
      }
    }
  }, [refresh]);


  function addProduct(product: IProduct, quantity: number, payment: string) {
    if (localStorage.getItem("cart") !== null) {
      const storageValue = localStorage.getItem("cart");
      let storageProducts = null;
      if(typeof storageValue === 'string') {
        storageProducts = JSON.parse(storageValue);
      }
      const cartId = storageProducts.length;
      let found = false;
        
      const newStoreList = storageProducts.map((item: ICartProduct) => {
        if (item.product.id === product.id && item.payment === payment && payment === 'otb') {
          found = true;
          const qt = item.quantity;
          return { ...item, quantity: qt + 1 };
        }
        return item;
      });

      if(found) {
        setCart(newStoreList);
        localStorage.setItem("cart", JSON.stringify(newStoreList));  
      } else {
        const newCartList = [
        ...storageProducts,
        { cartId, product, quantity, payment },
        ];
        setCart(newCartList);
        localStorage.setItem("cart", JSON.stringify(newCartList));
      }

      setRefresh(preVal => !preVal);
    } else {
      localStorage.setItem("cart", JSON.stringify([{ cartId: 0, product, quantity, payment }]));
      setCart([{ cartId: 0, product, quantity, payment }]);
      setRefresh(preVal => !preVal);
    }
  }

  function subscriptionList() {
    // return a list with subscription items from storage
    if(storageList) {
      const list = storageList.filter((item) => {
        return item.payment === "subscription";
      })
      return list;
    }
    return [];
  }

  function singlePaymentList() {
    // return a list with single payment items from storage
    if(storageList) {
      const list = storageList.filter((item) => {
        return item.payment === "otb";
      })
      return list;
    }
    return null;
  }

  const removeProduct = (cartProduct: ICartProduct) => {
    if(typeof cart !== null && typeof cart !== undefined) {
        const newList = cart!.filter((el) => {
          return el.cartId !== cartProduct.cartId;
        });
        if (newList.length > 0) {
          setCart(newList);
          localStorage.setItem("cart", JSON.stringify(newList)); // set new cart list with removed item
          setRefresh(preVal => !preVal);
        } else {
          setCart(newList);
          localStorage.removeItem("cart"); // if list is empty, remove cart from storage
          setRefresh(preVal => !preVal);
        }
    }
  };

  const hasProduct = (product: IProduct) => {
    // place a checkmark if item is in cart list
    const storageValue = localStorage.getItem("cart");
    if ( storageValue !== null) {
      const cartList = JSON.parse(storageValue);
      const exist = cartList.filter((item: ICartProduct) => product.id === item.product.id);
      if (exist.length > 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const quantityProduct = (cartProduct: ICartProduct, operation: string) => {
    const storageValue = localStorage.getItem("cart");
    let storage = null;
    if(typeof storageValue === 'string') {
        storage = JSON.parse(storageValue);
    }

    if (operation === "remove") {
      const newStoreList = storage.map((item: ICartProduct) => {  // update cartProduct quantity
        if (item.cartId === cartProduct.cartId) {
          const qt = item.quantity;
          setRefresh(preVal => !preVal);
          return { ...item, quantity: qt - 1 };
        }
        return item;
      });

      const subscriptionItem = newStoreList.find((item: ICartProduct) => item.payment === 'subscription');
      const otbList = newStoreList.filter((item: ICartProduct) => item.payment === 'otb');
      if (subscriptionItem) {                       // if store contains 1 subs item
        setCart([subscriptionItem, ...otbList]);    // update cart with 1 subs item
      } else {
        setCart([...otbList]);
      }
      localStorage.setItem("cart", JSON.stringify(newStoreList)); // update store
    } else {
      const newStoreList = storage.map((item: ICartProduct) => {
        if (item.cartId === cartProduct.cartId) {
          const qt = item.quantity;
          setRefresh(preVal => !preVal);
          return { ...item, quantity: qt + 1 };
        }
        return item;
      });
      const subscriptionItem = newStoreList.find((item: ICartProduct) => item.payment === 'subscription');
      const otbList = newStoreList.filter((item: ICartProduct) => item.payment === 'otb');
      if (subscriptionItem) {
        setCart([subscriptionItem, ...otbList]);
      } else {
        setCart([...otbList]);
      }
      localStorage.setItem("cart", JSON.stringify(newStoreList)); // update store
    }
  };

  const productTotal = (cartProduct: ICartProduct) => {
    // calculate total price for multiple products of the same type, ex: same_product x 3
    const payment = cartProduct.payment;
    if(payment === 'otb') {
      const total = cartProduct.quantity * cartProduct.product.attributes.otb_price;
      return total;
    } 
    return 0
  };

//   function subscriptionTotal(product, coupone) {
//     const price = product.product.attributes.subscription_price;
//     if(coupone) {
//       return  price - price * (coupone / 100);
//     }
//     return price;
//   }

  const total = (coupone?: number) => {
    // calculate cart total for OTB products
    let total = 0;
    cart?.map((item) => {
        if(item.payment === 'subscription') {
            // total = total + item.quantity * item.product.attributes.subscription_price;
            return;
        } else {
            total = total + item.quantity * item.product.attributes.otb_price;
        }
    });
    if (coupone) {
      total = total - total * (coupone / 100);
      setCartTotal(total);
      return total;
    }
    setCartTotal(total);
    return total;
  };

  const cartManager: ICartContext = {
    refresh: refresh,
    cart: cart,
    setCart: setCart,
    setRefresh: setRefresh,
    addProduct: addProduct,
    removeProduct: removeProduct,
    hasProduct: hasProduct,
    quantityProduct: quantityProduct,
    productTotal: productTotal,
    total: total,
    subscriptionList: subscriptionList,
    singlePaymentList: singlePaymentList,
    subsList: subsList,
    setSubsList: setSubsList,
    cartTotal: cartTotal,
    // subscriptionTotal,
  };

  return (
    <CartContext.Provider value={cartManager}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
