export default interface ICurrentUser {
    id: number,
    email: string,
    username: string
    confirmed: boolean,
    createdAt: string,
    updatedAt: string,
    blocked: boolean,
    client_role: string,
    new_user: boolean,
    newsletter: boolean,
    provider: string,
    subscribed: boolean,
}