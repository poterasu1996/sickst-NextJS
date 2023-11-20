import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === "POST") {
        let customer;
        try {
            customer = await stripe.customers.create({
                description: "Sickst customer",
                email: req.body.email
            })
        } catch (error) {
            console.log(`Error message: ${error.message}`);
            res.status(400).send(`Error creating customer: ${error.message}`)
            return
        }

        res.status(200).json(customer)
    } else {
        res.status(405).end('Method not allowed')
    }
}