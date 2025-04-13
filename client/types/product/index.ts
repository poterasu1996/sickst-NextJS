import { ProductDTO } from "../../shared/dtos/product.dto";

export default interface IProduct {
    attributes: ProductDTO,
    id: number
}