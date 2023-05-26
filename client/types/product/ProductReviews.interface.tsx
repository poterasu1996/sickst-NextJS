// export interface GetProductReview {
//     attributes: {
//         createdAt: string,
//         dislikes: number,
//         likes: number,
//         product_id: number,
//         publishedAt: string,
//         rating: number,
//         review: string, 
//         title_review: string,
//         updatedAt: string,
//         user_first_name: string,
//         user_id: number,
//         user_last_name: string
//     },
//     id: number
// } 

export interface ReviewCount {
    total_reviews: number,
    medium_rate: number,
    five_star: number,
    four_star: number,
    three_star: number,
    two_star: number,
    one_star: number
}