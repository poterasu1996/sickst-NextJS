import { useEffect, useState } from "react";

import ProductResponse from "../../../../types/shop/ProductResponse.interface"
import productService from "../../../../shared/services/productService";

type UseWomanProductsResult = {
    allProducts?: ProductResponse;
    newProducts?: ProductResponse;
    topRatedProducts?: ProductResponse;
    loading: boolean;
    error: string | null
}

const useWomanProducts = (): UseWomanProductsResult => {
    const [allProducts, setAllProducts] = useState<ProductResponse>();
    const [newProducts, setNewProducts] = useState<ProductResponse>();
    const [topRatedProducts, setTopRatedProducts] = useState<ProductResponse>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
      
            try {
              const [main, newest, topRated] = await Promise.all([
                productService.getFemaleProducts(),
                productService.getNewFemaleProducts(),
                productService.getTopRatedFemaleProducts()
              ]);
      
              setAllProducts(main);
              setNewProducts(newest);
              setTopRatedProducts(topRated);
            } catch (err) {
              console.error("Error fetching woman shop data:", err);
              setError("Failed to load women's shop data.");
            } finally {
              setLoading(false);
            }
          };
      
          fetchData();
    }, [])

    return { allProducts, newProducts, topRatedProducts, loading, error };
}

export default useWomanProducts;