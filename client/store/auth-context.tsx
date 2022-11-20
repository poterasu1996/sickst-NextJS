import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface IAuthContext {
    auth: string | null;
    setAuth: Dispatch<SetStateAction<string | null>>
}

const AuthContext =  React.createContext<IAuthContext>({auth: null, setAuth: () => null});

type Props = {
    children: JSX.Element
}

export const AuthProvider = ({ children }: Props): JSX.Element => {
    const [auth, setAuth] = useState<string | null>(null);
    useEffect(() => {
        const cookie = Cookies.get('jwt');
        setAuth(cookie);
    }, [])

    const authManager: IAuthContext = {
        auth: auth,
        setAuth: setAuth
    }
    return (
        <AuthContext.Provider value={authManager}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;