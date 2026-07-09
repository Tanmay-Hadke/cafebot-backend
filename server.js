const express = require('express');
const app = express();
app.use(express.json()); // Parses incoming Dialogflow JSON requests

// Price mapping matrix
const PRICING = {
    'small': 3.00,
    'medium': 4.00,
    'large': 5.00
};

app.post('/webhook', (req, res) => {
    // 1. Extract the intent name and parameters from the Dialogflow JSON payload
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;

    if (intentName === 'Order_Coffee') {
        // Grab the entity values extracted by Dialogflow
        const size = parameters['coffee-size'].toLowerCase();
        const type = parameters['coffee-type'];

        // 2. Business Logic: Handle missing parameters or calculate prices
        if (!size || !type) {
            return res.json({
                fulfillmentText: "I caught that you wanted coffee, but could you specify the size (Small, Medium, Large) and the type?"
            });
        }

        const price = PRICING[size] || 4.00;

        // 3. Construct the response format Dialogflow expects
        return res.json({
            fulfillmentText: `Perfect! One ${size} ${type} coming right up. That will be $${price.toFixed(2)}. Can I get you anything else?`
        });
    }

    // Default fallback if an unhandled intent hits the webhook
    return res.json({
        fulfillmentText: "My backend received the request, but I don't know how to process that specific intent yet."
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cafebot webhook running on port ${PORT}`);
});