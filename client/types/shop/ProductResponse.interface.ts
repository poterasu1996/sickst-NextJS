export default interface ProductResponse {
    data?: any,
    meta?: any,
    error?: {
        status: number,
        name: string, 
        message: string
    }
}