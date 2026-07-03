# 🗄️ Supabase Database Setup Guide

## ✅ What's Included

Your NYSC Survey Platform now has:
- ✅ **Cloud Database** - All survey data stored in Supabase
- ✅ **Real-time Sync** - Data updates across all users instantly
- ✅ **Persistent Storage** - Data survives browser refresh/redeploy
- ✅ **Free Tier** - Up to 500MB storage, 50k requests/month

---

## 🚀 5-Minute Setup

### **Step 1: Create Supabase Account**

1. Go to: **https://supabase.com/**
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new organization (name it "AXP Solutions")
5. Create a new project:
   - Name: `nysc-survey-db`
   - Region: Select closest to Nigeria (e.g., Europe - Dublin or US - East Coast)
   - Database password: Save this securely!
6. **Wait 3-5 minutes** for setup

---

### **Step 2: Get API Keys**

1. Open your project
2. Go to **Settings** (bottom left) → **API**
3. Copy these values:
   - **Project URL** - looks like `https://xyz123.supabase.co`
   - **Anon Public** - long key starting with `eyJhbG...`

---

### **Step 3: Create Database Table**

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste this SQL and click **Run**:

```sql
CREATE TABLE survey_responses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  age TEXT,
  gender TEXT,
  current_status TEXT,
  ownership_statement TEXT,
  state TEXT,
  field_of_study TEXT,

  believe_home_before_35 TEXT,
  ideal_home_age TEXT,
  home_type TEXT,
  biggest_obstacle TEXT,
  preferred_city TEXT,
  preferred_city_other TEXT,

  saves_monthly TEXT,
  monthly_savings_amount TEXT,
  will_join_savings_plan TEXT,
  equity_contribution TEXT,

  preferred_product TEXT,
  would_join_small_amount TEXT,
  wants_investment_returns TEXT,
  desired_benefits TEXT[],

  wants_early_access TEXT,
  wants_free_assessment TEXT,

  full_name TEXT,
  phone_number TEXT,
  email_address TEXT,

  eligibility_status TEXT
);

-- Create index for faster queries
CREATE INDEX idx_survey_created_at ON survey_responses(created_at DESC);
CREATE INDEX idx_survey_eligibility ON survey_responses(eligibility_status);
```

If you already have an earlier version of the table, run this update instead:

```sql
ALTER TABLE survey_responses
  ADD COLUMN ownership_statement TEXT,
  ADD COLUMN preferred_city_other TEXT,
  ADD COLUMN desired_benefits TEXT[];
```

---

### **Step 4: Update Your .env File**

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (paste your anon key)
```

**Example:**
```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **Step 5: Install & Test**

```powershell
cd "c:\Users\admin\OneDrive\Desktop\NYSC QUESTIONAIRE"
npm install
npm run dev:full
```

Open: **http://localhost:5175/**

1. Fill out survey
2. Submit ✓
3. Check admin panel - data should appear instantly!

---

## 🌍 Deploy to Vercel with Supabase

### **Step 1: Add Environment Variables to Vercel**

1. Go to your **Vercel project**
2. Click **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_SUPABASE_URL = your-supabase-url
   VITE_SUPABASE_ANON_KEY = your-anon-key
   BREVO_API_KEY = your-brevo-key
   EMAIL_USER = your-email@brevo.com
   ```

### **Step 2: Update API URL**

Update `VITE_API_URL` for production:
```
VITE_API_URL = https://your-vercel-domain.vercel.app
```

### **Step 3: Redeploy**

```bash
git add .
git commit -m "Add Supabase database integration"
git push
```

Vercel will auto-deploy!

---

## 📊 Admin Panel Features with Supabase

✅ **View All Responses** - Real-time from database  
✅ **Filter by Status** - See High Priority, Qualified, etc.  
✅ **Export to Excel** - All records in one file  
✅ **Email Export** - Send directly to info@axplimited.com  
✅ **Persistent Data** - Survives browser refresh & redeploy  

---

## 🔒 Security Best Practices

### **Production Checklist:**

1. ✅ **Row Level Security (RLS)** - Restrict direct database access
   ```sql
   ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
   ```

2. ✅ **Set Admin Password** - Change from `admin123` to something secure

3. ✅ **Use Vercel Environment Variables** - Never commit secrets to GitHub

4. ✅ **Backup Regularly** - Supabase has automatic backups (Pro plan)

---

## 💰 Supabase Pricing

| Feature | Free Tier | Cost |
|---------|-----------|------|
| Storage | 500 MB | ✅ Included |
| API Requests | 50,000/month | ✅ Included |
| Users | Unlimited | ✅ Included |
| Uptime | 99.9% | ✅ Included |

**When to upgrade:** If you exceed 500MB storage or 50k requests

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to database" | Check `.env` has correct URL and Anon Key |
| Data not saving | Verify table was created (SQL step) |
| Environment vars not working | Restart dev server after updating `.env` |
| Vercel deployment fails | Add all env vars to Vercel Settings |

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: https://github.com/supabase/supabase

Ready to set up? Let me know once you have your Supabase credentials! 🚀
