# 🎓 ExamVerse - Getting Started

## ✅ What's Been Built

I've created a **complete full-stack EdTech platform** with:

### ✨ Features Implemented:
- ✅ Modern landing page with glassmorphism design & animations
- ✅ User authentication (Student & Faculty roles)
- ✅ Student dashboard with search, filters, and paper browsing
- ✅ PDF viewer with AI-powered solutions (Gemini API)
- ✅ YouTube video solution integration
- ✅ Faculty dashboard with drag-and-drop PDF upload
- ✅ Save/bookmark papers functionality
- ✅ Upvote and download tracking
- ✅ Fully responsive design for mobile & desktop
- ✅ JWT-based authentication
- ✅ MongoDB database integration
- ✅ RESTful API backend

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Environment Variables

Copy the example file and add your API keys:
```bash
cd backend
copy .env.example .env
```

Edit `.env` and add:
- MongoDB Atlas connection string
- Google Gemini API key (free from https://makersuite.google.com/app/apikey)
- YouTube Data API key (free from Google Cloud Console)
- JWT secret (any random string)

### Step 2: Install & Start Backend

```bash
cd backend
npm install
npm start
```

Backend will run on http://localhost:5000

### Step 3: Open Frontend

Simply open `frontend/index.html` in your browser, or use a local server:

```bash
cd frontend
python -m http.server 3000
```

Then visit http://localhost:3000

## 📁 Project Structure

```
ExamVerse/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas (User, QuestionPaper)
│   ├── controllers/  # Business logic (auth, papers, AI, YouTube)
│   ├── routes/       # API endpoints
│   ├── middleware/   # JWT auth middleware
│   └── server.js     # Main server file
│
└── frontend/         # HTML + Tailwind CSS + Vanilla JS
    ├── index.html           # Landing page
    ├── login.html           # Login page
    ├── register.html        # Registration page
    ├── dashboard.html       # Student dashboard
    ├── paper-view.html      # PDF viewer & solutions
    ├── faculty-dashboard.html # Faculty upload page
    ├── css/styles.css       # Custom animations & glassmorphism
    └── js/                  # JavaScript modules
```

## 🎯 Key Technologies

**Frontend:**
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Glassmorphism UI
- Font Awesome icons

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Google Gemini AI
- YouTube Data API

## 🔑 Getting API Keys (All Free!)

### 1. MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account & cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for dev)
5. Get connection string

### 2. Google Gemini API
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### 3. YouTube Data API
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. Copy the key

## 🎨 Design Highlights

- **Glassmorphism cards** with backdrop blur
- **Animated gradient backgrounds** with floating blobs
- **Smooth transitions** on all interactions
- **Responsive grid layouts** for all screen sizes
- **Dark theme** with purple/blue accent colors
- **Toast notifications** for user feedback
- **Loading states** and skeleton screens

## 📱 User Flows

### Student Journey:
1. Register → Select college, course, year
2. Browse papers → Use filters & search
3. View paper → See PDF, get AI solutions
4. Watch videos → YouTube tutorials in modal
5. Save papers → Bookmark for later

### Faculty Journey:
1. Register as faculty → Wait for verification
2. Upload papers → Drag & drop PDF
3. Add solutions → Optional text solutions
4. Manage papers → View stats, delete papers

## 🧪 Testing the App

1. **Create Student Account:**
   - Email: student@test.com
   - Password: test123
   - Select any college/course/year

2. **Create Faculty Account:**
   - Email: faculty@test.com
   - Password: test123
   - Note: Will need verification (set manually in DB)

3. **Test Features:**
   - Upload a sample PDF as faculty
   - Browse papers as student
   - Generate AI solution
   - Search YouTube videos
   - Save/unsave papers

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
- Check if MongoDB Atlas IP is whitelisted
- Verify connection string in .env

**"API key invalid"**
- Ensure all API keys are correctly copied
- Check for extra spaces in .env file

**"Port 5000 already in use"**
- Change PORT in .env to 5001 or another port
- Update frontend config.js BASE_URL accordingly

## 📚 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Papers
- GET `/api/papers` - Get all papers (with filters)
- GET `/api/papers/:id` - Get single paper
- POST `/api/papers` - Upload paper (Faculty)
- DELETE `/api/papers/:id` - Delete paper (Faculty)

### AI & YouTube
- POST `/api/ai/generate-solution` - Generate AI answer
- POST `/api/youtube/search` - Search videos

## 🎓 Next Steps

1. **Get API Keys** - Follow the guide above
2. **Configure .env** - Add all credentials
3. **Start Backend** - Run `npm start` in backend folder
4. **Open Frontend** - Launch index.html
5. **Test Features** - Create accounts and explore!

## 📖 Full Documentation

See `README.md` for complete documentation including:
- Detailed API reference
- Deployment instructions
- Contributing guidelines
- Architecture details

---

**Built with ❤️ for students**

Need help? Check SETUP_GUIDE.md or README.md for more details!
