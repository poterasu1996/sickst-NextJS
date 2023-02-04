import axios from "../../api/axios";
// import { injectable } from "tsyringe";
import {injectable, singleton } from "tsyringe";

const PRODUCTS_URL = "/products?populate=*";

export function getProducts() {
    return axios.get(PRODUCTS_URL).then(resp => resp.data.data);
}

