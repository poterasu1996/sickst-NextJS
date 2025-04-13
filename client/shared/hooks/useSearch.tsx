import { useEffect, useState } from "react"
import searchService from "../services/searchService";
import IProduct from "../../types/product";

type ProductSuggestion = {
    id: string,
    name: string,
    image: string
}

export const useSearch = (searchInput: string) => {
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([]);

    const searchProduct = async () => {
        const response = await searchService.searchProduct(searchInput);
        const rawData = response?.data || [];

        const _prodListSugg = rawData.map((prod: IProduct) => {
            return {
                id: prod.id,
                name: prod.attributes.product_name,
                image: prod.attributes.image.data[0].attributes.url
            }
        });
        const _searchSugg = rawData.map((prod: IProduct) => prod.attributes.product_name)
        setProductSuggestions([..._prodListSugg]);
        setSearchSuggestions([..._searchSugg]);
    }

    useEffect(() => {
        if(!searchInput.trim()) {
            setSearchSuggestions([]);
            setProductSuggestions([]);
            return
        }
        searchProduct();
    }, [searchInput]);

    return { searchSuggestions, productSuggestions };
};