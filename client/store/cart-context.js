import React, { useEffect, useState } from 'react';

const CartContext = React.createContext([]);

export const CartProvider = ({ children }) => {
    const [resetCart, setResetCart] = useState(false)   // reset cart each time add/delete action is made
    const [cart, setCart] = useState([]);               // set the cart list

    useEffect(() => {
        const storageCart = JSON.parse(localStorage.getItem('cart'));
        storageCart && setCart(storageCart);
    }, [resetCart])

    setTimeout(() => {
        setResetCart(false);
    }, 500);

    function addProduct(product) {
        if(localStorage.getItem('cart') !== null) {
            const storageProducts = JSON.parse(localStorage.getItem('cart'));
            const newProduct = [...storageProducts, product];
            setCart(newProduct);
            localStorage.setItem('cart', JSON.stringify(newProduct));
        } else {
            localStorage.setItem('cart', JSON.stringify([product]));
            setCart([product]);
        }
    };

    const removeProduct = (product) => {
        const cartList = JSON.parse(localStorage.getItem('cart'));
        // return a new list without the selected item
        const newList = cartList.filter(el => {
            return el.id !== product.id;
        })
        if(newList.length > 0) {
            setCart(newList);
            localStorage.setItem('cart', JSON.stringify(newList));  // set new cart list with removed item
        } else {
            setCart(newList);
            localStorage.removeItem('cart');    // if list is empty, remove cart from storage
        }
    };

    const hasProduct = (product) => {   // place a checkmark if item is in cart list
        if(localStorage.getItem('cart') !== null) {
            const cartList = JSON.parse(localStorage.getItem('cart'));
            const exist = cartList.filter(item => product.id === item.id); 
            if(exist.length > 0) {
                return true;
            } 
            return false;
        } else {
            return false;
        }
    };

    const cartManager = {
        cart, setCart, setResetCart, addProduct, removeProduct, hasProduct
    }

    return (
        <CartContext.Provider value={{cartManager}}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;