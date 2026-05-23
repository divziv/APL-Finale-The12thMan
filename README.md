# The 12th Man - Stadium Command Operations (V2)

**"The invisible teammate orchestrating real-time crowd safety and stadium logistics."**

![Cover Image Mock](https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop)

## Overview

The 12th Man is an enterprise-grade AI-powered **Stadium Intelligence System** built to handle extreme crowd dynamics, real-time safety telemetry, and smart logistical routing. Initially designed as a command dashboard, V2 transforms the architecture into a **fully simulated digital twin** of major cricket stadiums (focusing on M. Chinnaswamy Stadium).

Built to feel like an *IPL Broadcast Control Room*, the interface uses dynamic team themes, actual Google Authentication, AI CCTV image analysis, and a robust `requestAnimationFrame` driven telemetry simulator.

## Features

- **3D Stadium Digital Twin (`Three.js / React-Three-Fiber`)**: A rotating 3D representation of the stadium bowl where individual stands glow (Optimal -> Congested -> Critical) based on live occupancy.
- **Simulated Real-Time Engine**: The `SimulationEngine` injects live "Wicket", "Six", and "Innings Break" events that actively alter global density indices, making the dashboard feel incredibly alive.
- **Smart Routing Intelligence**: Dynamically detects when "Food Court A" hits a critical threshold (e.g., 18 min wait) and auto-routes traffic to optimal locations (e.g., "Food Court C").
- **Dynamic Team Themes**: The UI actively shifts its palette based on the playing team. Select RCB for deep crimson neon glows; CSK for vibrant sun-yellow accents.
- **AI-Powered CCTV**: Rendered security feeds using generated snapshots of real crowd congestion, overlaid with technical tracking bounding boxes.
- **D3 Data Analytics**: Smooth, area-gradient sparkline charts representing live kinetic crowd flow data.
- **Google Authenticated Fan Portal**: Real-world OAuth 2.0 integration for Fan/Audience users to submit Verified Threat Reports.

## Architecture

```text
src/
├── components/       # Shared React UI (Dashboard grids, headers)
├── features/         # V2 Domain-Driven Modules
│    ├── crowd/       # Telemetry heatmaps
│    ├── routing/     # SmartRouter intelligent alerts
│    ├── stadium/     # Stadium3DView React-Three-Fiber canvas
│    └── analytics/   # CrowdTrends D3 area charts
├── mock-engine/      # Live SimulationEngine & Event Emitters
├── stores/           # Zustand state management (useEngineStore)
└── themes/           # iplThemes dynamic CSS configurations
```

## Real-Time Engine
Our core simulator leverages Zustand to dispatch time-sensitive events (like a sudden boundary or a wicket falling), mimicking real crowd responses such as rush to washrooms or cheering standing waves.

## Running Locally

> **Important Setup Step:** Since this project utilizes several complex graphics and OAuth libraries, you **MUST** install the new dependencies.

```bash
# 1. Install dependencies (Requires updating node_modules for Three.js, Zustand, etc.)
npm install

# 2. Add your Google OAuth Client ID
# Open src/main.tsx and replace "YOUR_GOOGLE_CLIENT_ID" with your actual client ID

# 3. Start the dev server
npm run dev
```

## Future Vision
- Mapbox GL Integration for macro-level Uber-surge style street traffic.
- Full hardware integration with physical turnstile capacitive sensors.
- Predictive Edge-AI models forecasting crowd bottlenecks 45 minutes in advance.

---

*Built for the ultimate fan safety experience.*
