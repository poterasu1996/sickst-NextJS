import { useEffect, useState } from "react";

const useGetJWT = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('jwt');
            setToken(storedToken);
        }
    }, [])
    return { token };
}

export default useGetJWT;