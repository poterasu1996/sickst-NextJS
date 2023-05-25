export interface IUserDetailsModel {
    address?: string,
    avatar?: any,
    birthday?: string,
    city?: string,
    county?: string,
    first_name: string,
    gender?: string,
    last_name: string,
    phone_number?: string,
    products_received?: number,
    reviews: number,
    user_id: number
    zip_code?: number,
}

export interface IGETUserDetails {
    attributes: {
        address: string | null,
        avatar?: string | null,
        birthday: string | null,
        city: string | null,
        county: string | null,
        createdAt: string,
        first_name: string,
        gender: string,
        last_name: string,
        phone_number: string,
        products_received: number,
        publishedAt: string,
        reviews: number,
        user_id: number,
        zip_code: number | null
    },
    id: number
}