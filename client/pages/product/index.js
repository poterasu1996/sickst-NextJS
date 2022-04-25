import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Product = () => {
    const router = useRouter();

    // redirect to home page
    useEffect(() => {
        router.push('/');
    }, []);

    return <>
        Product page
    </>
}

export default Product;
