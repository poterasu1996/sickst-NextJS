import { useEffect, useState } from "react";
import axios from "../api/axios";
import IProduct from "../types/product";

const PRODUCTS_URL = "/products?populate=*";
const nullCategoryData = {
  data: [
    {
      attributes: {
        name: null,
      },
    },
  ],
};

// to be removed
export const useProducts = () => {
  const [productList, setProductList] = useState<IProduct[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(PRODUCTS_URL);
      const fetchedData = [...response.data.data]
      const prodList = fetchedData.map((prod: IProduct) => {
        if (prod.attributes.categories.data.length <= 0) {
          const nullCategory = {
            id: prod.id,
            attributes: { ...prod.attributes, categories: nullCategoryData },
          };
          return nullCategory;
        }
        return prod;
      });
      setProductList([...prodList]);
    } catch (error: any) {
        return {error: error.response.data.error}
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [])

  return { productList };
};
