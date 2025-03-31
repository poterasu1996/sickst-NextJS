import { useEffect, useRef, useState } from "react";

import ProductResponse from "../../../../types/shop/ProductResponse.interface";
import productService from "../../../../shared/services/productService";

type UseWomanProductsResult = {
  allProducts?: ProductResponse;
  newProducts?: ProductResponse;
  topRatedProducts?: ProductResponse;
  loading: boolean;
  error: string | null;
  respPage: number;
  setPage: (page: number) => void;
};

type Props = {
  search?: string;
};

const useWomanProducts = ({ search = "" }: Props): UseWomanProductsResult => {
  const [allProducts, setAllProducts] = useState<ProductResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [respPage, setRespPage] = useState(1);

  const newProductsRef = useRef<ProductResponse>();
  const topRatedProductsRef = useRef<ProductResponse>();

  const [newProducts, setNewProducts] = useState<ProductResponse>();
  const [topRatedProducts, setTopRatedProducts] = useState<ProductResponse>();

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (search || page > 1) {
          const main = await productService.getFemaleProducts(page, search);
          setAllProducts(main);
          setRespPage(main.meta.pagination.page);
        } else {
          const [main, newest, topRated] = await Promise.all([
            productService.getFemaleProducts(page, search),
            newProductsRef.current
              ? Promise.resolve(newProductsRef.current)
              : productService.getNewFemaleProducts(),
            topRatedProductsRef.current
              ? Promise.resolve(topRatedProductsRef.current)
              : productService.getTopRatedFemaleProducts(),
          ]);

          setAllProducts(main);
          setRespPage(main.meta.pagination.page);

          // only update refs the first time
          if (!newProductsRef.current) newProductsRef.current = newest;
          if (!topRatedProductsRef.current)
            topRatedProductsRef.current = topRated;

          setNewProducts(newProductsRef.current);
          setTopRatedProducts(topRatedProductsRef.current);
        }
      } catch (err) {
        console.error("Error fetching woman shop data:", err);
        setError("Failed to load women's shop data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search]);

  return {
    allProducts,
    newProducts,
    topRatedProducts,
    loading,
    error,
    respPage,
    setPage,
  };
};

export default useWomanProducts;
