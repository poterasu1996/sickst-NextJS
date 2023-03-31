import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            const session = await stripe.checkout.sessions.create({
                customer_email: req?.body?.customer_email ?? null,
                shipping_options: 
                    req?.body?.mode === 'payment'
                    ? [{
                        shipping_rate_data: {
                            type: 'fixed_amount',
                            fixed_amount: {amount: 0, currency: 'ron'},
                            display_name: 'Free shipping',
                            delivery_estimate: {
                                minimum: {unit: 'business_day', value: 5},
                                maximum: {unit: 'business_day', value: 7},
                            }
                        }, 
                        shipping_rate_data: {
                            type: 'fixed_amount',
                            fixed_amount: {amount: 1800, currency: 'ron'},
                            display_name: 'Express delivery',
                            delivery_estimate: {
                                minimum: {unit: 'business_day', value: 1},
                                maximum: {unit: 'business_day', value: 4},
                            }
                        },
                    }]
                    : [],
                mode: req?.body?.mode,
                payment_method_types: ['card'],
                line_items: req?.body?.items ?? [],
                success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/payment/cancel`,
            })

            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({statusCode: 500, message: error.message });
        }
    } 
    else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}