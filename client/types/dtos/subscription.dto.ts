export interface SubscriptionDTO {
    createdAt: string,
    name: string | null,
    price: number,
    publishedAt: string,
    stripe_sub_link: string,
    updatedAt: string
}
