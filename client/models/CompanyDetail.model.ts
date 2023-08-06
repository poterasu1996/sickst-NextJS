export interface ICompanyDetailModel {
    address?: string,
    bank?: string,
    cif?: string,
    iban?: string,
    name?: string,
    reg_com?: string,
}

export interface ICompanyDetail {
    attributes: {
        address: string,
        bank: string,
        cif: string,
        createdAt: string, 
        iban: string,
        name: string,
        publishedAt: string,
        reg_com: string,
        updatedAt: string,
    },
    id: number
}