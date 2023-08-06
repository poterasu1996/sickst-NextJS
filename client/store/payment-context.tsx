import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

const ORDER_HISTORY = "/order-histories"
const SUBSCRIPTION_ORDERS = "/subscription-orders"

import CartContext from "./cart-context";
import IHeader from "../types/RequestHeaderInterface";
import CartService from "../shared/services/cartService";
import { IOrderHistoryModel } from "../models/OrderHistory.model";
import { ISubscriptionOrderModel } from "../models/SubscriptionOrder.model";


interface IPaymentContext {
    populateOrderHistory: (data: IOrderHistoryModel) => Promise<void>,
    populateSubscriptionHistory: (data: ISubscriptionOrderModel) => Promise<void>,
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

    useEffect(() => {
        const cartStorage = localStorage.getItem('cart');
        if(cartStorage) {
            setCart(JSON.parse(cartStorage));
        }
    }, [CartService.cart])

    const toastMsg = (msg: string, status: boolean) => {
        return (
        <>
          <div className="toast-item">
            <div className="content">
                <div className="title">{status ? 'Success' : 'ERROR'}</div>
                <div className="message">{msg}</div>            
            </div>
          </div>
        </>
    )};

    function notify(message: string, status: boolean) {
        toast(toastMsg(message, status), {
            autoClose: 2000,
        });
    }

    async function populateSubscriptionHistory(subsData: ISubscriptionOrderModel) {
        if (header) {
            const newData = {
                data: {
                    ...subsData
                }
            }
            try {
                await axios.post(SUBSCRIPTION_ORDERS, newData, header);
                    // .then(() => notify('Te-ai abonat cu succes!', true));
            } catch (error) {
                console.log(error);
                notify('Plata nu a fost efectuata!', false);
            }
        }
    }

    async function populateOrderHistory(orderData: IOrderHistoryModel) {
        if (header) {
            // our data must be wrapped in a data object, in order to be sent
            const newData = {
                data: {
                    ...orderData,
                }
            }
            console.log('DATA das: ', orderData);
            try {
                await axios.post(ORDER_HISTORY, newData, header);
                    // .then(() => notify('Comanda a fost plasata cu succes!', true));
            } catch (error) {
                console.log(error);
                notify('Plata nu a fost efectuata!', false);
            }
        }
    }

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