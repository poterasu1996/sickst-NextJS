import axios from "../../../api/axios";
import IProduct from "../../../types/Product.interface";
import { CategoryEnums } from "../../enums/category.enum";
import { TagEnums } from "../../enums/tag.enum";
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

  async getFemaleProducts(page=1, search?: string) {
    try {
      let url = `${PRODUCTS_URL}`;
      let categoryAndPagination = `&filters[categories][name][$eq]=${CategoryEnums.FEMALE}&pagination[page]=${page}&pagination[pageSize]=3`;
      if(search) {
        url += `&filters[product_name][$containsi]=${search}`;
      }
      url += categoryAndPagination;

      const result = await axios.get(url);
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


