"use server"

import { connectToDB } from "../mongodb"
import { Contact } from "../models/contact"
import nodemailer from "nodemailer"
import { Settings } from "../models/settings"

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactForm(formData: ContactForm) {
  try {
    // Connect to database
    await connectToDB()

    // Save to database
    const contact = await Contact.create({
      ...formData,
      read: false,
    })

    // Get email settings
    const settings = await Settings.findOne()

    // Always send email if email settings are configured
    if (settings?.emailSettings?.smtpHost && settings?.emailSettings?.smtpUser && settings?.emailSettings?.smtpPass) {
      // Send email notification
      const transporter = nodemailer.createTransport({
        host: settings.emailSettings.smtpHost,
        port: settings.emailSettings.smtpPort || 587,
        secure: settings.emailSettings.smtpPort === 465,
        auth: {
          user: settings.emailSettings.smtpUser,
          pass: settings.emailSettings.smtpPass,
        },
      })

     await transporter.sendMail({
  from: settings.emailSettings.emailFrom || `"Portfolio Contact" <${settings.emailSettings.smtpUser}>`,
  to: settings.emailSettings.emailTo || settings.email,
  subject: `New Contact Form: ${formData.subject}`,
  text: `
    Name: ${formData.name}
    Email: ${formData.email}
    
    Message:
    ${formData.message}
  `,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #eaeaea;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .logo {
          margin-bottom: 15px;
        }
        .title {
          color: #111827;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin: 8px 0 0;
        }
        .content {
          padding: 24px 0;
        }
        .message-card {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          border-left: 4px solid #6366f1;
        }
        .info-item {
          margin-bottom: 12px;
        }
        .label {
          font-weight: 600;
          color: #4b5563;
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }
        .value {
          color: #1f2937;
          font-size: 16px;
        }
        .message-content {
          white-space: pre-line;
          color: #374151;
          line-height: 1.7;
        }
        .footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
          color: #6b7280;
          font-size: 14px;
        }
        .timestamp {
          color: #9ca3af;
          font-size: 13px;
          margin-top: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h1 class="title">New Contact Message</h1>
          <p class="subtitle">Someone has reached out through your portfolio</p>
        </div>
        
        <div class="content">
          <div class="info-item">
            <span class="label">From</span>
            <div class="value">${formData.name}</div>
          </div>
          
          <div class="info-item">
            <span class="label">Email Address</span>
            <div class="value"><a href="mailto:${formData.email}" style="color: #6366f1; text-decoration: none;">${formData.email}</a></div>
          </div>
          
          <div class="info-item">
            <span class="label">Subject</span>
            <div class="value">${formData.subject}</div>
          </div>
          
          <div class="message-card">
            <span class="label">Message</span>
            <div class="message-content">${formData.message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This message was sent from your portfolio contact form</p>
          <p class="timestamp">${new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </body>
    </html>
  `,
})
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending contact form:", error)
    throw new Error("Failed to send contact form")
  }
}

