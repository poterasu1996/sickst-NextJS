import React, { useEffect, useState } from "react";

const AccountContext = React.createContext([]);

export const AccountProvider = ({ children }) => {
    const [headerDDLink, setHeaderDDLink] = useState(null);

    function resetStates() {
        setHeaderDDLink(null);

        return;
    }

    const accountManager = {
        headerDDLink,
        setHeaderDDLink,
        resetStates
    };

    console.log('accountcontext - headerDDLInk', headerDDLink)
    
    return (
        <AccountContext.Provider value={{ accountManager }}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountContext;