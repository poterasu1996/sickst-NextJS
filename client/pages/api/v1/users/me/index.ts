import axios from "axios";

const USER_ME_URL = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/users/me`;

export default async function handler(req: any, res: any) {
  const jwt = req.cookies.jwt;

  // !jwt && res.status(401).json({statusCode: 401, message: 'Unauthorizate'})
  const header = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  if (req.method === "GET") {
    try {
      const strapiRes = await axios.get(USER_ME_URL, header);
      res.status(strapiRes.status).json(strapiRes.data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userMe data" });
    }
  } else if (req.method === "POST") {
    const data = req.body;
    const parserData = JSON.parse(data);
    console.log("data:", data);
    res.status(200).json(parserData);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method not allowed");
  }
}
