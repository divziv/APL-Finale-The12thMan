"""
CrowdSphere AI - Crowd Detection Module
Uses YOLOv8 pretrained model for person detection
"""

import cv2
import numpy as np
from ultralytics import YOLO
from datetime import datetime
from typing import Optional, Dict, Any
import json


class CrowdDetector:
    def __init__(self, model_name: str = "yolov8n.pt"):
        """
        Initialize the crowd detector with YOLOv8 model.

        Args:
            model_name: YOLOv8 model variant (n, s, m, l, x)
                       n = nano (fastest, least accurate)
                       s = small
                       m = medium
                       l = large
                       x = xlarge (slowest, most accurate)
        """
        print(f"Loading YOLO model: {model_name}")
        self.model = YOLO(model_name)
        self.person_class_id = 0  # COCO dataset person class ID

    def detect_people(self, frame: np.ndarray, conf_threshold: float = 0.5) -> Dict[str, Any]:
        """
        Detect people in a single frame.

        Args:
            frame: Input image/frame (numpy array)
            conf_threshold: Confidence threshold for detections

        Returns:
            Dictionary containing detection results
        """
        # Run inference
        results = self.model(frame, conf=conf_threshold, classes=[self.person_class_id], verbose=False)

        # Extract detections
        detections = []
        people_count = 0

        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())

                    detections.append({
                        "bbox": [int(x1), int(y1), int(x2), int(y2)],
                        "confidence": round(confidence, 3)
                    })
                    people_count += 1

        return {
            "people_count": people_count,
            "detections": detections,
            "timestamp": datetime.now().isoformat(),
            "frame_shape": frame.shape[:2]  # (height, width)
        }

    def process_video(
        self,
        video_path: str,
        output_path: Optional[str] = None,
        display: bool = False,
        sample_interval: int = 5
    ) -> Dict[str, Any]:
        """
        Process a video file and count people in each frame.

        Args:
            video_path: Path to input video file
            output_path: Optional path to save annotated video
            display: Whether to display frames in real-time
            sample_interval: Process every Nth frame (for performance)

        Returns:
            Dictionary with overall statistics
        """
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            raise ValueError(f"Could not open video: {video_path}")

        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        print(f"Video: {width}x{height} @ {fps}fps, {total_frames} frames")

        # Setup output video writer if needed
        if output_path:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        frame_count = 0
        total_people_detected = 0
        max_people = 0
        min_people = float('inf')
        frame_results = []

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            # Only process every Nth frame for performance
            if frame_count % sample_interval != 0:
                continue

            # Detect people
            result = self.detect_people(frame)
            people_count = result["people_count"]

            # Update statistics
            total_people_detected += people_count
            max_people = max(max_people, people_count)
            min_people = min(min_people, people_count)

            # Store frame result
            frame_results.append({
                "frame": frame_count,
                "people_count": people_count,
                "timestamp": result["timestamp"]
            })

            # Draw annotations
            annotated_frame = frame.copy()
            for det in result["detections"]:
                x1, y1, x2, y2 = det["bbox"]
                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(
                    annotated_frame,
                    f"P{det['confidence']:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    2
                )

            # Add overlay with count
            overlay = annotated_frame.copy()
            cv2.rectangle(overlay, (10, 10), (200, 60), (0, 0, 0), -1)

            # Display status
            status_color = (0, 255, 0) if people_count < 30 else (0, 255, 255) if people_count < 50 else (0, 0, 255)
            cv2.putText(
                overlay,
                f"People: {people_count}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                status_color,
                2
            )

            cv2.addWeighted(overlay, 0.7, annotated_frame, 0.3, 0, annotated_frame)

            # Write output video
            if output_path:
                out.write(annotated_frame)

            # Display frame
            if display:
                cv2.imshow('CrowdSphere AI - Detection', annotated_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

            # Progress update
            if frame_count % 100 == 0:
                print(f"Processed {frame_count}/{total_frames} frames...")

        # Cleanup
        cap.release()
        if output_path:
            out.release()
        if display:
            cv2.destroyAllWindows()

        # Calculate statistics
        avg_people = total_people_detected / max(1, len(frame_results))
        processed_frames = len(frame_results)

        return {
            "total_frames": total_frames,
            "processed_frames": processed_frames,
            "average_people_count": round(avg_people, 2),
            "max_people_detected": max_people,
            "min_people_detected": min_people if min_people != float('inf') else 0,
            "fps": fps,
            "resolution": f"{width}x{height}",
            "frame_results": frame_results[-100:]  # Last 100 results
        }

    def process_webcam(self, camera_id: int = 0, display: bool = True) -> None:
        """
        Process live webcam feed for crowd detection.

        Args:
            camera_id: Camera device ID (default 0)
            display: Whether to display frames
        """
        cap = cv2.VideoCapture(camera_id)

        if not cap.isOpened():
            raise ValueError(f"Could not open camera {camera_id}")

        print(f"Starting webcam detection on camera {camera_id}")
        print("Press 'q' to quit")

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Detect people
            result = self.detect_people(frame)
            people_count = result["people_count"]

            # Draw annotations
            for det in result["detections"]:
                x1, y1, x2, y2 = det["bbox"]
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            # Add overlay
            cv2.putText(
                frame,
                f"Crowd Count: {people_count}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

            # Status indicator
            status = "LOW" if people_count < 10 else "MEDIUM" if people_count < 30 else "HIGH"
            status_color = (0, 255, 0) if status == "LOW" else (0, 255, 255) if status == "MEDIUM" else (0, 0, 255)
            cv2.putText(
                frame,
                f"Status: {status}",
                (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                status_color,
                2
            )

            if display:
                cv2.imshow('CrowdSphere AI - Live Detection', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        cap.release()
        cv2.destroyAllWindows()


def main():
    """Main entry point for command-line usage."""
    import argparse

    parser = argparse.ArgumentParser(description="CrowdSphere AI - Crowd Detection System")
    parser.add_argument(
        "--source",
        type=str,
        default="0",
        help="Video source: file path or camera ID (default: 0 for webcam)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output video path (optional)"
    )
    parser.add_argument(
        "--model",
        type=str,
        default="yolov8n.pt",
        help="YOLO model variant (yolov8n, yolov8s, yolov8m, yolov8l, yolov8x)"
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=5,
        help="Frame sample interval for video processing"
    )
    parser.add_argument(
        "--no-display",
        action="store_true",
        help="Disable frame display"
    )
    parser.add_argument(
        "--json-output",
        type=str,
        default=None,
        help="Save results to JSON file"
    )

    args = parser.parse_args()

    # Initialize detector
    detector = CrowdDetector(model_name=args.model)

    # Process source
    try:
        if args.source.isdigit():
            # Webcam mode
            detector.process_webcam(
                camera_id=int(args.source),
                display=not args.no_display
            )
        else:
            # Video file mode
            results = detector.process_video(
                video_path=args.source,
                output_path=args.output,
                display=not args.no_display,
                sample_interval=args.interval
            )

            print("\n=== Detection Results ===")
            print(f"Total frames: {results['total_frames']}")
            print(f"Processed frames: {results['processed_frames']}")
            print(f"Average people count: {results['average_people_count']}")
            print(f"Max people detected: {results['max_people_detected']}")
            print(f"Min people detected: {results['min_people_detected']}")

            if args.json_output:
                with open(args.json_output, 'w') as f:
                    json.dump(results, f, indent=2)
                print(f"\nResults saved to: {args.json_output}")

    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
