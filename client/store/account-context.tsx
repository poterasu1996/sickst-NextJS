import React, { Dispatch, useContext, useEffect, useState } from "react";
import AuthContext from "./auth-context";
import IHeader from "../types/RequestHeaderInterface";
import { AccountStateEnums } from "../shared/enums/accountPageState.enum";
import { IUserModel } from "../models/User.model";
import { IProductReviewModel } from "../models/ProductReview.model";
import {
  IGETUserDetails,
  IUserDetailsModel,
} from "../models/UserDetails.model";
import {
  IShippingInfo,
  IShippingInformationModel,
} from "../models/ShippingInformation.model";
import { IGETOrderHistory } from "../models/OrderHistory.model";
import { IGETSubscriptionOrder } from "../models/SubscriptionOrder.model";
import axios from "axios";
import { USER_PROFILE_DETAILS, USER_ME, API_V } from "../shared/utils/constants";
import { AppUtils } from "../shared/utils/app.utils";

// @ts-ignore
import Cookies from 'js-cookie';
import userService from "../shared/services/userService";

interface IAccountContext {
  accountState: string;
  // activateSubscription: (id: number) => Promise<void>;
  // addPersonalInfo: (data: IUserDetailsModel, piID: number) => void;
  // addShippingInfo: (data: IShippingInfo) => void;
  // cancelSubscription: (
  //   subId: number,
  //   subOrder: IGETSubscriptionOrder | null
  // ) => void;
  currentUser: IUserModel | null;
  dislikeReview: (
    userId: number,
    reviewId: number,
    totalLikes: number,
    usersLikedOldList: number[] | null,
    totalDislikes: number,
    usersDislikedOldList: number[] | null
  ) => void;
  // editShippingAddress: (
  //   siIndex: number,
  //   newData: { data: IShippingInformationModel }
  // ) => void;
  // fetchShippingList: () => Promise<any>;
  likeReview: (
    userId: number,
    reviewId: number,
    totalLikes: number,
    usersLikedOldList: number[] | null,
    totalDislikes: number,
    usersDislikedOldList: number[] | null
  ) => void;
  postReview: (review: any) => void;
  refresh: number;
  refreshUserTotalReviews: (id: number, totalReviews: number) => void;
  refreshContext: () => void;
  setAccountPageState: (data: string) => void;
  setRefresh: Dispatch<React.SetStateAction<number>>;
  userDetails: IGETUserDetails | null;
}

const AccountContext = React.createContext<IAccountContext | null>(null);

interface Props {
  children: JSX.Element;
}

