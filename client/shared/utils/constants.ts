export const BEARER = "Bearer";
export const AUTH_TOKEN = "jwt";

// ALL NEXT ENDPOINTS
export const API_V = '/api/v1';

export const PAYMENT_TYPE = {
    oneTimeBuy: 'otb',
    subscription: 'subscription'
}

export const SUBSCRIPTION_TYPE = {
    MYSTERY : 'mystery',
    BASIC: 'basic',
    PREMIUM: 'premium'
}

// export type PAYMENT_TYPE = "subscription" | "otb"; 

// 1:1 strapi table endpoints
export const BRANDS = '/brands';
export const CANCELLED_ORDERS = '/cancelled-orders';
export const CHECK_AUTH = '/check_auth';
export const CONTACTS = '/contacts';
export const ORDER_HISTORIES = "/order-histories";
export const PRODUCTS_URL = "/products?populate=*";
export const PRODUCT_REVIEWS = "/product-reviews";
export const SHIPPING_INFORMATIONS = "/shipping-informations";
export const SUBSCRIPTIONS = "/subscriptions";
export const SUBSCRIPTION_ORDERS = "/subscription-orders";
export const USER_LOGIN = '/login';
export const USER_ME = '/users/me';
export const USER_PROFILE_DETAILS = '/user-profile-details';