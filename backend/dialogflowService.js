const { SessionsClient } = require('@google-cloud/dialogflow');
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Your product model

// Initialize Dialogflow client
const sessionClient = new SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Connect to your database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function detectIntent(sessionId, query) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult;
}

async function handleWebhook(req, res) {
  const { session, queryResult } = req.body;
  
  // Extract parameters from Dialogflow
  const { parameters } = queryResult;
  const category = parameters['category'];
  const tags = parameters['tags'];
  
  // Query your database
  let products = [];
  if (category || tags) {
    const query = {};
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags };
    
    products = await Product.find(query).limit(5);
  }
  
  // Format response
  let fulfillmentText = queryResult.fulfillmentText;
  if (products.length > 0) {
    fulfillmentText += '\n\n' + products.map(p => `- ${p.name} ($${p.price})`).join('\n');
  }
  
  res.json({ fulfillmentText });
}

module.exports = {
  detectIntent,
  handleWebhook
};