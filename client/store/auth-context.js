import React, { useEffect, useState } from 'react';

const AuthContext =  React.createContext({});

export const AuthProvider = ({ children }) => {
    useEffect(() => {
        const storageToken = localStorage.getItem('token');
        setAuth(storageToken);
    })
    const [auth, setAuth] = useState();


    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;