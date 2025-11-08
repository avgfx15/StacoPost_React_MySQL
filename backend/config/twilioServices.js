// Load environment variables from .env file
// In ES module mode, this is the standard way to load dotenv variables
import 'dotenv/config';

// Twilio SDK initialization
// Import the default export from the twilio package
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize the Twilio client
// The Twilio constructor is now called directly with the imported twilio function
const client = twilio(accountSid, authToken);

/**
 * Sends an SMS message to a user.
 * @param {string} to - The recipient's full phone number (e.g., '+15551234567').
 * @param {string} body - The content of the SMS message.
 * @returns {Promise<object>} - The Twilio message object.
 */
async function sendSms(to, body) {
  const fromNumber = process.env.TWILIO_SMS_NUMBER; // Your dedicated Twilio SMS number

  if (!fromNumber) {
    console.error('TWILIO_SMS_NUMBER not set in environment variables.');
    return { success: false, error: 'Missing sender number.' };
  }

  try {
    const message = await client.messages.create({
      body: body,
      to: to,
      from: fromNumber,
    });
    console.log(`SMS sent successfully to ${to}. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`Error sending SMS to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a WhatsApp message using a pre-approved template.
 * NOTE: For business-initiated messages outside the 24-hour service window,
 * a pre-approved template is required by WhatsApp's policy.
 * For testing, we use the Twilio Sandbox, but production requires a registered number.
 * @param {string} to - The recipient's phone number.
 * @param {string} templateName - The name of the pre-approved template (e.g., 'hello_world').
 * @param {Array<object>} components - Template placeholders and media components.
 * @returns {Promise<object>} - The Twilio message object.
 */
async function sendWhatsAppTemplateMessage(to, templateName, components = []) {
  // Note: The 'whatsapp:' prefix is required for the 'from' and 'to' numbers.
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_SANDBOX;

  if (!fromWhatsApp) {
    console.error('TWILIO_WHATSAPP_SANDBOX not set in environment variables.');
    return { success: false, error: 'Missing WhatsApp sender number.' };
  }

  // Twilio expects the 'to' number to be prefixed with 'whatsapp:'
  const toWhatsApp = `whatsapp:${to}`;

  try {
    const message = await client.messages.create({
      contentSid: templateName, // Use contentSid for approved templates
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID, // Recommended for production
      contentVariables: components.reduce((acc, comp) => {
        if (comp.type === 'body' && comp.parameters) {
          comp.parameters.forEach((param, index) => {
            acc[`${comp.type}_${index + 1}`] = param.text;
          });
        }
        // Simplified for this example, professional apps use the Content API fully
        return acc;
      }, {}),
      to: toWhatsApp,
      from: fromWhatsApp,
    });
    console.log(
      `WhatsApp template sent successfully to ${to}. SID: ${message.sid}`
    );
    return { success: true, sid: message.sid };
  } catch (error) {
    // NOTE: In a real-world scenario, if a user replies, you can send free-form messages
    // using the body parameter instead of contentSid, but this is safer for business-initiated.
    console.error(`Error sending WhatsApp template to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a simple WhatsApp text message (for trial/sandbox mode).
 * @param {string} to - The recipient's phone number.
 * @param {string} body - The message body.
 * @returns {Promise<object>} - The Twilio message object.
 */
async function sendWhatsAppMessage(to, body) {
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_SANDBOX;

  if (!fromWhatsApp) {
    console.error('TWILIO_WHATSAPP_SANDBOX not set in environment variables.');
    return { success: false, error: 'Missing WhatsApp sender number.' };
  }

  const toWhatsApp = `whatsapp:${to}`;
  const fromWhatsAppPrefixed = `whatsapp:${fromWhatsApp}`;

  try {
    const message = await client.messages.create({
      body: body,
      to: toWhatsApp,
      from: fromWhatsAppPrefixed,
    });
    console.log(
      `WhatsApp message sent successfully to ${to}. SID: ${message.sid}`
    );
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`Error sending WhatsApp message to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Export the functions using ES module syntax
export { sendSms, sendWhatsAppTemplateMessage, sendWhatsAppMessage };
