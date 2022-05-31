import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Product = () => {
    const { router, asPath, pathname, query} = useRouter();

    // redirect to home page
    // useEffect(() => {
    //     router.push('/');
    // }, []);

    return <>
        asPath {asPath} - pathname {pathname} - query {query.id_token}
    </>
}

export default Product;
