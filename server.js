const express = require('express');
const app = express();
app.use(express.json());

// --- BUSINESS LOGIC & PRICING ---
// O(1) Lookup dictionary for fast price calculations.
// This data structure is easily scalable if new sizes or products are added.
const PRICING = {
    'small': 3.00,
    'medium': 4.00,
    'large': 5.00
};

// Simple browser health check
app.get('/', (req, res) => {
    res.send("🟢 CafeBot Webhook is online and ready for orders.");
});

app.post('/webhook', (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;

    if (intentName === 'Order_Coffee') {
        const size = (parameters['coffee-size'] || '').toLowerCase();
        const type = parameters['coffee-type'] || '';

        // Safety net: gracefully handle missing AI parameters before processing
        if (!size || !type) {
            return res.json({
                fulfillmentText: "I caught that you wanted coffee, but could you specify the size (Small, Medium, Large) and the type?"
            });
        }

        // --- CORE MATH LOGIC ---
        // dynamically fetches the base price from the O(1) matrix above.
        // Defensive safeguard: uses short-circuit evaluation (||) to default 
        // to $4.00 (medium) if the NLP engine passes an unexpected string.
        const price = PRICING[size] || 4.00;

        return res.json({
            fulfillmentText: `Perfect! One ${size} ${type} coming right up. That will be $${price.toFixed(2)}. Can I get you anything else?`
        });
    }

    // Fallback for unhandled intents
    return res.json({
        fulfillmentText: "My backend received the request, but I don't know how to process that specific intent yet."
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cafebot webhook running on port ${PORT}`);
});
