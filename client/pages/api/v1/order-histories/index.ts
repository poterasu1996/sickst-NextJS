import axios from "axios";
import { CANCELLED_ORDERS, ORDER_HISTORIES } from "../../../../shared/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

const STRAPI_ORDER_HISTORY = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}${ORDER_HISTORIES}`;
const STRAPI_CANCELLED_ORDERS = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}${CANCELLED_ORDERS}`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const jwt = req.cookies.jwt;
    const { userId } = req.query;

    !jwt && res.status(401).json({ statusCode: 401, message: 'Unauthorizated' });
    const header = {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwt}`
        }
    }
    if(req.method === 'GET') {
        !userId && res.status(400).json({ statusCode:400, message: 'userId parameter is required' });


        const strapiRes = await axios.get(`${STRAPI_ORDER_HISTORY}?sort[0]=id:desc&filters[user_id][$eq]=${userId}`, header);
        if(strapiRes.status === 200) {
            res.status(200).json(strapiRes.data.data);
        } else {
            res.status(404).json({ statusCode: 404, message: 'Order not found'})
        }
    } 
    if(req.method === 'DELETE') {
        const rawData = req?.body;
        const orderId = req.query;
        if(!rawData || !orderId) res.status(400).json({ statusCode: 400, message: "Missing request body or user id" });
        
        const { createdAt, publishedAt, updatedAt, ...data } = rawData["attributes"];
        const cancelData = {
            data: {
              ...data,
              is_cancelled: true,
            },
        };
        const cancelledOrderData = {
            data: {
                user_id: rawData.attributes.user_id,
                order_history: [rawData.id],
            },
        };

        try {
            await axios.post(STRAPI_CANCELLED_ORDERS, cancelledOrderData);
            await axios.put(`${STRAPI_ORDER_HISTORY}/${orderId}`, cancelData);
            res.status(200).json({ statusCode: 200, message: 'Order successfully cancelled.' })
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
    else {
        res.setHeader('Allow', ["GET", "DELETE"]);
        res.status(405).end("Method not allowed")
    }
}