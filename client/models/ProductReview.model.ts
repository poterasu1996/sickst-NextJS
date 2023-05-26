import { IGETUserDetails } from "./UserDetails.model"

export interface IProductReviewModel {
    blocked: boolean,
    dislikes?: number,
    likes?: number,
    product_id: number,
    rating: number,
    review?: string,
    title_review?: string,
    user_details: number[],
    users_disliked?: number[] | null,
    users_liked?: number[] | null,
}

export interface IGETProductReview {
    attributes: {
        blocked: boolean,
        createdAt: string,
        dislikes: number,
        likes: number,
        product_id: number,
        publishedAt: string,
        rating: number,
        review: string,
        title_review: string,
        updatedAt: string,
        user_details: {
            data: IGETUserDetails
        },
        users_disliked: number[] | null,
        users_liked: number[] | null,
    },
    id: number
}