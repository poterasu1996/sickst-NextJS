import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

// @ts-ignore
import Cookies from 'js-cookie';
import { getToken } from '../shared/utils/auth.utils';
import { BEARER } from '../shared/utils/constants';

interface IAuthContext {
    auth: string | null;
    header: Header | null,
    setAuth: Dispatch<SetStateAction<string | null>>
}

const AuthContext =  React.createContext<IAuthContext>({auth: null, header: null, setAuth: () => null});

type Props = {
    children: JSX.Element
}

type Header = {
    headers: {
        authorization: string,
    }
}

export const AuthProvider = ({ children }: Props): JSX.Element => {
    const [auth, setAuth] = useState<string | null>(null);
    const [header, setHeader] = useState<Header | null>(null);

    useEffect(() => {
        // get jwt from cookie (right now, Strapi doesn't set a cookie with the token)
        // const cookie = Cookies.get('jwt');
        // setAuth(cookie);

        const token = getToken();

        token && setAuth(token);
        token && setHeader({headers: {authorization: `${BEARER} ${token}`}});
    }, [])

    const authManager: IAuthContext = {
        auth: auth,
        header,
        setAuth: setAuth,
    }
    return (
        <AuthContext.Provider value={authManager}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;