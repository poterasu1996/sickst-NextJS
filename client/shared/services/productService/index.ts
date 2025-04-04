import strapiAxios from "../../../api/axios";
import IProduct from "../../../types/Product.interface";
import { DataResponse, StrapiResponse } from "../../dtos/common/strapi-response.dto";
import { ProductDTO } from "../../dtos/product.dto";
import { CategoryEnums } from "../../enums/category.enum";
import { TagEnums } from "../../enums/tag.enum";
import { DEFAULT_SELECTED_FILTERS } from "../../types";
import { PRODUCTS_URL } from "../../utils/constants";
import HttpService from "../HttpService";

const nullCategoryData = {
    data: [
      {
        attributes: {
          name: null
        }
      }
    ]
}

type ProductsResponse = StrapiResponse<DataResponse<ProductDTO>>;

class ProductsService {

  async getAllProducts() {
    const result = await strapiAxios.get(PRODUCTS_URL);
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
      const result = await strapiAxios.get(
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
      const result = await strapiAxios.get(`${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.MALE}&sort[0]=rating%3Adesc`);
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
      const result = await strapiAxios.get(`${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.MALE}&sort[0]=rating%3Adesc`);
      return {
        ...result.data,
        data: result.data.data.slice(0,6)
      }
    } catch (error: any) {
      return {error: error.response.data.error}    
    }
  }

  async getFemaleProducts({ page = 1, search = undefined, filters = DEFAULT_SELECTED_FILTERS }: {
    page?: number;
    search?: string;
    filters?: typeof DEFAULT_SELECTED_FILTERS;
  }): Promise<ProductsResponse | { error: string}> {
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
          .filter(val => val.trim() !== '') // filter out empty strings
          .forEach(val =>
            queryParts.push(`filters[${key}][$in]=${encodeURIComponent(val)}`)
          );
      } else {
        queryParts.push(`filters[${key}][$eq]=${encodeURIComponent(value)}`);
      }
    });

    const finalUrl = `${baseUrl}&${queryParts.join("&")}`;

    return HttpService.safeGet<ProductsResponse>(finalUrl);
  }

  async getNewFemaleProducts(): Promise<ProductsResponse | { error: string}> {
    // return top 6 NEW products
    // const result = await axios.get(`${PRODUCTS_URL}&filters[tags][name][$eq]=${TagEnums.NEW}&filters[categories][name][$eq]=${CategoryEnums.FEMALE}`);
    // for testing purpose, until we populate DB with new products
    const url = `${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.FEMALE}&sort[0]=rating%3Adesc`;

    const result = HttpService.safeGet<ProductsResponse>(url)
      .then(response => {
        if (HttpService.isErrorResponse(response)) {
          console.error("Failed to load top rated products.", response.error);
          return {error: response.error}
        } else {
          const parsedData: StrapiResponse<DataResponse<ProductDTO>> = {
            ...response,
            data: response.data.slice(0, 6) as DataResponse<ProductDTO>[]
          }
          return parsedData
        }
      })
    return result;
  }

  async getTopRatedFemaleProducts(): Promise<ProductsResponse | { error: string}> {
    // get 6 top rated products
    const url = `${PRODUCTS_URL}&filters[categories][name][$eq]=${CategoryEnums.FEMALE}&sort[0]=rating%3Adesc`;
      
    const resp = HttpService.safeGet<ProductsResponse>(url)
      .then(response => {
        if (HttpService.isErrorResponse(response)) {
          console.error("Failed to load top rated products.", response.error);
          return {error: response.error}
        } else {
          const parsedData: StrapiResponse<DataResponse<ProductDTO>> = {
            ...response,
            data: response.data.slice(0, 6) as DataResponse<ProductDTO>[]
          }
          return parsedData
        }
      })
    return resp;
  }

}

export default new ProductsService();


