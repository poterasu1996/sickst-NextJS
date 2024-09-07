import axios from "axios";
import { SUBSCRIPTION_ORDERS } from "../../../../shared/utils/constants";

const STRAPI_SUBSCRIPTION_ORDERS = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}${SUBSCRIPTION_ORDERS}`;

export default async function handler(req: any, res: any) {
    const jwt = req.cookies.jwt;
    const { userId, activeSubscription } = req.query;

    if(req.method === 'GET') {
        !jwt && res.status(401).json({ statusCode: 401, message: 'Unauthorizate' });
        !userId && res.status(400).json({ statusCode:400, message: 'userId parameter is required' });

        const header = {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`
            }
        }

        if(activeSubscription) {
            const strapiRes = await axios.get(`${STRAPI_SUBSCRIPTION_ORDERS}?filters[user_id][$eq]=${userId}&filters[subscription_status][$eq]=active`, header);
            if(strapiRes.status === 200) {
                res.status(200).json(strapiRes.data.data)
            }
        }

        const strapiRes = await axios.get(`${STRAPI_SUBSCRIPTION_ORDERS}?filters[user_id][$eq]=${userId}`, header);
        if(strapiRes.status === 200) {
            res.status(200).json(strapiRes.data.data);
        } else {
            res.status(404).json({ statusCode: 404, message: 'Subscription order not found'})
        }
    } else {
        res.setHeader('Allow', ["GET"]);
        res.status(405).end("Method not allowed")
    }
}