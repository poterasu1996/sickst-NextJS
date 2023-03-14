import axios from "../../../api/axios";
const PRODUCTS_URL = "/products?populate=*";
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
        const productsList = fetchProducts.map(prod => {
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
}

export default new ProductsService();


