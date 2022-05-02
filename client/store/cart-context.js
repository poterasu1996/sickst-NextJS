import React, { useEffect, useState } from 'react';

const CartContext = React.createContext([]);

export const CartProvider = ({ children }) => {
    useEffect(() => {
        const storageCart = localStorage.getItem('cart');
        setCart(storageCart);
    })
    const [cart, setCart] = useState([]);

    return (
        <CartContext.Provider value={{cart, setCart}}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;