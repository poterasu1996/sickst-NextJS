import React, { useState } from "react";

const AccountContext = React.createContext([]);

export const AccountProvider = ({ children }) => {
    const [accountState, setAccountState] = useState('subscription');

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
    };
    
    return (
        <AccountContext.Provider value={{ accountManager }}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountContext;