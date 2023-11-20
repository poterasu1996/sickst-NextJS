import cookie from "cookie";
import fetch from "node-fetch";

const STRAPI_LOGIN = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/auth/local`;

export default async function handler(req, res) {
    if(req.method === 'POST') {
        try {
            const { email, password } = req.body;
            
            const strapiRes = await fetch(STRAPI_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: email,
                    password: password
                }),
            });

            const data = await strapiRes.json();

            if (strapiRes.ok) {
                res.setHeader('Set-Cookie', cookie.serialize('jwt', data.jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 60 * 60 * 3, // 3 hours
                    sameSite: 'strict',
                    path: '/' 
                }));

                res.status(200).json({statusCode: 200, message: "Authentication successful"})
            } else {
                res.status(data.statusCode).json({message: data.message[0].messages[0].message})
            }
        } catch (error) {
            res.status(500).json({statusCode: 500, message: error.message})
        }
    } else {
        res.setHeader('Allow', ["POST"]);
        res.status(405).end("Method not allowed");
    }
}
