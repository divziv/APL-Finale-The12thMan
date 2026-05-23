"""
CrowdSphere AI - FastAPI Service
Provides REST API endpoints for crowd detection
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import cv2
import numpy as np
import tempfile
import os
from datetime import datetime

from crowd_detection import CrowdDetector

app = FastAPI(
    title="CrowdSphere AI",
    description="Smart Stadium Crowd Monitoring - AI Detection Service",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detector globally
detector = None


def get_detector():
    """Get or initialize the crowd detector."""
    global detector
    if detector is None:
        detector = CrowdDetector(model_name="yolov8n.pt")
    return detector


class DetectionResult(BaseModel):
    people_count: int
    confidence: float
    timestamp: str
    status: str


class VideoAnalysisResult(BaseModel):
    total_frames: int
    processed_frames: int
    average_people_count: float
    max_people_detected: int
    min_people_detected: int
    duration_seconds: float
    status: str


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "CrowdSphere AI Detection Service",
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "/detect/frame": "POST - Upload image for crowd detection",
            "/detect/video": "POST - Upload video for analysis",
            "/health": "GET - Service health status"
        }
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    try:
        det = get_detector()
        model_loaded = det is not None
    except Exception:
        model_loaded = False

    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/detect/frame", response_model=DetectionResult)
async def detect_from_frame(file: UploadFile = File(...)):
    """
    Detect people in an uploaded image/frame.
    Accepts common image formats (jpg, png, bmp).
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/bmp", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {allowed_types}"
        )

    try:
        # Read image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        # Run detection
        det = get_detector()
        result = det.detect_people(frame, conf_threshold=0.5)

        # Calculate average confidence
        detections = result["detections"]
        avg_confidence = sum(d["confidence"] for d in detections) / max(1, len(detections))

        # Determine status based on crowd density
        people_count = result["people_count"]
        if people_count < 15:
            status = "safe"
        elif people_count < 30:
            status = "moderate"
        elif people_count < 50:
            status = "congested"
        else:
            status = "critical"

        return DetectionResult(
            people_count=people_count,
            confidence=round(avg_confidence, 3),
            timestamp=result["timestamp"],
            status=status
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect/video", response_model=VideoAnalysisResult)
async def analyze_video(
    file: UploadFile = File(...),
    sample_interval: int = 10
):
    """
    Analyze a video file for crowd detection.
    Processes every Nth frame based on sample_interval.
    """
    # Validate file type
    allowed_types = ["video/mp4", "video/avi", "video/quicktime", "video/x-msvideo"]
    if file.content_type and file.content_type not in allowed_types:
        # Allow if content_type is not provided but file has video extension
        ext = file.filename.lower().split(".")[-1] if file.filename else ""
        if ext not in ["mp4", "avi", "mov", "mkv", "webm"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid video format. Allowed extensions: mp4, avi, mov, mkv, webm"
            )

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # Process video
        det = get_detector()
        results = det.process_video(
            video_path=tmp_path,
            output_path=None,
            display=False,
            sample_interval=sample_interval
        )

        # Calculate video duration
        duration = results["total_frames"] / max(1, results["fps"])

        # Clean up temp file
        os.unlink(tmp_path)

        # Determine overall status
        avg_count = results["average_people_count"]
        if avg_count < 20:
            status = "safe"
        elif avg_count < 40:
            status = "moderate"
        elif avg_count < 60:
            status = "congested"
        else:
            status = "critical"

        return VideoAnalysisResult(
            total_frames=results["total_frames"],
            processed_frames=results["processed_frames"],
            average_people_count=results["average_people_count"],
            max_people_detected=results["max_people_detected"],
            min_people_detected=results["min_people_detected"],
            duration_seconds=round(duration, 2),
            status=status
        )

    except HTTPException:
        raise
    except Exception as e:
        # Clean up temp file if it exists
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/simulate/{zone_id}")
async def simulate_detection(zone_id: str):
    """
    Simulate AI detection for a zone.
    Used for demo/test purposes when no actual video is available.
    """
    import random

    # Simulate realistic crowd count variations
    base_count = {
        "a1": 200, "a2": 400, "a3": 450,
        "b1": 180, "b2": 350, "b3": 220,
        "c1": 380, "c2": 500, "c3": 520,
        "concourse-n": 150, "concourse-s": 450
    }.get(zone_id, 300)

    variation = random.randint(-30, 30)
    people_count = max(50, base_count + variation)

    if people_count < 250:
        status = "safe"
    elif people_count < 450:
        status = "moderate"
    elif people_count < 520:
        status = "congested"
    else:
        status = "critical"

    return {
        "zone_id": zone_id,
        "people_count": people_count,
        "confidence": round(random.uniform(0.85, 0.98), 3),
        "status": status,
        "timestamp": datetime.now().isoformat(),
        "ai_active": True
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
