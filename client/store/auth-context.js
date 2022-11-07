import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext =  React.createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState();
    useEffect(() => {
        const cookie = Cookies.get('jwt');
        setAuth(cookie);
    }, [])

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;