import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET = process.env.SECRET;

export default async function(req, res) {
    req.json({message:'OK'})
}