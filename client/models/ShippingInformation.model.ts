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
    address: string | undefined,
    city: string | undefined,
    county: string | undefined,
    full_name: string | undefined,
    phone: string | undefined,
    primary: boolean
}