import axios from "axios";

const USER_ME_URL = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/users/me`

export default async function handler(req: any, res: any) {
    const jwt = req.cookies.jwt;

    if(req.method === 'GET' && !jwt) {
        res.status(401).json({statusCode: 401, message: 'Unauthorizate'})
    } else if(req.method === 'GET' && jwt) {
        const header = {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`
            }
        }

        const strapiRes = await axios.get(USER_ME_URL, header)
        if(strapiRes.status === 200) {
            res.status(200).json(strapiRes.data)
        }
    } else {
        res.setHeader('Allow', ["GET"]);
        res.status(405).end("Method not allowed")
    }
} 