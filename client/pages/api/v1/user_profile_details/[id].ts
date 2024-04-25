import axios from "axios";

const USER_PROFILE_DETAILS = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/user-profile-details`

export default async function handler(req:any, res:any) {
    const id = req.query.id;
    const jwt = req.cookies.jwt;

    const urlFilter = `?filters[user_id][$eq]=${id}`
    if(req.method === "GET" && !jwt) {
        res.status(401).json({statusCode: 401, message: 'Unauthorizate'})
    } else if(req.method === "GET" && jwt) {
        const header = {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`
            }
        }
        const strapiRes = await axios.get(`${USER_PROFILE_DETAILS}${urlFilter}`, header)
        if(strapiRes.status === 200) {
            res.status(200).json(strapiRes.data)
        }
    } else {
        res.setHeader('Allow', ["GET"]);
        res.status(405).end("Method not allowed")
    }
}