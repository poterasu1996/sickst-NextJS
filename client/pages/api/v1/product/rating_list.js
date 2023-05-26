export default async function handler(req, res) {
    const data = {msg: 'AICI'}

    res.status(200).json(data);
}