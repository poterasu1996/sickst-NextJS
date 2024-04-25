import axios from "axios";

const SHIPPING_INFO_URL = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/shipping-informations`

export default async function handler(req: any, res: any) {
    const jwt = req.cookies.jwt;

    if(req.method === 'GET') {
        !jwt && res.status(401).json({statusCode: 401, message: 'Unauthorizate'})

        const header = {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`
            }
        }

        const strapiRes = await axios.get(SHIPPING_INFO_URL, header)
        if(strapiRes.status === 200) {
            res.status(200).json(strapiRes.data)
        }
    // } else if(req.method === 'GET' && jwt) {
    } else {
        res.setHeader('Allow', ["GET"]);
        res.status(405).end("Method not allowed")
    }
} 