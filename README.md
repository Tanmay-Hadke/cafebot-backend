# ☕️ Cloud Cafe: Full-Stack Conversational AI

An end-to-end NLP chatbot architecture that processes natural language coffee orders, dynamically extracts custom parameters, and calculates pricing via a custom webhook backend. 

## 🏗️ System Architecture
1. **Frontend:** HTML5 web interface utilizing Dialogflow Messenger for seamless user interaction.
2. **NLP Engine (Dialogflow ES):** Custom-trained Natural Language Processing model featuring custom entities (`@coffee-base`, `@coffee-size`) to parse user intent from raw text.
3. **Backend Webhook (Node.js & Express):** A RESTful API that catches Dialogflow webhooks, executes business logic/price calculations based on extracted parameters, and returns formatted JSON responses.
4. **Deployment:** Hosted live on a CI/CD pipeline via Render.

## 🚀 Features
* **Dynamic Parameter Extraction:** accurately parses specific variables (size, type) from conversational sentences.
* **Automated Price Calculation:** Uses an additive pricing model in the backend to calculate totals based on user selections.
* **Conditional Fallbacks:** Backend logic automatically prompts the user if required parameters are missing from their natural language query.

## 💻 Tech Stack
* **Language:** JavaScript (Node.js)
* **Framework:** Express.js
* **AI/NLP:** Google Dialogflow ES
* **Infrastructure:** Render (Cloud Hosting)

## 📂 Repository Contents
* `server.js`: The Express backend and pricing logic.
* `index.html`: The frontend UI integration.
* `Cafebot-Export.zip`: The raw Dialogflow agent configuration. You can import this directly into your own Google Cloud console to replicate the AI model.

## 🛠️ How to Run Locally
1. Clone this repository.
2. Run `npm install express` to install dependencies.
3. Run `node server.js` to start the local webhook on port 3000.
4. Use a tool like Ngrok to expose your local port to Dialogflow.
