import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import AuthContext from "./auth-context";

import IHeader from "../types/RequestHeaderInterface";
import ICurrentUser from "../types/CurrentUser.interface";
import IShippingInfo from "../types/ShippingInfo.interface";
import { AccountStateEnums } from "../shared/enums/accountPageState.enum";

interface IAccountContext {
    refresh: boolean,
    setAccountPageState: (data: string) => void,
    accountState: string,
    currentUser: ICurrentUser | null,
    fetchShippingList: () => Promise<any>,
    addShippingInfo: (data: IShippingInfo) => void,
    fetchOrderHistory: () => Promise<any>,
    activateSubscription: (id: number) => Promise<void>,
}

const AccountContext = React.createContext<IAccountContext | null>(null);

// type ShippingList = {
//     attributes: {
//         createdAt: string,
//         publishedAt: string,
//         shipping_info_list: IShippingInfo[] | null,
//         updatedAt: string,
//         user_id: number
//     },
//     id: number
// }

type Props = {
    children: JSX.Element
}

export const AccountProvider = ({ children }: Props): JSX.Element => {
    const USER_ME = '/users/me';
    const USERS = '/api/users'
    const SHIPPING_INFO = '/shipping-informations';
    const ORDER_HISTORIES = '/order-histories';
    const authManager = useContext(AuthContext);
    const [accountState, setAccountState] = useState<string>('subscription');
    const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
    const [header, setHeader] = useState<IHeader | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);  // inform other components that context has been changed
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
        if(authManager!.auth) {
            const head = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${authManager?.auth}`,
                }
            }
            setHeader(head);
        }
    }, [authManager!.auth])

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

    function notify() {
        toast(toastMsg, {
            autoClose: 2000,
        });
    }

    async function activateSubscription(userId: number) {
        if(header) {
            await axios.put(`${USERS}/${userId}`, { subscribed: true } , header)
                .catch(error => console.log(error))
        }
    }

    async function fetchOrderHistory() {
        if(header) {
            const response = await axios.get(
                ORDER_HISTORIES,
                header
            )
            const filteredList = response.data.data.filter((el: any) => el.attributes.user_id === currentUser!.id);
            return filteredList;
        }
    }

    async function fetchShippingList() {
        // get current user shipping list
        if(header) {
            const response = await axios.get(
                `${SHIPPING_INFO}?filters[user_id][$eq]=${currentUser!.id}`, 
                header
            )
            return response.data.data[0];
        }
    }

    function addShippingInfo(newData: IShippingInfo) {
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
            
            let existingList: any = [];  // used for existing list
            let listId; // get the list id
            let newList = {};
            fetchShippingList().then(resp => {
                console.log('resp: ',resp)
                // if user has data, PUT
                if(resp) {
                    listId = resp.id;    // get listId for PUT req
                    existingList = [...resp.attributes.shipping_info_list];

                    // if the user adds a primary address
                    if(newData.primary) {
                        const hasPrimary = (el: any) => el.primary; 
                        const primaryAddressIndex = existingList.findIndex(hasPrimary); 
                        if(primaryAddressIndex > -1) {
                            // if a primary address exists, change it to false
                            existingList[primaryAddressIndex].primary = false;
                            const newAddress = {
                                ...newData
                            }
                            existingList.unshift(newAddress);
                            newList = {
                                data: {
                                    shipping_info_list: [
                                        ...existingList
                                    ],
                                    user_id: currentUser!.id
                                }
                            }
                        } 
                    } else {
                        // if user doesnt add a primary address
                        const newAddress = {
                            ...newData
                        }
                        existingList.push(newAddress);
                        newList = {
                            data: {
                                shipping_info_list: [
                                    ...existingList
                                ],
                                user_id: currentUser!.id
                            }
                        }
                    }
                    axios.put(
                        `${SHIPPING_INFO}/${listId}`, 
                        newList, 
                        header)
                        .then(() => {
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
                            user_id: currentUser!.id,
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

    function setAccountPageState(state: string) {
        // set the general account state
        // based on this state, info will be showed in the account page
        switch (state) {
            case AccountStateEnums.SUBSCRIPTION:
                setAccountState(AccountStateEnums.SUBSCRIPTION);
                break;
            case AccountStateEnums.ORDER_HISTORY:
                setAccountState(AccountStateEnums.ORDER_HISTORY);
                break;
            case AccountStateEnums.BILLING_INFO:
                setAccountState(AccountStateEnums.BILLING_INFO);
                break;
            case AccountStateEnums.SHIPPING_INFO:
                setAccountState(AccountStateEnums.SHIPPING_INFO);
                break;
            case AccountStateEnums.REVIEWS:
                setAccountState(AccountStateEnums.REVIEWS);
                break;
            case AccountStateEnums.RATED_PRODUCTS:
                setAccountState(AccountStateEnums.RATED_PRODUCTS);
                break;
            case AccountStateEnums.PERSONAL_INFO:
                setAccountState(AccountStateEnums.PERSONAL_INFO);
                break;
            case AccountStateEnums.RESET_PASSWORD:
                setAccountState(AccountStateEnums.RESET_PASSWORD);
                break;
            default:
                setAccountState(AccountStateEnums.SUBSCRIPTION);
        }
    }

    const accountManager: IAccountContext = {
        refresh: refresh,
        setAccountPageState: setAccountPageState,
        accountState: accountState,
        currentUser: currentUser,
        fetchShippingList: fetchShippingList,
        addShippingInfo: addShippingInfo,
        fetchOrderHistory: fetchOrderHistory,
        activateSubscription: activateSubscription,
    };
    
    return (
        <AccountContext.Provider value={accountManager}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountContext;