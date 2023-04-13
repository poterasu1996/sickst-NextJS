// import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//     message: string
// }

// we can also specify how the data looks
// export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

// }

export default async function handler(req, res) {
    // res.status(200).json({ message: 'bun' })
    const data = {message: 'bun'}
    res.status(200).json(data);

    // if (req.method === 'POST') {

    //     res.status(200).json({ data: 'data de la baiatu' });
    // } else {
    //     res.setHeader('Allow', 'POST');
    //     res.status(405).end('Method Not Allowed');
    // }
}