import { BrandDTO } from "../../types/dtos/brand.dto";
import { DataResponse, StrapiResponse } from "../../types/dtos/strapi-response.dto";
import { BRANDS } from "../../utils/constants";
import HttpService from "../HttpService";

type BrandResponse = StrapiResponse<DataResponse<BrandDTO>>;

class BrandService {
    async getAllBrands(): Promise<BrandResponse | { error: string }> {
        return HttpService.safeGet<BrandResponse>(BRANDS);
    }
}

export default new BrandService();