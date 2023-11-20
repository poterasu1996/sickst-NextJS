import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === "POST") {
        let c_session;
        try {
            c_session = await stripe.checkout.sessions.retrieve(req.body?.subscription_id)
        } catch (error) {
            console.log(`Error message: ${error.message}`);
            res.status(400).send(`Error creating customer: ${error.message}`)
            return
        }

        console.log("customer: ", c_session)
        res.status(200).json(c_session)
    } else {
        res.status(405).end('Method not allowed')
    }
}