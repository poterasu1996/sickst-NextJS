export interface IShippingInformationModel {
    shipping_info_list: IShippingInfo[] | null,
    user_id: number
}

export interface IGETShippingInformation {
    attributes: {
        createdAt: string,
        publishedAt: string,
        shipping_info_list: IShippingInfo[] | null,
        updatedAt: string,
        user_id: number
    },
    id: number
}


export interface IShippingInfo {
    address: string,
    city: string,
    county: string,
    full_name: string,
    phone: string,
    primary: boolean
}