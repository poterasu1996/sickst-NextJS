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

    const addProduct = (product) => {
        if(localStorage.getItem('cart') !== null) {
            const storageProducts = JSON.parse(localStorage.getItem('cart'));
            const newProduct = JSON.stringify([...storageProducts, product]);
            localStorage.setItem('cart', newProduct);
        } else {
            localStorage.setItem('cart', JSON.stringify([product]));
        }
        setResetCart(true);
        // setLoading(true);
    };

    const removeProduct = (product) => {

    };

    const hasProduct = () => {

    };

    const manager = {
        cart, setCart, setResetCart, addProduct, removeProduct, hasProduct
    }

    return (
        <CartContext.Provider value={manager}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;