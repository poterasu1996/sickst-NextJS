export interface IUserDetailsModel {
    address?: string | null,
    avatar?: any,
    birthday?: string | null,
    city?: string | null,
    client_role?: string,
    county?: string | null | undefined,
    first_name: string,
    gender?: string,
    last_name: string,
    new_user?: boolean,
    newsletter?: boolean,
    phone_number?: string | null,
    products_received?: number,
    reviews?: number,
    subscribed?: boolean,
    subscription_name?: string | null | undefined,
    user_id: number
    zip_code?: number | null,
}

export interface IGETUserDetails {
    attributes: {
        address: string | null,
        avatar?: string | null,
        birthday: string | null,
        city: string | null,
        client_role: string,
        county: string | null,
        createdAt: string,
        first_name: string,
        gender: string,
        last_name: string,
        new_user: boolean,
        newsletter: boolean,
        phone_number: string | null,
        products_received: number,
        publishedAt: string,
        reviews: number,
        subscribed: boolean,
        subscription_name: string | null | undefined,
        user_id: number,
        zip_code: number | null
    },
    id: number
}

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}