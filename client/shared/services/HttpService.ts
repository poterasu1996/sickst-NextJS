import strapiAxios from "../../api/axios";

class HttpService {
    async safeGet<T>(url: string): Promise<T | { error: string }> {
        try {
            const response = await strapiAxios.get<T>(url);
            return response.data;
        } catch (error: any) {
            return {
                error:
                    error.response?.data?.error?.message ||
                    error.message || 
                    "Unexpected error",
            }
        }
    }

    async safePost<T>(url: string, body: any): Promise<T | { error: string }> {
        try {
          const res = await strapiAxios.post<T>(url, body);
          return res.data;
        } catch (error: any) {
          return {
            error:
              error.response?.data?.error?.message ||
              error.message ||
              "Unexpected error",
          };
        }
    }

    isErrorResponse = (resp: any): resp is { error: string } => {
        return resp && typeof resp === 'object' && 'error' in resp;
    }
}

export default new HttpService();