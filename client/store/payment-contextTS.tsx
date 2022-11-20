import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import Cookies from 'js-cookie';

const PaymentContext = React.createContext([]);
const USER_URL = "/users/me";
const USER_DETAILS = "/user-details"
const ORDER_HISTORY = "/order-histories"

import CartContext from "./cart-context";
import AuthContext from "./auth-context";
import IHeader from "../types/RequestHeaderInterface";

type Props = {
    children: JSX.Element
}

export const PaymentProvider = ({ children }: Props) => {
    const cartManager = useContext(CartContext);
    const authManager = useContext(AuthContext);
    const [header, setHeader] = useState<IHeader | null>(null);
    const [cart, setCart] = useState();
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        const cartStorage = localStorage.getItem('cart');
        if(authManager!.auth) {
            const head = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${authManager!.auth}`,
                }
            }
            setHeader(head);
        }
        if(cartStorage) {
            setCart(JSON.parse(cartStorage));
        }
    }, [])


    async function getCurrentUser() {
        if(header) {
            return axios.get(USER_URL, header)
                .then(resp => {
                    return resp.data;
                })
                .catch(error => {
                    console.log(error)
                })
        }
        return null;
    }
    

    // async function test() {
    //     if(cart) {

    //         console.log('cart: ', cart)
    //     }
        
    // }

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