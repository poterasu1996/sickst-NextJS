import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const USER_PROFILE_DETAILS = process.env.NEXT_PUBLIC_STRAPI_APIURL
    ? `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/user-profile-details`
    : ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Validate env variable
    if (!USER_PROFILE_DETAILS) {
        return res.status(500).json({ statusCode: 500, message: 'API URL not configured' });
    }

    const id = req.query.id as string;
    const jwt = req.cookies.jwt;

    // Validate JWT and user ID
    if(!jwt) {
        return res.status(401).json({statusCode: 401, message: 'Unauthorized, missing JWT token'});
    }  
    if(!id) {
        return res.status(400).json({ statusCode: 400, message: 'Missing user ID' });
    }
    
    const header = {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwt}`
        },
    };

    try {
        // handle GET request
        if (req.method === 'GET') {
            const urlFilter = `?filters[user_id][$eq]=${id}`;
            const strapiRes = await axios.get(`${USER_PROFILE_DETAILS}${urlFilter}`, header);

            return res.status(200).json(strapiRes.data);
        // handle PUT request
        } else if (req.method === 'PUT') {
            const rawData = req?.body;
            if (!rawData) {
                return res.status(400).json({ statusCode: 400, message: 'Missing request body'});
            }

            const parsedData = {
                data: {
                    ...rawData,
                },
            };
            const strapiResp = await axios.put(`${USER_PROFILE_DETAILS}/${id}`, parsedData, header);
            return res.status(200).json(strapiResp.data);
        
        // handle unsupported methods
        } else {
            res.setHeader('Allow', ["GET", "PUT"]);
            return res.status(405).json({ statusCode: 405, message: 'Method not allowed' }); 
        }
    } catch (error) {
        // handle axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            return res.status(axiosError.response?.status || 500).json({
                statusCode: axiosError.response?.status || 500,
                message: axiosError.response?.data || 'Internal Server Error',
            });
        }

        // Handle generic errors
        return res.status(500).json({ statusCode: 500, message: 'Internal Server Error'});
    }

    
}