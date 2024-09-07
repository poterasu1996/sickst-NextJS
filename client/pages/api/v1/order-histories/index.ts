import axios from "axios";
import { ORDER_HISTORIES } from "../../../../shared/utils/constants";

const STRAPI_ORDER_HISTORY = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}${ORDER_HISTORIES}`;

export default async function handler(req: any, res: any) {
    const jwt = req.cookies.jwt;
    const { userId } = req.query;

    if(req.method === 'GET') {
        !jwt && res.status(401).json({ statusCode: 401, message: 'Unauthorizate' });
        !userId && res.status(400).json({ statusCode:400, message: 'userId parameter is required' });

        const header = {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`
            }
        }

        const strapiRes = await axios.get(`${STRAPI_ORDER_HISTORY}?sort[0]=id:desc&filters[user_id][$eq]=${userId}`, header);
        if(strapiRes.status === 200) {
            res.status(200).json(strapiRes.data.data);
        } else {
            res.status(404).json({ statusCode: 404, message: 'Order not found'})
        }
    } else {
        res.setHeader('Allow', ["GET"]);
        res.status(405).end("Method not allowed")
    }
}