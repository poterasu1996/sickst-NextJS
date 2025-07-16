import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { jwt } = req.query;
    if (jwt) {
      // Validate the jwt with authentication logic
      // For simplicity, we're just checking if the jwt exists
      res.status(200).json({ 
        message: 'Authenticated', 
        token: jwt
      });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  }