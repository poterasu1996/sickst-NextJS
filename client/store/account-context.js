import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import AuthContext from "./auth-context";

const AccountContext = React.createContext([]);

export const AccountProvider = ({ children }) => {
    const USER_ME = '/users/me';
    const SHIPPING_INFO = '/shipping-informations';
    const [accountState, setAccountState] = useState('subscription');
    const [currentUser, setCurrentUser] = useState(null);
    const [header, setHeader] = useState();
    const [refresh, setRefresh] = useState(false);
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
        const jwt = localStorage.getItem('jwt');
        if(jwt) {
            const head = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${jwt}`,
                }
            }
            setHeader(head);
        }
    }, [])

    useEffect(() => {
        if (header) {
            axios.get(USER_ME, header)
            .then((resp) => {
                setCurrentUser(resp.data)
            })
            .catch(error => console.log('axios error', error))
        }
    }, [header])

    setTimeout(() => {
        if(refresh) {
            setRefresh(preVal => !preVal);
        }
    }, 200);

    // async function getOneShippingInfo() {
    //     return axios.get(`${SHIPPING_INFO}/2`, header)
    //         .then(resp => {
    //             return resp.data
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })
    // }

    async function getShippingList() {
        // get current user shipping list
        if(header) {
            const response = await axios.get(
                `${SHIPPING_INFO}?filters[user_id][$eq]=${currentUser.id}`, 
                // const response = await axios.get(`${SHIPPING_INFO}`, {
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
            // getShippingList().then(resp => {
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
            
            let data = [];
            let listId; // get the list id
            getShippingList().then(resp => {
                // if user has data
                if(resp.length > 0) {
                    listId = resp[0].id;
                    const responseArr = [...resp[0].attributes.shipping_info_list];
                    // console.log('respArr: ', responseArr)
                    responseArr.map(el => {
                        data.push({
                            ...el
                        });
                    })

                    // if the user adds a primary address
                    if(newData.primary) {
                        const hasPrimary = (el) => el.primary;  
                        const isPrimary = data.findIndex(hasPrimary) 
                        // if a primary address exists, change it to false
                        if(isPrimary > -1) {
                            data[isPrimary].primary = false;
                            const newAddress = {
                                ...newData
                            }
                            data.unshift(newAddress);
    
                            const newList = {
                                data: {
                                    shipping_info_list: [
                                        ...data
                                    ],
                                    user_id: currentUser.id
                                }
                            }
                            console.log('nwData: ', newList)
                            axios.put(
                                `${SHIPPING_INFO}/${listId}`, 
                                newList, 
                                header)
                                .then(resp => {
                                    setRefresh(true)
                                    
                                })
                                .catch(error => console.log(error));
                        } else {
                            // if no primary address exists, add the new address
                            const newAddress = {
                                ...newData
                            }
                            data.push(newAddress);
                            const newList = {
                                data: {
                                    shipping_info_list: [
                                        ...data
                                    ],
                                    user_id: currentUser.id
                                }
                            }
                            console.log('newData= ', newList)
                            axios.put(
                                `${SHIPPING_INFO}/${listId}`, 
                                newList, 
                                header)
                                .then(resp => console.log(resp))
                                .catch(error => console.log(error));
                        }
                    } else {
                        // if user doesnt add a primary address

                    }
                } else {
                    // if user has no data
                    const newList = {
                        data: {
                            shipping_info_list: [
                                ...newData
                            ],
                            user_id: currentUser.id,
                        }
                    }
                    console.log('newData: ', newList);
                    return axios.post(SHIPPING_INFO, newList, header)
                        .then(resp => console.log(resp))
                        .catch(error => console.log(error))
                }

                // console.log('data: ', data)
            })

            // if(shippingList.length) {
            //     // facem put
            //     console.log('data:', data)
            //     // setShippingList(prevState => prevState.push(data))
            //     console.log('IN IF', shippingList)
            //     // const listId = shippingList.id; 
            //     // const shipping_info_list = [...shippingList.attributes.shipping_info_list]
            //     // shippingList = [...data];
            //     // console.log('NEW LIST: ')
            // } else {
            //     // facem post
            //     console.log("in else")
            // }
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
        setAccountPageState,
        accountState,
        currentUser,
        getShippingList,
        addShippingInfo,
    };
    
    return (
        <AccountContext.Provider value={{ accountManager }}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountContext;