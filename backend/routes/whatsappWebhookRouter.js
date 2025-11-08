import express from 'express';
import crypto from 'crypto';

const whatsappWebhookRouter = express.Router();

// Webhook verification for WhatsApp Business API
whatsappWebhookRouter.get('/webhook', (req, res) => {
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log('WhatsApp webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      console.log('WhatsApp webhook verification failed');
      res.sendStatus(403);
    }
  }
});

// Webhook for receiving WhatsApp messages
whatsappWebhookRouter.post('/webhook', (req, res) => {
  const body = req.body;

  // Check if this is a WhatsApp API request
  if (body.object === 'whatsapp_business_account') {
    // Iterate over each entry
    body.entry.forEach((entry) => {
      // Iterate over webhook entries
      entry.changes.forEach((change) => {
        if (change.field === 'messages') {
          // Handle incoming messages
          const messages = change.value.messages;
          if (messages) {
            messages.forEach((message) => {
              console.log('Received WhatsApp message:', message);

              // Here you can add logic to:
              // 1. Process the incoming message
              // 2. Send automated responses
              // 3. Store messages in database
              // 4. Trigger notifications, etc.

              // Example: Log message details
              const from = message.from; // Sender's phone number
              const messageType = message.type; // 'text', 'image', 'audio', etc.
              const messageId = message.id;

              if (messageType === 'text') {
                const text = message.text.body;
                console.log(`Message from ${from}: ${text}`);
              }
            });
          }
        }
      });
    });

    // Return a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from WhatsApp
    res.sendStatus(404);
  }
});

export default whatsappWebhookRouter;
