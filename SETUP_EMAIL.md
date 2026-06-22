# 📧 Email Export Setup Guide

Your NYSC Survey Platform can now **automatically send Excel exports to info@axplimited.com**!

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Free Brevo Account

1. Go to: **https://www.brevo.com/**
2. Click **"Sign Up"** (completely FREE, no credit card required)
3. Verify your email
4. Go to **Settings → API Keys**
5. Click **"Create New API Key"**
6. Copy the API key

### Step 2: Update .env File

Edit `.env` file in your project root and add:

```env
BREVO_API_KEY=your-copied-api-key-here
EMAIL_USER=your-brevo-email@brevo.com
PORT=3001
```

### Step 3: Start Backend Server

Run both frontend and backend simultaneously:

```powershell
npm run dev:full
```

This runs:
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:3001

### Step 4: Test Email Export

1. Fill out the survey form completely
2. Click "Admin →" URL parameter: `?admin=true`
3. Login with password: `admin123`
4. Click **"📧 Email All Records"**
5. Check info@axplimited.com for the Excel file!

---

## 📊 Admin Panel Features

### Export Options:

| Button | Function | When to Use |
|--------|----------|-----------|
| **📊 Export All Records** | Download all data as .xlsx to your computer | Manual backup |
| **📋 Export Selected** | Download selected records to your computer | Specific records |
| **📧 Email All Records** | Send all data to info@axplimited.com | Daily/weekly reports |
| **📧 Email Selected** | Send selected records to info@axplimited.com | Targeted reports |

---

## ⚙️ Advanced: Gmail Alternative

If you prefer Gmail instead of Brevo:

### 1. Enable 2FA on Gmail
- Go to: https://myaccount.google.com/security
- Enable 2-Step Verification

### 2. Create App Password
- https://myaccount.google.com/apppasswords
- Select: Mail & Windows PC
- Google generates a 16-character password

### 3. Update .env
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

### 4. Update server.js
Uncomment Gmail config and comment Brevo (already in code)

---

## 🔒 Security Notes

- ✅ API keys are stored locally in `.env`
- ✅ `.env` is in `.gitignore` (not committed to GitHub)
- ✅ Emails sent via secure SMTP
- ✅ Backend runs locally on port 3001
- ⚠️ BEFORE PRODUCTION: Use environment variables in your hosting provider

---

## 📱 Deployment to Production

When deploying to nysc.axplimited.com:

1. Set environment variables in your hosting provider's dashboard (not in .env file)
2. Backend should run on same server as frontend
3. Update `VITE_API_URL` to your domain (e.g., `https://nysc.axplimited.com`)

---

## 🐛 Troubleshooting

**"❌ Failed to send email: Backend not running"**
- Make sure you ran `npm run dev:full`
- Check backend is running on http://localhost:3001

**"Email sent but nothing received"**
- Check spam folder for info@axplimited.com
- Verify email address is correct in admin panel
- Check Brevo/Gmail console for errors

**"❌ Error: BREVO_API_KEY is missing"**
- Update .env with your API key
- Restart the server after changing .env

---

## 📞 Support

If you need help:
1. Check the error message in browser console (F12)
2. Check terminal output for backend errors
3. Verify .env file has API key set

Happy emailing! 🎉
