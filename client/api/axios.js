import axios from "axios";

export default axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_STRAPI_APIURL}`
    // headers: {'Authorisation': 'Bearer '+ localStorage.getItem('jwt')}
});