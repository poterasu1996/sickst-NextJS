import axios from "axios";
import { CONTACTS } from "../../../../utils/constants";
import { EncodedFile } from "../../../../models/ContactUs.model";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from "path";
import formidable, { File } from 'formidable';

const STRAPI_CONTACTS = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}${CONTACTS}`;

// Disable default body parsing
export const config = {
    api: {
      bodyParser: {
        bodyParser: false, // Disabling body parsing for formidable to work
        // sizeLimit: '10mb', // Adjust size limit if needed
      },
    },
};

const uploadDir = path.join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('attachments') as unknown as File;

    if(!file) {
        return NextResponse.json({ success: false, message: 'No file'})
    }

    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes); 
}


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const jwt = req.cookies.jwt;

//     // if (!jwt) {
//     //     return res.status(401).json({ statusCode: 401, message: 'Umauthorized' });
//     // }
//     console.log('Received request method:', req.method); // Log the request method
//     if(req.method === 'POST') {
//         console.log(req.body)
//         // try {
//         //     console.log('Received req body ', req.body)
//         //     const { attachements, ...fields } = req.body;
    
//         //     // Save attachments if exists
//         //     if (attachements) {
//         //         const file = attachements as EncodedFile;
//         //         const filePath = path.join(process.cwd(), 'uploads', file.name);
//         //         const buffer = Buffer.from(file.data, 'base64');
//         //         await fs.writeFile(filePath, buffer);
//         //     }
//         //     console.log('Attachment:', attachements);
//         //     res.status(200).json({ statusCode:200, message: 'Success'})
//         // } catch (error) {
//         //     console.error('Error handling request:', error);
//         //     res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
//         // }
//         res.status(200).json({ statusCode:200, message: 'Success'})
//     } else {
//         res.setHeader('Allow', ["POST"]);
//         res.status(405).end("Method not allowed")
//     }
// }