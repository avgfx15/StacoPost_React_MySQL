import express from 'express';
import nodemailer from 'nodemailer';

const contactRouter = express.Router();

import dotenv from 'dotenv';

dotenv.config({ override: true });

// const twilioService = require('./twilioService'); // Import the service

import * as twilioService from '../config/twilioServices.js';

// Destructure the functions
const { sendSms, sendWhatsAppMessage } = twilioService;

// Contact form submission endpoint
contactRouter.post('/send', async (req, res) => {
  try {
    const { email, mobile, content } = req.body;

    // Validate required fields
    if (!email || !mobile || !content) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Mobile validation (basic)
    const mobileRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number format',
      });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options for admin
    const adminMailOptions = {
      from: process.env.APP_NAME,
      to: process.env.EMAIL_USER,
      replyTo: email, // Set reply-to to the user's email so admin can reply directly
      subject: 'New Contact Form Submission - Stacodev Blog',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>From:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Mobile:</strong> ${mobile}</p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #007bff;">
              ${content.replaceAll('\n', '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This message was sent from the Stacodev Blog contact form. Reply to this email to respond directly to the sender.
          </p>
        </div>
      `,
    };

    // Send email to admin
    await transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Auto-response to user via email, SMS, and WhatsApp
    const autoResponseMessage = `Thank you for contacting Stacodev Blog! We have received your message and will get back to you within 24 hours.

Your inquiry: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"

Best regards,
Stacodev Blog Team`;

    const autoResults = {
      email: false,
      sms: false,
      whatsapp: false,
    };

    // ` 1. Send auto-response email to user
    try {
      console.log('1. Send auto-response email to user');
      const userAutoMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting Stacodev Blog',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Thank you for contacting Stacodev Blog
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Dear User,</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #007bff;">
                ${autoResponseMessage.replaceAll('\n', '<br>')}
              </div>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated response. We will review your message and respond personally within 24 hours.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(userAutoMailOptions);
      autoResults.email = true;
      console.log('Auto-response email sent to user:', email);
    } catch (emailError) {
      console.error('Error sending auto-response email:', emailError);
    }

    // ` 2. Send auto-response SMS to user (if Twilio is configured)

    const adminPhone = process.env.ADMIN_PHONE; // From your .env file
    const adminSmsBody = `New contact inquiry from ${email} (${mobile}): ${content.substring(
      0,
      100
    )}${content.length > 100 ? '...' : ''}`;
    try {
      await twilioService.sendSms(adminPhone, adminSmsBody);

      autoResults.sms = true;
    } catch (error) {
      console.log('Error To Send Text Message to User', error.message);
      autoResults.sms = false;
    }

    // ` 3. Send auto-response WhatsApp to user (using custom WhatsApp Business API integration)

    const whatsappMessage = `Thank you for contacting Stacodev Blog! We have received your message and will get back to you within 24 hours. Your inquiry: "${content.substring(
      0,
      100
    )}${content.length > 100 ? '...' : ''}"`;
    try {
      await sendWhatsAppMessage(mobile, whatsappMessage);

      autoResults.whatsapp = true;
    } catch (error) {
      console.log('Error To Send Whats App Message to User', error.message);
      autoResults.whatsapp = false;
    }

    // # Client Response
    const autoSuccessCount = Object.values(autoResults).filter(Boolean).length;
    console.log(
      `Auto-response sent via ${autoSuccessCount} method(s): ${
        autoResults.email ? 'Email' : ''
      }${autoResults.sms ? ', SMS' : ''}${
        autoResults.whatsapp ? ', WhatsApp' : ''
      }`
    );

    return res.status(200).json({
      success: true,
      message: `Message sent successfully! ${
        autoSuccessCount > 0
          ? `Auto-response sent via ${autoSuccessCount} method(s): ${
              autoResults.email ? 'Email ' : ''
            }${autoResults.sms ? 'SMS ' : ''}${
              autoResults.whatsapp ? 'WhatsApp' : ''
            }`.trim()
          : 'Auto-response could not be sent - check configuration.'
      }`,
      autoResponse: autoResults,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

export default contactRouter;
