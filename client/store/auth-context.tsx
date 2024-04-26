import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../shared/utils/constants';

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
    const [token, setToken] = useState<string | undefined>(undefined);

    const isAuthenticated = async () => {
        try {
            const res = await axios.get(CHECK_AUTH_URL);
            if(res.status === 200) {
                setIsAuth(true);
                setToken(res.data.token);
            } else {
                setIsAuth(false)
            }
        } catch (error) {
            setIsAuth(false);
        }
    }

    useEffect(() => {
        isAuthenticated()
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