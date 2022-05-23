import React, { useEffect, useState } from "react";

const CartContext = React.createContext([]);

export const CartProvider = ({ children }) => {
  const [resetCart, setResetCart] = useState(false); // reset cart each time add/delete action is made
  const [cart, setCart] = useState([]); // set the cart list
  const [cartTotal, setCartTotal] = useState();

  useEffect(() => {
    const storageCart = JSON.parse(localStorage.getItem("cart"));
    if (storageCart) {
      const subscriptionItem = storageCart.find((item) => {
        return item.payment === "subscription";
      });
      const otbList = storageCart.filter((item) => {
        return item.payment === "otb";
      });
      if (subscriptionItem) {
        setCart([subscriptionItem, ...otbList]);
      } else {
        setCart([...otbList]);
      }
    }
  }, [resetCart]);

  setTimeout(() => {
    setResetCart(false);
  }, 500);

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

      setResetCart(true);
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify([{ cartId: 0, product, quantity, payment }])
      );
      setCart([{ cartId: 0, product, quantity, payment }]);
      setResetCart(true);
    }
  }

  function subscriptionList() {
    // return a list with subscription items from storage
    useEffect(() => {
      const storage = JSON.parse(localStorage.getItem("cart"));
      if(storage) {
        const list = storage.filter((item) => {
          return item.payment === "subscription";
        })
        return list;
      }
    }, [])
  }

  const removeProduct = (product) => {
    const cartList = JSON.parse(localStorage.getItem("cart"));
    // return a new list without the selected item
    const newList = cartList.filter((el) => {
      return el.cartId !== product.cartId;
    });
    if (newList.length > 0) {
      setCart(newList);
      localStorage.setItem("cart", JSON.stringify(newList)); // set new cart list with removed item
    } else {
      setCart(newList);
      localStorage.removeItem("cart"); // if list is empty, remove cart from storage
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
    const total = item.quantity * item.product.attributes.subscription_price;
    return total;
  };

  const total = (coupone) => {
    let total = 0;
    cart.map((item) => {
        if(item.payment === 'subscription') {
            total = total + item.quantity * item.product.attributes.subscription_price;
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
    cart,
    setCart,
    setResetCart,
    addProduct,
    removeProduct,
    hasProduct,
    quantityProduct,
    productTotal,
    total,
    subscriptionList,
    cartTotal,
  };

  return (
    <CartContext.Provider value={{ cartManager }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
