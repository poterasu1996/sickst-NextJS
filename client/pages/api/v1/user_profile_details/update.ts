import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
    if (req.method === "GET") {
        res.status(200).json({data: "e bun", prajituri: req.cookies})
    } else {
        res.status(405).end('Method not allowed')
    }
}