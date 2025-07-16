import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./auth-context";
import { IUserModel } from "../models/User.model";
import {
  IGETUserDetails,
} from "../models/UserDetails.model";
import { AccountTabViews } from "../types/account";


// @ts-ignore
import userService from "../services/userService";

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
      case AccountTabViews.SUBSCRIPTION:
        setAccountState(AccountTabViews.SUBSCRIPTION);
        break;
      case AccountTabViews.ORDER_HISTORY:
        setAccountState(AccountTabViews.ORDER_HISTORY);
        break;
      case AccountTabViews.BILLING_INFO:
        setAccountState(AccountTabViews.BILLING_INFO);
        break;
      case AccountTabViews.SHIPPING_INFO:
        setAccountState(AccountTabViews.SHIPPING_INFO);
        break;
      case AccountTabViews.REVIEWS:
        setAccountState(AccountTabViews.REVIEWS);
        break;
      case AccountTabViews.RATED_PRODUCTS:
        setAccountState(AccountTabViews.RATED_PRODUCTS);
        break;
      case AccountTabViews.PERSONAL_INFO:
        setAccountState(AccountTabViews.PERSONAL_INFO);
        break;
      case AccountTabViews.RESET_PASSWORD:
        setAccountState(AccountTabViews.RESET_PASSWORD);
        break;
      default:
        setAccountState(AccountTabViews.SUBSCRIPTION);
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
