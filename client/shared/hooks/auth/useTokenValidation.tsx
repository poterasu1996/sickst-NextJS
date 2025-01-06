import { useCallback, useState } from "react";
import { CHECK_AUTH } from "../../utils/constants";
import axios from "axios";

const CHECK_AUTH_URL = `${process.env.NEXT_PUBLIC_BASEURL}${process.env.NEXT_PUBLIC_API_V1}${CHECK_AUTH}`;

const useTokenValidation  = () => {
    const validateToken = useCallback(async (): Promise<boolean> => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            return false; // no token, user is no authenticated
        }

        try {
            const resp = await axios.get(`${CHECK_AUTH_URL}?jwt=${token}`);
            if(resp.status === 200) {
                return true; // token is valid
            }
        } catch (error) {
            console.log('Token validation failed: ', error);
        }

        // Token is invalid
        localStorage.removeItem('jwt'); // Clean up invalid token
        return false;
    }, []);
    
    return { validateToken };
}

export default useTokenValidation;