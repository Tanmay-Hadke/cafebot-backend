const express = require('express');
const app = express();
app.use(express.json());

// Browser status check
app.get('/', (req, res) => {
    res.send("🟢 CafeBot Webhook is online and ready for complex orders!");
});

// Pricing Data Matrices
const BASE_PRICES = {
    'drip': 2.50,
    'americano': 3.00,
    'espresso': 2.50,
    'latte': 4.00,
    'cappuccino': 4.00,
    'macchiato': 4.50,
    'cold brew': 4.50
};

const SIZE_UPCHARGES = {
    'small': 0.00,
    'medium': 1.00,
    'large': 2.00
};

const PREMIUM_MILKS = ['oat', 'almond', 'soy'];

app.post('/webhook', (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;

    if (intentName === 'Order_Coffee') {
        // 1. EXTRACT DATA: Grab strings and arrays (default to empty if missing)
        const base = (parameters['coffee-base'] || '').toLowerCase();
        const size = (parameters['coffee-size'] || '').toLowerCase();
        const milk = (parameters['milk-type'] || '').toLowerCase();
        const temperature = parameters['temperature'] || 'hot';
        
        // These are our "IS LIST" array parameters
        const syrups = parameters['syrup'] || [];
        const modifiers = parameters['modifiers'] || [];
        
        // This is our @sys.any wildcard parameter
        const notes = parameters['special-instructions'] || '';

        // 2. VALIDATE: We absolutely need a size and a base coffee to start
        if (!base || !size) {
            return res.json({
                fulfillmentText: "I'm ready to make your drink, but could you specify the size and the base coffee (like a Large Latte or Small Cold Brew)?"
            });
        }

        // 3. ADDITIVE PRICING MATH
        let total = 0;
        let receiptDetails = [];

        // Add base coffee and size prices
        total += BASE_PRICES[base] || 3.50; // default to $3.50 if base isn't in our dictionary
        total += SIZE_UPCHARGES[size] || 0.00;

        // Add milk upcharges
        if (PREMIUM_MILKS.includes(milk)) {
            total += 0.75;
            receiptDetails.push(`${milk} milk (+$0.75)`);
        } else if (milk) {
            receiptDetails.push(`${milk} milk`); // regular milk is free
        }

        // Add syrup upcharges ($0.50 per syrup)
        if (syrups.length > 0) {
            total += (syrups.length * 0.50);
            receiptDetails.push(`${syrups.join(' & ')} syrup (+$${(syrups.length * 0.50).toFixed(2)})`);
        }

        // Add modifier upcharges
        modifiers.forEach(mod => {
            if (mod.toLowerCase() === 'extra shot') {
                total += 1.00;
                receiptDetails.push(`extra shot (+$1.00)`);
            } else {
                receiptDetails.push(mod.toLowerCase()); // free modifiers like 'whipped cream'
            }
        });

        // 4. CONSTRUCT THE RESPONSE
        let drinkName = `One ${size} ${temperature} ${base}`;
        
        if (receiptDetails.length > 0) {
            drinkName += ` with ${receiptDetails.join(', ')}`;
        }
        
        let finalResponse = `Got it! ${drinkName}.`;
        
        if (notes) {
            finalResponse += ` Barista notes: "${notes}".`;
        }
        
        finalResponse += ` Your total comes to $${total.toFixed(2)}. Can I get you a pastry to go with that?`;

        return res.json({
            fulfillmentText: finalResponse
        });
    }

    return res.json({
        fulfillmentText: "I didn't quite catch that. Could you repeat your order?"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cafebot webhook running on port ${PORT}`);
});
