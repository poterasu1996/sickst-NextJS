import React, { useEffect, useState } from 'react';

const AuthContext =  React.createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState();
    useEffect(() => {
        const storageToken = localStorage.getItem('jwt');
        setAuth(storageToken);
    }, [])

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;