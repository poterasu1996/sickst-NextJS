import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import Cookies from 'js-cookie';

const PaymentContext = React.createContext([]);
const USER_URL = "/users/me";
const USER_DETAILS = "/user-details"
const ORDER_HISTORY = "/order-histories"

import CartContext from "./cart-context";

export const PaymentProvider = ({ children }) => {
    const cartManager = useContext(CartContext);
    const [header, setHeader] = useState();
    const [cart, setCart] = useState();
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        const jwt = Cookies.get('jwt');
        const cartStorage = localStorage.getItem('cart');
        if(jwt) {
            const head = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${jwt}`,
                }
            }
            setHeader(head);
        }
        if(cartStorage) {
            setCart(JSON.parse(cartStorage));
        }
    }, [])


    async function getCurrentUser() {
        try {
            let {data} = await axios.get(USER_URL, header);
            return data;
        } catch (error) {
            console.log(error)
        }
    }
    

    async function test() {
        if(cart) {

            console.log('cart: ', cart)
        }
        
    }

    async function populateOrderHistory(data) {
        if(data) {
            if(header) {
                const currentUser = await getCurrentUser();
                const newData = {
                    data: {
                        ...data,
                        user_id: currentUser.id,
                    }
                }
                return axios.post(ORDER_HISTORY, newData, header).then(resp => {
                    console.log(resp)
                });
            }
        }
        return;
    }

    function removePaymentProducts() {
        if(cart) {
            if(!cart.find(item => item.paymeny !== 'otb')) {
                localStorage.removeItem('cart');
                cartManager.setRefresh(preVal => !preVal);
            } else {
                const newCart = cart.filter(item => {
                   return item.payment !== 'otb';
                });
                localStorage.setItem('cart', JSON.stringify(newCart));
                cartManager.setRefresh(preVal => !preVal);
            }
        }
    }

    const paymentManager = {    
        test,
        populateOrderHistory,
        removePaymentProducts
    }

    return (
        <PaymentContext.Provider value={{ paymentManager }}>
            {children}
        </PaymentContext.Provider>
    )
}

export default PaymentContext;