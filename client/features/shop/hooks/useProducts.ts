import { useEffect, useRef, useState } from "react";

import ProductResponse from "../../../types/shop/ProductResponse.interface";
import productService from "../../../services/productService";
import HttpService from "../../../services/HttpService";
import { DEFAULT_SELECTED_FILTERS } from "../../../types/shop/shop.constants";

type UseProductsResult = {
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
  filters?: any
};

const useProducts = ({ 
  search = "",
  filters = DEFAULT_SELECTED_FILTERS 
}: Props): UseProductsResult => {
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
          const main = await productService.getAllProducts({page, search, filters});
          if(HttpService.isErrorResponse(main)) {
            console.log('Failed to load products.')
          } else {
            setAllProducts(main);
            setRespPage(main.meta.pagination.page);
          }
        } else {
          const [main, newest, topRated] = await Promise.all([
            productService.getAllProducts({page, search, filters}),
            newProductsRef.current
              ? Promise.resolve(newProductsRef.current)
              : productService.getNewProducts(),
            topRatedProductsRef.current
              ? Promise.resolve(topRatedProductsRef.current)
              : productService.getTopRatedProducts(),
          ]);

          if(HttpService.isErrorResponse(main)) {
            console.log('Failed to load products.')
          } else {
            setAllProducts(main);
            setRespPage(main.meta.pagination.page);
          }

          // only update refs the first time
          if (HttpService.isErrorResponse(newest)) {
            console.error("Failed to load new products.");
            setError("Failed to load new products.");
          } else if (!newProductsRef.current) {
            newProductsRef.current = newest;
            setNewProducts(newest);
          }

          if (HttpService.isErrorResponse(topRated)) {
            console.error("Failed to load top-rated products.");
            setError("Failed to load top-rated products.");
          } else if (!topRatedProductsRef.current) {
            topRatedProductsRef.current = topRated;
            setTopRatedProducts(topRated);
          }
        }
      } catch (err) {
        console.error("Error fetching products shop data:", err);
        setError("Failed to load products shop data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, filters]);

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

export default useProducts;
