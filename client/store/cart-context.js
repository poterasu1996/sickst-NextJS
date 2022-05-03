import React, { useEffect, useState } from 'react';

const CartContext = React.createContext([]);

export const CartProvider = ({ children }) => {
    const [resetCart, setResetCart] = useState(false)
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storageCart = JSON.parse(localStorage.getItem('cart'));
        storageCart && setCart(storageCart);
    }, [resetCart])

    setTimeout(() => {
        setResetCart(false);
    }, 500);

    return (
        <CartContext.Provider value={{cart, setCart, setResetCart}}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;