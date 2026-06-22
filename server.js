import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Configure email transporter with Brevo
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-brevo-email@brevo.com',
    pass: process.env.BREVO_API_KEY || ''
  }
})

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error)
  } else {
    console.log('✅ Email service ready')
  }
})

// Endpoint to send Excel export via email
app.post('/api/send-export', async (req, res) => {
  try {
    const { excelData, filename } = req.body

    if (!excelData || !filename) {
      return res.status(400).json({ error: 'Missing excelData or filename' })
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(excelData, 'base64')

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@axplimited.com',
      subject: `NYSC Survey Export - ${new Date().toLocaleDateString()}`,
      html: `
        <h2>NYSC Survey Data Export</h2>
        <p>Attached is the latest survey data export from NYSC eligibility survey.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</p>
        <p>Best regards,<br/>AXP Solutions Survey System</p>
      `,
      attachments: [
        {
          filename: filename,
          content: buffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ]
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log(`✅ Email sent to info@axplimited.com - ${info.messageId}`)
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId 
    })

  } catch (error) {
    console.error('❌ Error sending email:', error)
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running ✓' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
})
