import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../shared/utils/constants';
import useTokenValidation from '../shared/hooks/auth/useTokenValidation';

const CHECK_AUTH_URL = `${process.env.NEXT_PUBLIC_BASEURL}${process.env.NEXT_PUBLIC_API_V1}${CHECK_AUTH}`;

interface IAuthContext {
    isAuth: boolean,
    setIsAuth: Dispatch<SetStateAction<boolean>>,
    setToken: Dispatch<SetStateAction<string | undefined>>,
    token: string | undefined
}

const AuthContext =  React.createContext<IAuthContext>({isAuth: false, setIsAuth: () => null, setToken: () => null, token: undefined});

type Props = {
    children: JSX.Element
}

export const AuthProvider = ({ children }: Props): JSX.Element => {
    const [isAuth, setIsAuth] = useState(false);

    // might remove in future
    const [token, setToken] = useState<string | undefined>(undefined); 

    const { validateToken } = useTokenValidation(); 

    useEffect(() => {
        // isAuthenticated()
        if(!localStorage.getItem('jwt')) setIsAuth(false);
        validateToken()
            .then((resp: boolean) => { 
                if(resp) { 
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            })
            .catch(() => setIsAuth(false));
    }, [])

    const authManager: IAuthContext = {
        isAuth,
        setIsAuth,
        setToken,
        token
    }
    return (
        <AuthContext.Provider value={authManager}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;