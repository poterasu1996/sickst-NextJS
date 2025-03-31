import strapiAxios from "../../../api/axios";
import { PRODUCTS_URL } from "../../utils/constants";

class SearchService {
    async searchProduct(query: string) {
        try {
            const result = await strapiAxios.get(`${PRODUCTS_URL}&filters[product_name][$containsi]=${encodeURIComponent(query)}`);
            return result.data;
        } catch (error: any) {
            return {error: error.response?.data?.error || 'Search failed' };
        }
    }
}

export default new SearchService();