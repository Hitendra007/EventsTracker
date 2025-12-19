# 📊 User Analytics Application



![Dashboard Preview](https://img.shields.io/badge/Status-Complete-success)

## 📸 Screenshots

### 1. Dashboard – Sessions View
![Sessions View](backend/public/1.png)

### 2. Dashboard – User Journey
![User Journey](backend/public/2.png)

### 3. Dashboard – Heatmap View
![Heatmap View](backend/public/3.png)

## 🎯 Features

### Event Tracking
- ✅ JavaScript tracking script for any webpage
- ✅ Automatic page view tracking
- ✅ Click event tracking with X/Y coordinates
- ✅ Session management via localStorage
- ✅ Real-time event transmission to backend

### Analytics Dashboard
- 📊 **Sessions View**: List all user sessions with event counts
- 🗺️ **User Journey**: Ordered timeline of user interactions per session
- 🎯 **Heatmap**: Visual representation of click positions on pages
- 🎨 Modern, responsive UI with smooth animations

### Backend API
- 🔌 RESTful API endpoints for event management
- 💾 MongoDB integration for data persistence
- ⚡ Efficient aggregation queries for analytics
- 🛡️ Error handling and validation

## 🛠️ Tech Stack

**Frontend**
- React 18.2.0
- Vite (Build tool)
- Axios (HTTP client)
- Lucide React (Icons)
- Tailwind CSS (Styling)

**Backend**
- Node.js 22.x
- Express.js
- MongoDB
- CORS enabled

**Tracking Script**
- Vanilla JavaScript (no dependencies)
- localStorage for session persistence

## 📁 Project Structure

```
user-analytics-app/
│
├── backend/
│   ├── controllers/
│   │   └── eventController.js      # API logic
│   ├── models/
│   │   └── event.model.js          # MongoDB schema
│   ├── routes/
│   │   └── event.route.js          # API endpoints
│   ├── db/
│   │   └── index.js                # Database connection
│   ├── Utils/
│   │   ├── ApiError.js             # Error handler
│   │   ├── ApiResponse.js          # Response wrapper
│   │   └── asyncHandler.js         # Async wrapper
│   ├── public/
│   │   └── tracker.js              # Tracking script
│   ├── app.js                      # Express app
│   ├── index.js                    # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Dashboard component
│   │   ├── main.jsx                # React entry
│   │   └── index.css               # Tailwind styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── demo/
│   ├── index.html                  # Demo page 1
│   └── page2.html                  # Demo page 2
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js v22.21.1 or higher
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```
git clone https://github.com/yourusername/user-analytics-app.git
cd user-analytics-app
```

### 2. Backend Setup
```
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=8000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=useranalytics
CORS_ORIGIN=*
NODE_ENV=development
EOF

# Start backend
npm run dev
```

Backend runs on `http://localhost:8000`

### 3. Frontend Setup
```
cd frontend
npm install

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. MongoDB Setup
```
# Option 1: Local MongoDB
mongod

# Option 2: MongoDB Atlas
# Update MONGODB_URI in .env with your Atlas connection string
```

### 5. Test Tracking
Open `demo/index.html` in your browser:
```
# Serve demo pages (from project root)
npx serve demo
```

Visit `http://localhost:3000` and interact with the demo pages.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/events` | Store new event |
| `GET` | `/api/v1/events/sessions` | Fetch all sessions with event counts |
| `GET` | `/api/v1/events/sessions/:sessionId` | Fetch all events for a session |
| `GET` | `/api/v1/events/heatmap?pageurl=<url>` | Fetch click data for heatmap |
| `GET` | `/api/v1/events/pages` | Fetch all unique page URLs |

### Example API Usage

**Store Event**
```
curl -X POST http://localhost:8000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "sessionid": "session123",
    "eventtype": "click",
    "pageurl": "http://example.com",
    "timestamp": 1734567890000,
    "clickx": 250,
    "clicky": 150
  }'
```

**Get Sessions**
```
curl http://localhost:8000/api/v1/events/sessions
```

## 🎨 Using the Tracking Script

Add to any webpage:
```
<script src="http://localhost:8000/tracker.js"></script>
```

The script automatically:
- Generates/retrieves session ID from localStorage
- Tracks page views on load
- Tracks all click events with coordinates
- Sends data to backend API

## 🔑 Key Implementation Details

### Session Management
- Session ID format: `session{timestamp}{random}`
- Stored in `localStorage` as `analytics_session_id`
- Persists across page navigations [file:2]

### Event Schema
```
{
  sessionid: String (required, indexed),
  eventtype: String (required), // "pageview" or "click"
  pageurl: String (required),
  timestamp: Number (required),
  clickx: Number (optional),
  clicky: Number (optional)
}
```

### Dashboard Features
1. **Sessions View**: Lists all sessions sorted by most recent activity
2. **User Journey**: Shows chronological event timeline for selected session
3. **Heatmap**: Visualizes click positions as animated dots on a canvas 

## 🤔 Assumptions & Trade-offs

### Assumptions
- Single-user environment (no authentication required)
- All timestamps in Unix milliseconds
- Session ID stored in localStorage (not cookies)
- Click coordinates relative to viewport [file:2]

### Trade-offs
1. **localStorage vs Cookies**: Used localStorage for simplicity; cookies would persist across browser sessions
2. **Heatmap Visualization**: Simple dot-based visualization instead of density heatmap (faster rendering)
3. **Real-time Updates**: Polling not implemented; manual refresh required
4. **CORS**: Wide-open in development (`CORS_ORIGIN=*`) - should restrict in production

## 🎯 Future Enhancements

- [ ] Real-time dashboard updates via WebSocket
- [ ] Advanced heatmap with density gradients
- [ ] Export analytics data as CSV/JSON
- [ ] User authentication and multi-tenant support
- [ ] Performance metrics (page load time, etc.)
- [ ] Filter sessions by date range
- [ ] Docker containerization

## 🧪 Testing

### Test Event Tracking
1. Open demo pages in browser
2. Open Developer Console (F12)
3. Click around and navigate between pages
4. Observe events logged in console

### Test Dashboard
1. Generate events using demo pages
2. Open dashboard at `http://localhost:5173`
3. Verify sessions appear in Sessions View
4. Click a session to see User Journey
5. Switch to Heatmap View and select a page URL

## 📦 Dependencies

### Backend
```
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### Frontend
```
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0",
  "lucide-react": "^0.263.1"
}
```
