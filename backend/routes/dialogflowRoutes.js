const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const { SessionsClient } = require('@google-cloud/dialogflow');

// Initialize Dialogflow client
const sessionClient = new SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

console.log("Dialogflow client initialized successfully!");

router.post('/recommend', async (req, res) => {
  try {
    const { sessionId, query } = req.body;
    
    // Call Dialogflow
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
    const result = responses[0].queryResult;
    const params = result.parameters?.fields || {};
    
    // Check if this is a greeting (no product search intended)
    const isGreeting = result.intent.displayName === 'Default Welcome Intent';

    // Only search for products if it's not a greeting
    let recommendedProducts = [];
    let responseText = result.fulfillmentText;

    if (!isGreeting) {
      // Get parameters safely
      const category = params.category?.stringValue;
      const descriptionKeywords = query.toLowerCase().split(' '); // Use query words as keywords

      // Build query based on category and description keywords
      const queryConditions = {};
      
      if (category) {
        queryConditions['$or'] = [
          { 'categoryFk.categoryName': new RegExp(category, 'i') },
          { 'description': new RegExp(category, 'i') }
        ];
      }

      // Also search in product names and descriptions
      if (descriptionKeywords.length > 0) {
        queryConditions['$or'] = queryConditions['$or'] || [];
        descriptionKeywords.forEach(keyword => {
          if (keyword.length > 3) { // Ignore short words
            queryConditions['$or'].push(
              { 'name': new RegExp(keyword, 'i') },
              { 'description': new RegExp(keyword, 'i') }
            );
          }
        });
      }

      console.log('Database query:', JSON.stringify(queryConditions, null, 2));

      // Get products with variants if we have search conditions
      if (Object.keys(queryConditions).length > 0) {
        recommendedProducts = await Product.aggregate([
          { $match: queryConditions },
          { $lookup: {
              from: 'productVariants',
              localField: '_id',
              foreignField: 'productFk',
              as: 'variants'
          }},
          { $limit: 5 }
        ]);

        // Only append product info if we actually searched
        if (recommendedProducts.length > 0) {
          responseText += '\n\n' + recommendedProducts.map(p => 
            `- ${p.name} (Rs. ${p.variants[0]?.newPrice || 'N/A'})`
          ).join('\n');
        } else {
          responseText += "\n\nNo matching products found. Try different keywords.";
        }
      }
    }

    res.json({ 
      success: true,
      response: responseText,
      products: isGreeting ? [] : recommendedProducts
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing recommendation",
      error: error.message 
    });
  }
});

module.exports = router;