export const AccountProvider = ({ children }: Props): JSX.Element => {
  const USERS_ME_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${USER_ME}`;
  const USER_DETAILS_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${USER_PROFILE_DETAILS}`;
  const SHIPPING_INFO_URL = "/shipping-informations";

  const USERS = "/api/users";
  const SUBSCRIPTION_ORDER = "/subscription-orders";
  const PRODUCT_REVIEW = "/product-reviews";
  const CANCELLED_ORDERS = "/cancelled-orders";
  const CANCELLED_SUBSCRIPTIONS = "/cancelled-subscriptions";
  const ORDER_HISTORIES = "/order-histories";
  const { isAuth } = useContext(AuthContext);
  const [accountState, setAccountState] = useState("subscription");
  const [currentUser, setCurrentUser] = useState<IUserModel | null>(null);
  const [userDetails, setUserDetails] = useState<IGETUserDetails | null>(null);
  const [refresh, setRefresh] = useState(0); // inform other components that context has been changed

  // will be removed
  const [header, setHeader] = useState<IHeader | null>(null); // de scos
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

  const getUserMe = async () => {
    const userMe: IUserModel = await userService.getUsersMe();
    setCurrentUser(userMe);
    getUserDetails(userMe.id);
  }

  const getUserDetails = async (uID: number) => {
    if(uID) {
      const userDetails = await userService.getUserDetails(uID);
      setUserDetails(userDetails.data[0]);
    }
  }

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (isAuth && jwt) {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwt}`,
        },
      };
      setHeader(headers);
      getUserMe();
    }
  }, [isAuth]);

  useEffect(() => {
    // fetch user details on login and for each personal data change
    if(isAuth && currentUser?.id) {
      getUserDetails(currentUser.id);
    }
  }, [isAuth, refresh])

  const refreshContext = () => {
    setRefresh(prevState => prevState + 1);
  }

  // must be moved to service
  // async function activateSubscription(userId: number) {
  //   if (!header) return;
  //   await axios
  //     .put(`${USERS}/${userId}`, { subscribed: true }, header)
  //     .catch((error) => console.log(error));
  // }

  // must be moved to service
  // async function fetchShippingList() {
  //   // get current user shipping list
  //   if (!header) return;
  //   try {
  //     const response = await axios.get(
  //       `${SHIPPING_INFO_URL}?filters[user_id][$eq]=${currentUser!.id}`,
  //       header
  //     );
  //     return response.data.data[0];
  //   } catch (error: any) {
  //     console.log(error);
  //     if(error.response.status !== 404) {
  //       AppUtils.toastNotification("OOPS! An error occured retrieving shipping list!", false);
  //     }
  //   }
  // }

  // must be moved to service
  // async function editShippingAddress(
  //   siIndex: number,
  //   siNewData: { data: IShippingInformationModel }
  // ) {
  //   // used for set primary / edit / delete address
  //   if (!header) return;
  //   try {
  //     await axios
  //       .put(`${SHIPPING_INFO_URL}/${siIndex}`, siNewData, header)
  //       .then(() => {
  //         AppUtils.toastNotification("Adresa a fost modificata cu succes!", true);
  //         setRefresh(refresh + 1);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     AppUtils.toastNotification("OOPS! An error occured while deleting the address!", false);
  //   }
  // }

  // must be moved to service
  // async function cancelSubscription(
  //   subscriptionId: number,
  //   subscriptionOrder: IGETSubscriptionOrder | null
  // ) {
  //   // de odificat la fel ca cea de sus
  //   if (header && subscriptionOrder) {
  //     const { createdAt, publishedAt, updatedAt, ...data } =
  //       subscriptionOrder["attributes"];
  //     const cancelData = {
  //       data: {
  //         ...data,
  //         is_cancelled: true,
  //       },
  //     };
  //     const cancelledSubscription = {
  //       data: {
  //         user_id: subscriptionOrder.attributes.user_id,
  //         subscription_order: [subscriptionOrder.id],
  //       },
  //     };

  //     try {
  //       await axios
  //         .post(CANCELLED_SUBSCRIPTIONS, cancelledSubscription, header)
  //         .then(() => {
  //           axios.put(
  //             `${SUBSCRIPTION_ORDER}/${subscriptionId}`,
  //             cancelData,
  //             header
  //           );
  //           AppUtils.toastNotification("Te-ai dezabonat cu succes!", true);
  //           setRefresh(refresh + 1);
  //         });
  //     } catch (error) {
  //       console.log(error);
  //       AppUtils.toastNotification(
  //         "OOPS! An error occured while canceling the subscription!",
  //         false
  //       );
  //     }
  //   }
  // }

  // must be moved to service
  async function postReview(prodReview: { data: IProductReviewModel }) {
    if (!header) return;
    return await axios
      .post(PRODUCT_REVIEW, prodReview, header)
      .then(() => {
        AppUtils.toastNotification("A review has been added successfully!", true);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
        AppUtils.toastNotification("OOPS! An error occured adding the review!", false);
      });
  }

  // must be moved to service
  async function likeReview(
    userId: number,
    revId: number,
    totalLikes: number,
    usersLikedOldList: number[] | null,
    totalDislikes: number,
    usersDislikedOldList: number[] | null
  ) {
    if (!header) return;
    let _newData: any = {
      data: {
        likes: 0,
        users_liked: [],
        dislikes: totalDislikes,
        users_disliked: usersDislikedOldList ? [...usersDislikedOldList] : [],
      },
    };
    if (
      usersDislikedOldList &&
      usersDislikedOldList.find((uId) => uId === userId)
    ) {
      const undoDislike = usersDislikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          dislikes: totalDislikes - 1,
          users_disliked: [...undoDislike],
        },
      };
    }
    if (usersLikedOldList && usersLikedOldList.find((uId) => uId === userId)) {
      // if there is a list & the user already liked, undo the like
      const undoLike = usersLikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          likes: totalLikes - 1,
          users_liked: [...undoLike],
        },
      };
    } else {
      _newData = {
        data: {
          ..._newData.data,
          likes: totalLikes + 1,
          users_liked: usersLikedOldList
            ? [...usersLikedOldList, userId]
            : [userId],
        },
      };
    }

    try {
      await axios
        .put(`${PRODUCT_REVIEW}/${revId}`, _newData, header)
        .then(() => setRefresh(refresh + 1));
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification("OOPS! An error occured while updating reviews!", false);
    }
  }

  // must be moved to service
  async function dislikeReview(
    userId: number,
    revId: number,
    totalLikes: number,
    usersLikedOldList: number[] | null,
    totalDislikes: number,
    usersDislikedOldList: number[] | null
  ) {
    if (!header) return;
    let _newData: any = {
      data: {
        likes: totalLikes,
        users_liked: usersLikedOldList ? [...usersLikedOldList] : [],
        dislikes: 0,
        users_disliked: [],
      },
    };
    if (usersLikedOldList && usersLikedOldList.find((uId) => uId === userId)) {
      const undoLike = usersLikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          likes: totalLikes - 1,
          users_liked: [...undoLike],
        },
      };
    }
    if (
      usersDislikedOldList &&
      usersDislikedOldList.find((uId) => uId === userId)
    ) {
      // if there is a list & the user already liked, undo the dislike
      const undoDislike = usersDislikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          dislikes: totalDislikes - 1,
          users_disliked: [...undoDislike],
        },
      };
    } else {
      _newData = {
        data: {
          ..._newData.data,
          dislikes: totalDislikes + 1,
          users_disliked: usersDislikedOldList
            ? [...usersDislikedOldList, userId]
            : [userId],
        },
      };
    }

    try {
      await axios
        .put(`${PRODUCT_REVIEW}/${revId}`, _newData, header)
        .then(() => setRefresh(refresh + 1));
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification("OOPS! An error occured while updating reviews!", false);
    }
  }

  // must be moved to service
  async function refreshUserTotalReviews(id: number, totalReviews: number) {
    if (!header) return;
    const newData = {
      data: {
        reviews: totalReviews + 1,
      },
    };
    try {
      await axios
        .put(`${USER_PROFILE_DETAILS}/${id}`, newData, header)
        .then(() => setRefresh(refresh + 1));
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification("OOPS! An error occured while updating reviews!", false);
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
    // activateSubscription: activateSubscription,
    // addPersonalInfo: addPersonalInfo,
    // addShippingInfo: addShippingInfo,
    // cancelSubscription: cancelSubscription,
    currentUser: currentUser,
    dislikeReview: dislikeReview,
    // editShippingAddress: editShippingAddress,
    // fetchShippingList: fetchShippingList,
    likeReview: likeReview,
    postReview: postReview,
    refresh: refresh,
    refreshContext: refreshContext,
    refreshUserTotalReviews: refreshUserTotalReviews,
    setAccountPageState: setAccountPageState,
    setRefresh: setRefresh,
    userDetails: userDetails,
  };

  return (
    <AccountContext.Provider value={accountManager}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
