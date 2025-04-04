import axios from "../../../api/axios";
import IProduct from "../../../types/Product.interface";
import { CategoryEnums } from "../../enums/category.enum";
import { TagEnums } from "../../enums/tag.enum";
import { DEFAULT_SELECTED_FILTERS } from "../../types";
import { PRODUCTS_URL } from "../../utils/constants";

const nullCategoryData = {
    data: [
      {
        attributes: {
          name: null
        }
      }
    ]
}

class ProductsService {

  async getAllProducts() {
    const result = await axios.get(PRODUCTS_URL);
    const fetchProducts = [...result.data.data];
    // if product doesn't have a category, we set it to null
    const productsList = fetchProducts.map((prod: IProduct) => {
      if(prod.attributes.categories.data.length <= 0) {
        const nullCategory = {
          id: prod.id,
          attributes: { ...prod.attributes, categories: nullCategoryData }
        }
        return nullCategory;
      }
      return prod;
    })

    return productsList;
  }

  async getMaleProducts(page=1) {
    try {
      const result = await axios.get(
        `${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.MALE}&pagination[page]=${page}&pagination[pageSize]=3`);
      return result.data;
    } catch (error: any) {
      return {error: error.response.data.error}      
    }
  }

  async getNewMaleProducts() {
    // return top 6 NEW products
    try {
      // const result = await axios.get(`${PRODUCTS_URL}&filters[tags][name][$eq]=${TagEnums.NEW}&filters[categories][name][$eq]=${CategoryEnums.MALE}`);
      // dummy data, until we populate DB with more products
      const result = await axios.get(`${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.MALE}&sort[0]=rating%3Adesc`);
      return {
        ...result.data,
        data: result.data.data.slice(0,6)
      };
    } catch (error: any) {
      return {error: error.response.data.error}      
    }
  }

  async getTopRatedMaleProducts() {
    // get 6 top rated products
    try {
      const result = await axios.get(`${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.MALE}&sort[0]=rating%3Adesc`);
      return {
        ...result.data,
        data: result.data.data.slice(0,6)
      }
    } catch (error: any) {
      return {error: error.response.data.error}    
    }
  }

  async getFemaleProducts({page = 1, search = undefined, filters = DEFAULT_SELECTED_FILTERS }: {
    page?: number;
    search?: string;
    filters?: typeof DEFAULT_SELECTED_FILTERS;
  }) {
    try {
      let baseUrl = `${PRODUCTS_URL}`;
      const sexCategory = `filters[categories][name][$eq]=${CategoryEnums.FEMALE}`;
      const pagination = `pagination[page]=${page}&pagination[pageSize]=3`;

      const queryParts: string[] = [];

      // Add category and pagination
      queryParts.push(sexCategory);
      queryParts.push(pagination);

      // Add search
      if(search) {
        queryParts.push(`&filters[product_name][$containsi]=${search}`);
      }

      // Add filters from filters object
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value === '' ||
          value == null ||
          (Array.isArray(value) && value.filter(v => v.trim() !== '').length === 0)
        ) {
          return;
        }
      
        if (Array.isArray(value)) {
          value
            .filter(val => val.trim() !== '') // ✅ filter out empty strings
            .forEach(val =>
              queryParts.push(`filters[${key}][$in]=${encodeURIComponent(val)}`)
            );
        } else {
          queryParts.push(`filters[${key}][$eq]=${encodeURIComponent(value)}`);
        }
      });

      const finalUrl = `${baseUrl}&${queryParts.join("&")}`;
      const result = await axios.get(finalUrl);
      return result.data;
    } catch (error: any) {
      return {error: error.response.data.error}      
    }
  }

  async getNewFemaleProducts() {
    // return top 6 NEW products
    try {
      // const result = await axios.get(`${PRODUCTS_URL}&filters[tags][name][$eq]=${TagEnums.NEW}&filters[categories][name][$eq]=${CategoryEnums.FEMALE}`);
      // for testing purpose, until we populate DB with new products
      const result = await axios.get(`${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.FEMALE}&sort[0]=rating%3Adesc`);
      return {
        ...result.data,
        data: result.data.data.slice(0,6)
      };
    } catch (error: any) {
      return {error: error.response.data.error}      
    }
  }

  async getTopRatedFemaleProducts() {
    // get 6 top rated products
    try {
      const result = await axios.get(`${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.FEMALE}&sort[0]=rating%3Adesc`);
      return {
        ...result.data,
        data: result.data.data.slice(0,6)
      }
    } catch (error: any) {
      return {error: error.response.data.error}    
    }
  }

}

export default new ProductsService();


