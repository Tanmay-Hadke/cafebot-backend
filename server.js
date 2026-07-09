const express = require('express');
const app = express();
app.use(express.json());

// This is the new part for web browsers!
app.get('/', (req, res) => {
    res.send("🟢 CafeBot Webhook is online and ready to receive Dialogflow requests!");
});

const PRICING = {
    'small': 3.00,
    'medium': 4.00,
    'large': 5.00
};

app.post('/webhook', (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;

    if (intentName === 'Order_Coffee') {
        const size = parameters['coffee-size'].toLowerCase();
        const type = parameters['coffee-type'];

        if (!size || !type) {
            return res.json({
                fulfillmentText: "I caught that you wanted coffee, but could you specify the size (Small, Medium, Large) and the type?"
            });
        }

        const price = PRICING[size] || 4.00;

        return res.json({
            fulfillmentText: `Perfect! One ${size} ${type} coming right up. That will be $${price.toFixed(2)}. Can I get you anything else?`
        });
    }

    return res.json({
        fulfillmentText: "My backend received the request, but I don't know how to process that specific intent yet."
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cafebot webhook running on port ${PORT}`);
});
