import React, { useEffect, useState } from "react";

const CartContext = React.createContext([]);

export const CartProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);  // reset cart each time add/delete action is made
  const [cart, setCart] = useState([]);               // set the cart list
  const [cartTotal, setCartTotal] = useState();       // set cart total
  const [storageList, setStorageList] = useState([]); // set localStorage list
  const [subsList, setSubsList] = useState([]);       // set subscriptions list from local storage

  useEffect(() => {
    const storageCart = JSON.parse(localStorage.getItem("cart"));
    if (storageCart) {
      setStorageList([...storageCart]);
      const subscriptionItem = storageCart.filter((item) => {
        return item.payment === "subscription";
      });
      const otbList = storageCart.filter((item) => {
        return item.payment === "otb";
      });
      if (subscriptionItem) {
        setCart([...subscriptionItem, ...otbList]);
        setSubsList(storageCart.filter((item) => {
          return item.payment === "subscription";
        }))
      } else {
        setCart([...otbList]);
      }
    }
  }, [refresh]);


  function addProduct(product, quantity, payment) {
    if (localStorage.getItem("cart") !== null) {
      const storageProducts = JSON.parse(localStorage.getItem("cart"));
      const cartId = storageProducts.length;
      let found = false;
        
      const newStoreList = storageProducts.map((item) => {
        if (item.product.id === product.id & item.payment === payment & payment === 'otb') {
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
    if(storageList.length > 0) {
      const list = storageList.filter((item) => {
        return item.payment === "subscription";
      })
      return list;
    }
    return [];
  }

  function singlePaymentList() {
    // return a list with single payment items from storage
    if(storageList.length > 0) {
      const list = storageList.filter((item) => {
        return item.payment === "otb";
      })
      return list;
    }
  }

  const removeProduct = (product) => {
    const newList = cart.filter((el) => {
      return el.cartId !== product.cartId;
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
  };

  const hasProduct = (product) => {
    // place a checkmark if item is in cart list
    if (localStorage.getItem("cart") !== null) {
      const cartList = JSON.parse(localStorage.getItem("cart"));
      const exist = cartList.filter((item) => product.id === item.product.id);
      if (exist.length > 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const quantityProduct = (product, operation) => {
    const storage = JSON.parse(localStorage.getItem("cart"));

    if (operation === "remove") {
      const newStoreList = storage.map((item) => {  // update product quantity
        if (item.cartId === product.cartId) {
          const qt = item.quantity;
          setRefresh(preVal => !preVal);
          return { ...item, quantity: qt - 1 };
        }
        return item;
      });

      const subscriptionItem = newStoreList.find(item => item.payment === 'subscription');
      const otbList = newStoreList.filter(item => item.payment === 'otb');
      if (subscriptionItem) {                       // if store contains 1 subs item
        setCart([subscriptionItem, ...otbList]);    // update cart with 1 subs item
      } else {
        setCart([...otbList]);
      }
      localStorage.setItem("cart", JSON.stringify(newStoreList)); // update store
    } else {
      const newStoreList = storage.map((item) => {
        if (item.cartId === product.cartId) {
          const qt = item.quantity;
          setRefresh(preVal => !preVal);
          return { ...item, quantity: qt + 1 };
        }
        return item;
      });
      const subscriptionItem = newStoreList.find(item => item.payment === 'subscription');
      const otbList = newStoreList.filter(item => item.payment === 'otb');
      if (subscriptionItem) {
        setCart([subscriptionItem, ...otbList]);
      } else {
        setCart([...otbList]);
      }
      localStorage.setItem("cart", JSON.stringify(newStoreList)); // update store
    }
  };

  const productTotal = (item) => {
    // we need to calculate total base on buy options: subscription, otb, collection
    // for moment calculate the price for subscription
    const payment = item.payment;
    if(payment === 'otb') {
      const total = item.quantity * item.product.attributes.otb_price;
      return total;
    } else if(payment === 'subscription') {
      const total = item.product.attributes.subscription_price;
      return total;
    }
  };

  function subscriptionTotal(product, coupone) {
    const price = product.product.attributes.subscription_price;
    if(coupone) {
      return  price - price * (coupone / 100);
    }
    return price;
  }

  const total = (coupone) => {
    // calculate cart total for OTB products
    let total = 0;
    cart.map((item) => {
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

  const cartManager = {
    refresh,
    cart,
    setCart,
    setRefresh,
    addProduct,
    removeProduct,
    hasProduct,
    quantityProduct,
    productTotal,
    total,
    subscriptionList,
    singlePaymentList,
    subsList,
    setSubsList,
    cartTotal,
    subscriptionTotal,
  };

  return (
    <CartContext.Provider value={{ cartManager }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
