import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import Cookies from 'js-cookie';

const ORDER_HISTORY = "/order-histories"
const SUBSCRIPTION_ORDERS = "/subscription-orders"

import CartContext from "./cart-context";
import IHeader from "../types/RequestHeaderInterface";
import { IPOSTOrderHistory, IPOSTSubscriptionHistory } from "../types/OrderHystory.interface";
import CartService from "../shared/services/cartService";


interface IPaymentContext {
    populateOrderHistory: (data: IPOSTOrderHistory) => Promise<void>,
    populateSubscriptionHistory: (data: IPOSTSubscriptionHistory) => Promise<void>,
}

type Props = {
    children: JSX.Element
}

const PaymentContext = React.createContext<IPaymentContext | null>(null);

export const PaymentProvider = ({ children }: Props): JSX.Element => {
    const cartManager = useContext(CartContext);
    const [header, setHeader] = useState<IHeader>(() => {
        const jwt = Cookies.get('jwt');
        return {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${jwt}`,
            }
        }
    });
    const [cart, setCart] = useState();
    // const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const cartStorage = localStorage.getItem('cart');
        if(cartStorage) {
            setCart(JSON.parse(cartStorage));
        }
    }, [CartService.cart])

    // async function getCurrentUser() {
    //     if(header) {
    //         return axios.get(USER_URL, header)
    //             .then(resp => {
    //                 return resp.data;
    //             })
    //             .catch(error => {
    //                 console.log(error)
    //             })
    //     }
    //     return null;
    // }
    
    async function populateSubscriptionHistory(subsData: IPOSTSubscriptionHistory) {
        if (header) {
            const newData = {
                data: {
                    ...subsData
                }
            }
            try {
                axios.post(SUBSCRIPTION_ORDERS, newData, header);
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function populateOrderHistory(orderData: IPOSTOrderHistory) {
        if (header) {
            // our data must be wrapped in a data object, in order to be sent
            const newData = {
                data: {
                    ...orderData,
                }
            }
            console.log('DATA das: ', orderData);
            try {
                axios.post(ORDER_HISTORY, newData, header);
            } catch (error) {
                console.log(error);
            }
        }
    }

    // function removePaymentProducts() {
    //     if(cart) {
    //         if(!cart.find(item => item.paymeny !== 'otb')) {
    //             localStorage.removeItem('cart');
    //             cartManager.setRefresh(preVal => !preVal);
    //         } else {
    //             const newCart = cart.filter(item => {
    //                return item.payment !== 'otb';
    //             });
    //             localStorage.setItem('cart', JSON.stringify(newCart));
    //             cartManager.setRefresh(preVal => !preVal);
    //         }
    //     }
    // }

    const paymentManager: IPaymentContext = {    
        populateOrderHistory: populateOrderHistory,
        populateSubscriptionHistory: populateSubscriptionHistory,
    }

    return (
        <PaymentContext.Provider value={paymentManager}>
            {children}
        </PaymentContext.Provider>
    )
}

export default PaymentContext;