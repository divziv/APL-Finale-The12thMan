# CrowdSphere AI - Smart Stadium Crowd Monitoring System

A production-inspired MVP for AI-powered crowd monitoring and management in stadiums and large events.

## Overview

CrowdSphere AI is an enterprise-grade crowd management platform featuring:

- Real-time crowd density monitoring
- Interactive stadium heatmap visualization
- Live CCTV feed integration with AI indicators
- Dynamic alert system
- Crowd analytics and trend charts
- Emergency evacuation mode
- Mobile-responsive visitor interface
- AI-powered person detection using YOLOv8


## UI Components

The following are the main UI components found in `src/components/`:

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| AccessibilityControls         | Accessibility options for the dashboard           |
| AgenticActionConsole          | Agentic action logging and controls               |
| AnalyticsCharts               | D3-based analytics and crowd trends               |
| CheckpointStats               | Security checkpoint statistics                    |
| EmergencyManagement           | Emergency and incident management panel           |
| HappyPathController           | Happy path scenario controller                    |
| PlatformMobileSimulator       | Mobile platform simulation view                   |
| RoleAuthenticationCenter      | Role-based authentication and login               |
| StadiumCCTV                   | AI-powered CCTV feeds                            |
| StadiumControlMap             | Stadium control and navigation map                |
| StadiumMatchCenter            | Match center dashboard                           |
| StadiumSimulation3D           | 3D stadium digital twin                          |
| StadiumTicketingAndSwags      | Ticketing and swags management                   |
| StadiumTriageOperations       | Medical triage operations                        |
| TrafficAndIncidents           | Traffic and incident dashboard                   |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌─────────────────┐      ┌──────────────────────────┐   │
│  │  Admin Dashboard │      │   Mobile Visitor App   │   │
│  │  - Heatmap       │      │   - Event Info          │   │
│  │  - Live Feeds    │      │   - Navigation         │   │
│  │  - Analytics     │      │   - Alerts             │   │
│  │  - Emergency     │      │   - AI Assistant       │   │
│  └─────────────────┘      └──────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                SIMULATION LAYER                          │
│  - Zone population updates                                │
│  - Alert generation                                       │
│  - Metrics calculation                                    │
│  - Real-time data streaming                              │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│            AI SERVICE (Python FastAPI)                   │
│  ┌───────────────────────────────────────────────────┐   │
│  │           YOLOv8 Crowd Detection                  │   │
│  │  - Frame-by-frame person detection               │   │
│  │  - Video processing & analysis                   │   │
│  │  - Webcam live detection                         │   │
│  │  - REST API endpoints                            │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Project Structure

```
crowdsphere-ai/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── GlassCard.tsx     # Glassmorphism card
│   │   │   ├── Badge.tsx        # Status badges
│   │   │   └── MetricCard.tsx   # Dashboard metrics
│   │   ├── dashboard/
│   │   │   ├── StadiumHeatmap.tsx   # Interactive stadium map
│   │   │   ├── AlertFeed.tsx        # Live alert stream
│   │   │   ├── CCTVFeedPanel.tsx    # CCTV monitoring
│   │   │   ├── AnalyticsCharts.tsx  # Charts & graphs
│   │   │   ├── EmergencyPanel.tsx   # Evacuation controls
│   │   │   └── ZoneDetails.tsx      # Zone info modal
│   │   ├── Dashboard.tsx         # Admin dashboard
│   │   └── MobileApp.tsx         # Visitor mobile UI
│   ├── hooks/
│   │   └── useSimulation.ts      # Real-time data hooks
│   ├── data/
│   │   └── mockData.ts           # Simulation data
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   └── App.tsx                   # Main app component
│
├── ai-service/                   # Python AI service
│   ├── crowd_detection.py        # YOLOv8 detection module
│   ├── main.py                   # FastAPI server
│   └── requirements.txt          # Python dependencies
│
├── package.json
├── tailwind.config.js
└── README.md
```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts & analytics
- **Lucide React** - Icons

### AI Service
- **Python 3.9+**
- **FastAPI** - REST API
- **YOLOv8** - Person detection (pretrained)
- **OpenCV** - Video/image processing
- **Uvicorn** - ASGI server

## Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend runs on `http://localhost:5173`

### AI Service Setup

```bash
# Navigate to AI service
cd ai-service

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start API server
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --port 8000
```

The AI service runs on `http://localhost:8000`

### Using the AI Service

**Process a video file:**
```bash
python crowd_detection.py --source path/to/video.mp4 --json-output results.json
```

**Live webcam detection:**
```bash
python crowd_detection.py --source 0
```

**API endpoints:**
- `GET /` - Health check
- `POST /detect/frame` - Detect people in image
- `POST /detect/video` - Analyze video file
- `GET /simulate/{zone_id}` - Simulated detection

## Feature Details

### Admin Dashboard

1. **Metrics Overview**
   - Total crowd count
   - Active alerts counter
   - Safe/congested zone counts
   - System status indicator

2. **Stadium Heatmap**
   - Interactive SVG-based visualization
   - Real-time zone color changes (green/yellow/red)
   - Click zones for detailed information
   - Emergency mode visualization

3. **CCTV Feed Panel**
   - 6 simulated camera feeds
   - AI active indicators
   - Live people count overlays
   - Status badges

4. **Alert System**
   - Real-time simulated alerts
   - Severity-based color coding
   - Acknowledge functionality
   - Emergency alerts

5. **Analytics Charts**
   - Crowd trend line chart
   - Zone occupancy bar chart
   - Time range selection (1h/4h/12h)
   - Real-time updates

6. **Emergency Mode**
   - One-click activation
   - Dashboard theme change
   - Evacuation route panel
   - Emergency alerts

### Mobile Interface

1. **Home Screen**
   - Event details card
   - Ticket information
   - Current crowd status
   - Smart navigation suggestions

2. **Crowd Map**
   - Full heatmap view
   - Zone legend
   - Click for details

3. **Alerts**
   - Push notifications UI
   - Emergency alerts
   - Event updates

4. **AI Assistant**
   - Quick action buttons
   - Suggested queries

## API Integration

The frontend can connect to the AI service for real detection:

```typescript
// In your component
const detectCrowd = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('http://localhost:8000/detect/frame', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  // result: { people_count, confidence, status, timestamp }
};
```

## Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy the 'dist' folder to Vercel
```

### AI Service (Docker)

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY ai-service/requirements.txt .
RUN pip install -r requirements.txt
COPY ai-service/ .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Scalability Notes

### For Production

1. **Database**: Add Supabase/PostgreSQL for persistent data
2. **Real-time**: Implement WebSockets for live updates
3. **Authentication**: Add Supabase Auth for user management
4. **CCTV Integration**: Connect to real RTSP streams
5. **AI Scaling**: Use GPU instances or cloud ML services
6. **Monitoring**: Add logging, metrics, and alerting

### Architecture Enhancements

- Microservices for zone management, alerts, analytics
- Message queue (Redis/RabbitMQ) for event streaming
- Redis for caching real-time data
- CDN for static assets
- Horizontal scaling for AI service

## AI Detection Details

The YOLOv8 model used is pretrained on the COCO dataset:
- Class 0 (person) is used for crowd detection
- Confidence threshold: 0.5 (configurable)
- Models: nano (fastest) to xlarge (most accurate)

For production:
- Fine-tune on stadium-specific data
- Add tracking for accurate counts
- Implement zone-based detection

## License

MIT License

## Credits

Built with:
- [YOLOv8](https://github.com/ultralytics/ultralytics) - Object detection
- [Recharts](https://recharts.org/) - Charts
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons
