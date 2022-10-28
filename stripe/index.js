const stripe = require('stripe')('pk_test_51KxbtMIdXAYNRuBxfZ7rtAja4wetgA73RkMB8GF9ZEZP4HLPyztZqYpzsN62jJVtbZXTAgP01E3NTMGmlEBVCJwP00QNspUWQm');
const express = require('express');
const app = express()
const port = 3001
const DOMAIN = 'http://localhost:3000'

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: dasd,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${DOMAIN}/payment/success`,
        cancel_url: `${DOMAIN}/payment/cancel`,
    })
    res.redirect(303, session.url);
})


app.listen(port, () => console.log('Running on port 3001'));