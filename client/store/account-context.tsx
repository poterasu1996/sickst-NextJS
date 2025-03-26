import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./auth-context";
import { AccountStateEnums } from "../shared/enums/accountPageState.enum";
import { IUserModel } from "../models/User.model";
import {
  IGETUserDetails,
} from "../models/UserDetails.model";


// @ts-ignore
import userService from "../shared/services/userService";

interface IAccountContext {
  accountState: string;
  currentUser: IUserModel | null;
  refresh: number;
  refreshContext: () => void;
  setAccountPageState: (data: string) => void;
  userDetails: IGETUserDetails | null;
}

const AccountContext = React.createContext<IAccountContext | null>(null);

interface Props {
  children: JSX.Element;
}

export const AccountProvider = ({ children }: Props): JSX.Element => {
  const { isAuth } = useContext(AuthContext);
  const [accountState, setAccountState] = useState("subscription");
  const [currentUser, setCurrentUser] = useState<IUserModel | null>(null);
  const [userDetails, setUserDetails] = useState<IGETUserDetails | null>(null);
  const [refresh, setRefresh] = useState(0); // inform other components that context has been changed

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
    currentUser: currentUser,
    refresh: refresh,
    refreshContext: refreshContext,
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
