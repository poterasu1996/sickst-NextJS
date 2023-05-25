import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import AuthContext from "./auth-context";

import IHeader from "../types/RequestHeaderInterface";
import IShippingInfo from "../types/ShippingInfo.interface";
import { AccountStateEnums } from "../shared/enums/accountPageState.enum";
import { IUserModel } from "../models/User.model";
import { IProductReviewModel } from "../models/ProductReview.model";
import { IGETUserDetails } from "../models/UserDetails.model";

interface IAccountContext {
    accountState: string,
    activateSubscription: (id: number) => Promise<void>,
    addShippingInfo: (data: IShippingInfo) => void,
    currentUser: IUserModel | null,
    fetchOrderHistory: () => Promise<any>,
    fetchShippingList: () => Promise<any>,
    likeReview: (
        userId: number, 
        reviewId: number, 
        totalLikes: number, 
        usersLikedOldList: number[] | null, 
        totalDislikes: number, 
        usersDislikedOldList: number[] | null) => void,
    dislikeReview: (
        userId: number, 
        reviewId: number, 
        totalLikes: number, 
        usersLikedOldList: number[] | null, 
        totalDislikes: number, 
        usersDislikedOldList: number[] | null) => void,
    postReview: (review: any) => void,
    refresh: number,
    refreshUserTotalReviews: (id: number, totalReviews: number) => void,
    setAccountPageState: (data: string) => void,
    userDetails: IGETUserDetails | null,
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
    const USER_DETAILS = '/user-details';
    const USERS = '/api/users'
    const SHIPPING_INFO = '/shipping-informations';
    const PRODUCT_REVIEW = '/product-reviews';
    const ORDER_HISTORIES = '/order-histories';
    const authManager = useContext(AuthContext);
    const [accountState, setAccountState] = useState<string>('subscription');
    const [currentUser, setCurrentUser] = useState<IUserModel | null>(null);
    const [userDetails, setUserDetails] = useState<IGETUserDetails | null>(null);
    const [header, setHeader] = useState<IHeader | null>(null);
    const [refresh, setRefresh] = useState<number>(0);  // inform other components that context has been changed
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
            .then(async (resp) => {
                setCurrentUser(resp.data)
                await axios.get(`${USER_DETAILS}?filters[user_id][$eq]=${resp.data.id}`, header)
                    .then((resp) => setUserDetails(resp.data.data[0]))
                    .catch(error => console.log(error))

            })
            .catch(error => console.log('axios error', error))

        }
    }, [header])

    const toastMsg = (msg: string, status: boolean) => {
        return (
        <>
          <div className="toast-item">
            <div className="content">
                <div className="title">{status ? 'Success' : 'ERROR'}</div>
                {/* <div className="title">Success</div> */}
                {/* <div className="message">An address has been changed successfully!</div>             */}
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
            try {
                const response = await axios.get(
                    `${SHIPPING_INFO}?filters[user_id][$eq]=${currentUser!.id}`, 
                    header
                )
                return response.data.data[0];
            } catch (error) {
                console.log(error);
                notify('OOPS! An error occured retrieving the list!', false);
            }
        }
    }

    async function postReview(prodReview: { data: IProductReviewModel }) {
        if(header) {
            return await axios.post(PRODUCT_REVIEW, prodReview, header)
                .then(() => {
                    notify('A review has been added successfully!', true);
                    setRefresh(refresh + 1);
                })
                .catch((error) => {
                    console.log(error);
                    notify('OOPS! An error occured adding the review!', false);
                })
        }
    }

    async function likeReview(
        userId: number, 
        revId: number, 
        totalLikes: number, 
        usersLikedOldList: number[] | null,
        totalDislikes: number, 
        usersDislikedOldList: number[] | null
        ) {
        if(header) {
            let _newData: any = {
                data: {
                    likes: 0,
                    users_liked: [],
                    dislikes: totalDislikes,
                    users_disliked: usersDislikedOldList ? [...usersDislikedOldList] : []
                }
            };
            if(usersDislikedOldList && usersDislikedOldList.find(uId => uId === userId)) {
                const undoDislike = usersDislikedOldList.filter(uId => uId !== userId);
                _newData = {
                    data: {
                        ..._newData.data,
                        dislikes: totalDislikes - 1,
                        users_disliked: [...undoDislike]
                    }
                }
            }
            if(usersLikedOldList && usersLikedOldList.find(uId => uId === userId)) {
                // if there is a list & the user already liked, undo the like
                const undoLike = usersLikedOldList.filter(uId => uId !== userId)
                _newData = {
                    data: {
                        ..._newData.data,
                        likes: totalLikes - 1,
                        users_liked: [...undoLike]
                    }
                } 
            } else {
                _newData = {
                    data: {
                        ..._newData.data,
                        likes: totalLikes + 1,
                        users_liked: usersLikedOldList ? [...usersLikedOldList, userId] : [userId],
                    }
                }
            }

            try {
                await axios.put(`${PRODUCT_REVIEW}/${revId}`, _newData, header)
                    .then(() => setRefresh(refresh + 1));
            } catch (error) {
                console.log(error);
                notify('OOPS! An error occured while updating reviews!', false);
            }            
        }
    }

    async function dislikeReview(
        userId: number, 
        revId: number, 
        totalLikes: number, 
        usersLikedOldList: number[] | null,
        totalDislikes: number, 
        usersDislikedOldList: number[] | null
    ) {
        if(header) {
            let _newData: any = {
                data: {
                    likes: totalLikes,
                    users_liked: usersLikedOldList ? [...usersLikedOldList] : [],
                    dislikes: 0,
                    users_disliked: []
                }
            };
            if(usersLikedOldList && usersLikedOldList.find(uId => uId === userId)) {
                const undoLike = usersLikedOldList.filter(uId => uId !== userId);
                _newData = {
                    data: {
                        ..._newData.data,
                        likes: totalLikes - 1,
                        users_liked: [...undoLike]
                    }
                }
            }
            if(usersDislikedOldList && usersDislikedOldList.find(uId => uId === userId)) {
                // if there is a list & the user already liked, undo the dislike
                const undoDislike = usersDislikedOldList.filter(uId => uId !== userId)
                _newData = {
                    data: {
                        ..._newData.data,
                        dislikes: totalDislikes - 1,
                        users_disliked: [...undoDislike]
                    }
                } 
            } else {
                _newData = {
                    data: {
                        ..._newData.data,
                        dislikes: totalDislikes + 1,
                        users_disliked: usersDislikedOldList ? [...usersDislikedOldList, userId] : [userId],
                    }
                }
            }
           
            try {
                await axios.put(`${PRODUCT_REVIEW}/${revId}`, _newData, header)
                    .then(() => setRefresh(refresh + 1));
            } catch (error) {
                console.log(error);
                notify('OOPS! An error occured while updating reviews!', false);
            }            
        }
    }

    async function refreshUserTotalReviews(id: number, totalReviews: number) {
        if(header) {
            const newData = {
                data: {
                    reviews: totalReviews + 1,
                }
            }
            try {
                await axios.put(`${USER_DETAILS}/${id}`, newData, header)
                    .then(() => setRefresh(refresh + 1))
            } catch (error) {
                console.log(error);
                notify('OOPS! An error occured while updating reviews!', false);
            }
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
                            notify('An address has been changed successfully!', true);
                            setRefresh(preVal => preVal++);
                        })
                        .catch(error => {
                            console.log(error)
                            notify('OOPS! An error occured while updating the list!', false);
                        });
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
                            notify('An address has been changed successfully!', true);
                            setRefresh(preVal => preVal++);
                        })
                        .catch(error => {
                            console.log(error)
                            notify('OOPS! An error occured adding the address!', false);
                        });
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
        accountState: accountState,
        activateSubscription: activateSubscription,
        addShippingInfo: addShippingInfo,
        currentUser: currentUser,
        dislikeReview: dislikeReview,
        fetchOrderHistory: fetchOrderHistory,
        fetchShippingList: fetchShippingList,
        likeReview: likeReview,
        postReview: postReview,
        refresh: refresh,
        refreshUserTotalReviews: refreshUserTotalReviews,
        setAccountPageState: setAccountPageState,
        userDetails: userDetails,
    };
    
    return (
        <AccountContext.Provider value={accountManager}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountContext;