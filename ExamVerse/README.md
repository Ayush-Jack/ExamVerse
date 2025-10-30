# 🎓 ExamVerse - AI-Powered EdTech Platform

ExamVerse is a modern, full-stack web application that helps college and competitive exam students access previous year papers with AI-powered solutions and video tutorials.

![ExamVerse](https://img.shields.io/badge/ExamVerse-AI%20EdTech-purple)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## ✨ Features

### For Students
- 📚 **Access Previous Year Papers** - Browse thousands of question papers from colleges
- 🤖 **AI-Powered Solutions** - Get instant solutions using Google Gemini AI
- 🎥 **Video Solutions** - Watch curated YouTube tutorials for better understanding
- 🔍 **Smart Search & Filters** - Find papers by subject, year, and college
- 💾 **Save Favorites** - Bookmark important papers for quick access
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

### For Faculty
- 📤 **Upload Question Papers** - Easy drag-and-drop PDF upload
- ✍️ **Add Solutions** - Provide official solutions to papers
- 📊 **Track Engagement** - View downloads, views, and upvotes
- ✅ **Verification System** - Faculty accounts are verified by admins

## 🚀 Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Tailwind CSS for styling
- Glassmorphism UI design
- Smooth animations and transitions

### Backend
- Node.js + Express.js
- MongoDB (Atlas) for database
- JWT Authentication
- Multer for file uploads

### APIs & Services
- **Google Gemini AI** - AI-generated solutions
- **YouTube Data API** - Video solution search
- **MongoDB Atlas** - Cloud database (Free tier)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier)
- Google Gemini API key
- YouTube Data API key

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ExamVerse
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/examverse?retryWrites=true&w=majority

# JWT Secret (Generate a random secure string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Gemini API Key (Get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# YouTube Data API Key (Get from https://console.cloud.google.com/)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Get API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

#### YouTube Data API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. Copy the key to your `.env` file

#### MongoDB Atlas Setup
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

### 4. Start the Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

### 5. Frontend Setup

The frontend uses CDN-based Tailwind CSS, so no build process is needed. Simply open the frontend files in a web browser or use a local server:

```bash
cd frontend
# Using Python
python -m http.server 3000

# Or using Node.js http-server
npx http-server -p 3000
```

Visit `http://localhost:3000` in your browser.

### 6. Update API Configuration

In `frontend/js/config.js`, update the `BASE_URL` if needed:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    // ... rest of config
};
```

## 📁 Project Structure

```
ExamVerse/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── paperController.js
│   │   ├── aiController.js
│   │   └── youtubeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── QuestionPaper.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── papers.js
│   │   ├── ai.js
│   │   └── youtube.js
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── animations.js
│   │   ├── config.js
│   │   ├── paper-view.js
│   │   └── faculty-dashboard.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── paper-view.html
│   └── faculty-dashboard.html
└── README.md
```

## 🎯 Usage

### Student Flow
1. **Register/Login** as a student
2. Select your college, course, and year
3. **Browse papers** from the dashboard
4. Use **filters** to find specific papers
5. **View paper** and access PDF
6. **Generate AI solutions** for questions
7. **Watch video tutorials** from YouTube
8. **Save papers** for later reference

### Faculty Flow
1. **Register/Login** as faculty
2. Wait for admin verification
3. **Upload question papers** (PDF)
4. Add optional solutions
5. **Manage uploaded papers**
6. Track paper engagement

## 🔐 Authentication

- JWT-based authentication
- Passwords hashed with bcrypt
- Role-based access control (Student/Faculty)
- Protected routes with middleware

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Gradient Backgrounds** - Dynamic animated gradients
- **Smooth Animations** - Fade-in, hover, and scroll effects
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Eye-friendly dark interface

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect to Render/Railway
3. Add environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Push frontend to GitHub
2. Connect to Netlify/Vercel
3. Set build command: `# No build needed`
4. Set publish directory: `frontend`
5. Deploy

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Papers
- `GET /api/papers` - Get all papers (with filters)
- `GET /api/papers/:id` - Get single paper
- `POST /api/papers` - Upload paper (Faculty only)
- `PUT /api/papers/:id` - Update paper (Faculty only)
- `DELETE /api/papers/:id` - Delete paper (Faculty only)
- `POST /api/papers/:id/download` - Increment download count
- `POST /api/papers/:id/upvote` - Toggle upvote
- `POST /api/papers/:id/save` - Save/unsave paper

### AI Solutions
- `POST /api/ai/generate-solution` - Generate AI solution
- `GET /api/ai/solutions/:paperId` - Get saved solutions
- `POST /api/ai/summarize` - Summarize topic

### YouTube
- `POST /api/youtube/search` - Search videos

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

### API Key Errors
- Verify API keys are correctly set in `.env`
- Check API quotas and limits
- Ensure APIs are enabled in Google Cloud Console

### File Upload Issues
- Check `uploads/` directory exists and has write permissions
- Verify file size limits (default 10MB)
- Ensure PDF MIME type is allowed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@examverse.com or open an issue on GitHub.

## 🌟 Acknowledgments

- Google Gemini AI for intelligent solutions
- YouTube Data API for video content
- MongoDB Atlas for database hosting
- Tailwind CSS for beautiful styling

---

**Built with ❤️ for students by students**

🚀 **Happy Learning with ExamVerse!**
