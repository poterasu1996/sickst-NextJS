import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === "POST" && req.body?.subscription_id) {
        const subID = req.body.subscription_id;
        let stripeSub;
        if(req.body?.action === "cancel") {
            try {
                stripeSub = await stripe.subscriptions.cancel(subID)
            } catch (error) {
                console.log(`Error message: ${error.message}`);
                res.status(400).send(`Error creating customer: ${error.message}`)
                return
            }
        }
        res.status(200).json(stripeSub);
    } else {
        res.status(405).end('Method not allowed')
    }
}