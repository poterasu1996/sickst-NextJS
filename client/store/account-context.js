import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import AuthContext from "./auth-context";
const AccountContext = React.createContext([]);

export const AccountProvider = ({ children }) => {
    const USER_ME = '/users/me';
    const SHIPPING_INFO = '/shipping-informations';
    const ORDER_HISTORIES = '/order-histories';
    const { auth } = useContext(AuthContext);
    const [accountState, setAccountState] = useState('subscription');
    const [currentUser, setCurrentUser] = useState(null);
    const [header, setHeader] = useState(null);
    const [refresh, setRefresh] = useState(false);  // inform other components that context has been changed
    // const accState = [
    //     'subscription', 
    //     'orderHistory', 
    //     'billingInfo', 
    //     'shippingInfo', 
    //     'reviews', 
    //     'ratedProducts', 
    //     'personalInfo', 
    //     'resetPassword'
    // ];

    useEffect(() => {
        if(auth) {
            const head = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${auth}`,
                }
            }
            setHeader(head);
        }
    }, [auth])

    useEffect(() => {
        if (header) {
            axios.get(USER_ME, header)
            .then((resp) => {
                setCurrentUser(resp.data)
            })
            .catch(error => console.log('axios error', error))
        }
    }, [header])

    const toastMsg = (
        <>
          <div className="toast-item">
            <div className="content">
                <div className="title">Success</div>
                <div className="message">An address has been changed successfully!</div>            
            </div>
          </div>
        </>
    );

    // async function getOneShippingInfo() {
    //     return axios.get(`${SHIPPING_INFO}/2`, header)
    //         .then(resp => {
    //             return resp.data
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })
    // }

    function notify() {
        toast(toastMsg, {
            autoClose: 2000,
        });
    }

    async function fetchOrderHistory() {
        if(header) {
            const response = await axios.get(
                ORDER_HISTORIES,
                header
            )
            const filteredList = response.data.data.filter(el => el.attributes.user_id === currentUser.id);
            return filteredList;
        }
    }

    async function fetchShippingList() {
        // get current user shipping list
        if(header) {
            const response = await axios.get(
                `${SHIPPING_INFO}?filters[user_id][$eq]=${currentUser.id}`, 
                header
            )
            return response.data.data;
        }
    }

    function addShippingInfo(newData) {
        if(header) {
            // check if there already exist a list for current user

            // what is thisss ??????
            // const list = [];
            // fetchShippingList().then(resp => {
            //     if(resp) {
            //         const responseArr = resp[0].attributes.shipping_info_list;
            //         responseArr.map(el => {
            //             list.push(el);
            //         })
            //     }
            //     console.log('LIST in then=', list)
            //     console.log('LIST LENGTH in then: ', list.length);
            // })
            // console.log('LIST AFARA then=', list)
            // console.log('LIST LENGTH AFARA then=', list.length)
            
            let data = [];  // used for existing list
            let listId; // get the list id
            const newList = {};
            fetchShippingList().then(resp => {
                // if user has data, PUT
                if(resp.length > 0) {
                    listId = resp[0].id;    // get listId for PUT req
                    const responseArr = [...resp[0].attributes.shipping_info_list];
                    responseArr.map(el => {
                        data.push({
                            ...el
                        });
                    })

                    // if the user adds a primary address
                    if(newData.primary) {
                        const hasPrimary = (el) => el.primary;  
                        const isPrimary = data.findIndex(hasPrimary); 
                        if(isPrimary > -1) {
                            // if a primary address exists, change it to false
                            data[isPrimary].primary = false;
                            const newAddress = {
                                ...newData
                            }
                            data.unshift(newAddress);
                            newList = {
                                data: {
                                    shipping_info_list: [
                                        ...data
                                    ],
                                    user_id: currentUser.id
                                }
                            }
                        } 
                    } else {
                        // if user doesnt add a primary address
                        const newAddress = {
                            ...newData
                        }
                        data.push(newAddress);
                        newList = {
                            data: {
                                shipping_info_list: [
                                    ...data
                                ],
                                user_id: currentUser.id
                            }
                        }
                    }
                    axios.put(
                        `${SHIPPING_INFO}/${listId}`, 
                        newList, 
                        header)
                        .then(resp => {
                            notify();
                            setRefresh(preVal => !preVal);
                        })
                        .catch(error => console.log(error));
                } else {
                    // if user has no data, POST
                    newList = {
                        data: {
                            shipping_info_list: [{
                                ...newData
                            }],
                            user_id: currentUser.id,
                        }
                    };
                    return axios.post(SHIPPING_INFO, newList, header)
                        .then(resp => {
                            console.log(resp);
                            notify();
                            setRefresh(preVal => !preVal);
                        })
                        .catch(error => console.log(error));
                }
            })
        }
    }

    function setAccountPageState(state) {
        // set the general account state
        // based on this state, info will be showed in the account page
        switch (state) {
            case 'subscription':
                setAccountState('subscription');
                break;
            case 'orderHistory':
                setAccountState('orderHistory');
                break;
            case 'billingInfo':
                setAccountState('billingInfo');
                break;
            case 'shippingInfo':
                setAccountState('shippingInfo');
                break;
            case 'reviews':
                setAccountState('reviews');
                break;
            case 'ratedProducts':
                setAccountState('ratedProducts');
                break;
            case 'personalInfo':
                setAccountState('personalInfo');
                break;
            case 'resetPassword':
                setAccountState('resetPassword');
                break;
            default:
                setAccountState('default');
        }
    }

    const accountManager = {
        refresh,
        setAccountPageState,
        accountState,
        currentUser,
        fetchShippingList,
        addShippingInfo,
        fetchOrderHistory,
    };
    
    return (
        <AccountContext.Provider value={{ accountManager }}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountContext;