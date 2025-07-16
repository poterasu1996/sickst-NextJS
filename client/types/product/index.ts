import { ProductDTO } from "../dtos/product.dto";

export default interface IProduct {
    attributes: ProductDTO,
    id: number
}