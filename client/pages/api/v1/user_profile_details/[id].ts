import axios from "axios";

const USER_PROFILE_DETAILS = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/user-profile-details`

export default async function handler(req:any, res:any) {
    const id = req.query.id;
    const jwt = req.cookies.jwt;

    const urlFilter = `?filters[user_id][$eq]=${id}`;

    if(!jwt) {
        res.status(401).json({statusCode: 401, message: 'Unauthorizate'})
    }  
    
    const header = {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwt}`
        }
    }

    if(req.method === "GET") {
        const strapiRes = await axios.get(`${USER_PROFILE_DETAILS}${urlFilter}`, header)
        if(strapiRes.status === 200) {
            res.status(200).json(strapiRes.data)
        }
    } else if(req.method === "PUT") {
        const rawData = req?.body;
        const parsedData = {
            data: {
                ...rawData,
            }
        }

        const strapiResp = await axios.put(`${USER_PROFILE_DETAILS}/${id}`, parsedData, header)
        res.status(200).json(strapiResp.data)
    }
    else {
        res.setHeader('Allow', ["GET", "PUT"]);
        res.status(405).end("Method not allowed")
    }
}