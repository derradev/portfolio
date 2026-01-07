# Database Setup for William Malone Portfolio

## 🚨 **Important: GPA Column Migration**

If you encounter the error:
```
column education.gpa does not exist
```

You need to run the GPA migration script:

### **Option 1: Quick Migration**
Run the `migrate_gpa.sql` script in your Supabase SQL editor:
```sql
-- Copy and paste the entire contents of migrate_gpa.sql
```

### **Option 2: Manual Column Addition**
If the migration script fails, run this manually:
```sql
ALTER TABLE education 
ADD COLUMN gpa DECIMAL(3,2);

-- Update existing records
UPDATE education 
SET gpa = CASE 
    WHEN grade LIKE '%Distinction%' THEN 3.67
    WHEN grade LIKE '%DDM%' THEN 3.67
    WHEN grade LIKE '%Merit%' THEN 3.33
    WHEN grade LIKE '%Pass%' THEN 2.67
    ELSE 3.0
END
WHERE gpa IS NULL;
```

### **Option 3: Fresh Setup**
If starting fresh, the updated `database_setup.sql` already includes the GPA column.

## 🛡️ Overview

This document explains how to set up the Supabase database for William Malone's cybersecurity portfolio website.

## 📋 Files Created

1. **`database_setup.sql`** - Complete database schema with tables, indexes, and policies
2. **`seed_data.sql`** - Sample data tailored to William's background and goals
3. **`setup_database.sh`** - Helper script to run the setup

## 🗄️ Database Schema

The database includes the following tables:

### **Core Tables**
- `profiles` - User profiles (extends Supabase auth)
- `projects` - Security projects and Python scripts
- `blog_posts` - Cybersecurity and IT support articles
- `work_history` - IT work experience
- `education` - Educational background
- `certifications` - Security certifications
- `learning` - Current learning goals and progress
- `skills` - Technical skills with proficiency levels
- `feature_flags` - Website feature toggles

### **Security Features**
- **Row Level Security (RLS)** enabled on all tables
- **Admin-only access** for william.malone80@gmail.com
- **Public read access** for portfolio content
- **Automatic timestamps** with triggers

## 🚀 Quick Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Run Schema Setup**
   - Open `database_setup.sql`
   - Copy and paste the entire file into the SQL Editor
   - Click "Run" to execute

3. **Add Sample Data**
   - Open `seed_data.sql`
   - Copy and paste into the SQL Editor
   - Click "Run" to execute

### Option 2: Using Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Run Setup Script**
   ```bash
   chmod +x setup_database.sh
   ./setup_database.sh
   ```

## 📊 Sample Data Included

### **William's Background**
- **Education**: BTEC IT Support & Networking, IT Apprenticeship
- **Work History**: IT Support Engineer experience
- **Skills**: Active Directory, Windows Server, Python, etc.
- **Learning**: Security+, Python automation, Home lab setup

### **Sample Projects**
- Security Analysis Tool (Python)
- Python Automation Scripts
- Home Lab Network Setup

### **Sample Blog Posts**
- "My Journey from IT Support to Cybersecurity"
- "Setting Up My Home Security Lab"
- "Python Scripts for IT Automation"

## 🔐 Security Configuration

### **Row Level Security Policies**
- Public users can **read** all portfolio content
- Only `william.malone80@gmail.com` can **write/edit** content
- Authenticated users can view their own profile

### **Admin Access**
The admin panel is configured to only allow William's email address:
```
william.malone80@gmail.com
```

## 🌐 Environment Variables

Update your environment files with the Supabase credentials:

### **Frontend** (`packages/frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://bughmfyuoikmfvxeeemq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://api.william-malone.com
```

### **Backend** (`packages/backend/.env`)
```env
SUPABASE_URL=https://bughmfyuoikmfvxeeemq.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_CONNECTION_STRING=your_connection_string
```

### **Admin** (`packages/admin/.env.local`)
```env
VITE_API_URL=http://localhost:3001
VITE_API_URL_PROD=https://api.william-malone.com
```

## 🚦 Development Workflow

1. **Start Backend**
   ```bash
   cd packages/backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd packages/frontend
   npm run dev
   ```

3. **Start Admin Panel**
   ```bash
   cd packages/admin
   npm run dev
   ```

## 📱 Access Points

- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3002
- **API**: http://localhost:3001
- **Database**: https://app.supabase.com

## 🛠️ Customization

### **Adding Your Content**

1. **Projects**: Add your security tools and Python scripts
2. **Blog Posts**: Write about your cybersecurity journey
3. **Certifications**: Add as you earn them
4. **Learning Items**: Track your study progress
5. **Skills**: Update your technical expertise

### **Modifying Sample Data**

All sample data is clearly marked and can be:
- **Updated** with your actual information
- **Deleted** once you add real content
- **Modified** to match your style

## 🔍 Verification

After setup, verify everything works:

1. **Check Database**
   - Browse tables in Supabase dashboard
   - Verify sample data is present

2. **Test API Endpoints**
   ```bash
   curl http://localhost:3001/api/projects
   curl http://localhost:3001/api/blog
   ```

3. **Check Frontend**
   - Visit http://localhost:3000
   - Verify data loads correctly

4. **Test Admin Panel**
   - Visit http://localhost:3002
   - Login with your email
   - Try adding/editing content

## 🚨 Troubleshooting

### **Common Issues**

1. **Permission Errors**
   - Check RLS policies in database
   - Verify admin email is correct

2. **API Connection Issues**
   - Check environment variables
   - Verify backend is running

3. **Data Not Loading**
   - Check CORS settings
   - Verify API URLs in frontend

### **Getting Help**

1. **Check Supabase Logs**
   - Dashboard → Settings → Logs

2. **Review Database Policies**
   - Dashboard → Authentication → Policies

3. **Test Individual Queries**
   - Use Supabase SQL Editor to debug

## 📈 Next Steps

1. **Replace Sample Data**
   - Add your actual projects
   - Write your own blog posts
   - Update your real work experience

2. **Customize Design**
   - Update colors and styling
   - Add your personal branding

3. **Deploy to Production**
   - Configure Vercel deployment
   - Set up custom domains
   - Enable SSL certificates

---

**🎉 Your cybersecurity portfolio database is now ready to showcase your IT expertise and security journey!**

For questions or issues, refer to the Supabase documentation or check the database logs in your Supabase dashboard.
