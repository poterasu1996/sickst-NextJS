import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useTokenValidation from '../hooks/auth/useTokenValidation';


interface IAuthContext {
    isAuth: boolean,
    setIsAuth: Dispatch<SetStateAction<boolean>>,
}

const AuthContext =  React.createContext<IAuthContext>({
    isAuth: false, 
    setIsAuth: () => null 
});

type Props = {
    children: JSX.Element
}

export const AuthProvider = ({ children }: Props): JSX.Element => {
    const [isAuth, setIsAuth] = useState(false);

    const { validateToken } = useTokenValidation(); 

    useEffect(() => {
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
    }
    return (
        <AuthContext.Provider value={authManager}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;