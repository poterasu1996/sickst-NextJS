import { useEffect, useState } from "react";
import CartService from "../../../shared/services/cartService";

type Listener = () => void;

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const useCart = () => {
  const [cartLength, setCartLength] = useState(() => CartService.getCartLength());
  const [cartItems, setCartItems] = useState(() => CartService.cart);

  useEffect(() => {
    const onChange = () => {
        setCartLength(CartService.getCartLength());
        setCartItems([...CartService.cart]);
    };

    listeners.add(onChange);
    return () => {
        listeners.delete(onChange);
    }
  }, [])

  return {
    cartLength,
    cartItems,
  };
};

// Call this whenever you update the cart
export const updateCart = () => {
  notify(); // triggers all subscribers
};