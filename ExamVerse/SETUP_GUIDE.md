# 🚀 Quick Setup Guide for ExamVerse

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend` folder by copying `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

### Required API Keys:

1. **MongoDB Atlas** (Free)
   - Visit: https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Replace in MONGODB_URI

2. **Google Gemini API** (Free)
   - Visit: https://makersuite.google.com/app/apikey
   - Create API key
   - Replace in GEMINI_API_KEY

3. **YouTube Data API** (Free)
   - Visit: https://console.cloud.google.com/
   - Enable YouTube Data API v3
   - Create credentials → API Key
   - Replace in YOUTUBE_API_KEY

4. **JWT Secret**
   - Generate random string (e.g., use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - Replace in JWT_SECRET

## Step 3: Start Backend Server

```bash
cd backend
npm start
```

Backend runs on: http://localhost:5000

## Step 4: Start Frontend

Open a new terminal:

```bash
cd frontend
# Using Python
python -m http.server 3000

# OR using Node.js
npx http-server -p 3000
```

Frontend runs on: http://localhost:3000

## Step 5: Test the Application

1. Open browser: http://localhost:3000
2. Click "Get Started" or "Register"
3. Create a student account
4. Explore the dashboard

## 🎯 Test Credentials

You can create test accounts:

**Student Account:**
- Name: John Doe
- Email: student@test.com
- Password: test123
- College: MIT
- Course: B.Tech
- Year: 2nd Year

**Faculty Account:**
- Name: Prof. Smith
- Email: faculty@test.com
- Password: test123
- College: MIT
- Role: Faculty

## 📝 Quick Test Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend accessible on port 3000
- [ ] Can register new user
- [ ] Can login
- [ ] Student can view dashboard
- [ ] Faculty can upload papers (after verification)
- [ ] AI solution generation works
- [ ] YouTube video search works
- [ ] PDF upload and view works

## 🐛 Common Issues

**MongoDB Connection Error:**
- Whitelist your IP in MongoDB Atlas
- Check connection string format

**API Key Errors:**
- Verify all API keys are set in .env
- Check API quotas in respective consoles

**Port Already in Use:**
- Change PORT in .env (backend)
- Use different port for frontend

## 🎨 Features to Test

1. **Landing Page** - Animated hero, glassmorphism cards
2. **Authentication** - Register/Login with role selection
3. **Student Dashboard** - Search, filter, view papers
4. **Paper Viewer** - PDF display, AI solutions, video tutorials
5. **Faculty Dashboard** - Drag-drop upload, manage papers
6. **Responsive Design** - Test on mobile/tablet

## 📞 Need Help?

Check the main README.md for detailed documentation.

Happy coding! 🚀
