export const AccountTabViews = {
    SUBSCRIPTION: "subscription",
    ORDER_HISTORY: "orderHistory",
    BILLING_INFO: "billingInfo",
    SHIPPING_INFO: "shippingInfo",
    REVIEWS: "reviews",
    RATED_PRODUCTS: "ratedProducts",
    PERSONAL_INFO: "personalInfo",
    RESET_PASSWORD: "resetPassword"
} as const;

export type AccountTabView = typeof AccountTabViews[keyof typeof AccountTabViews];
