Livestreaming App with Custom Overlays
A full-stack application that transcodes RTSP streams to HLS for web playback, featuring draggable text and image overlays. This project uses a React frontend, a Flask backend, and FFmpeg for video processing.
🛠️ Tech Stack
Backend: Python 3.8+, Flask, PyMongo
Frontend: React 18, Vite, HLS.js, Axios
Database: MongoDB (local or Atlas)
Video Transcoding: FFmpeg
Local Streaming Server: MediaMTX
📁 Folder Layout & Setup
For this project to run, key executables must be placed in specific folders:
.
├── backend/
│ ├── app.py # The complete Flask API
│ ├── ffmpeg.exe # CRITICAL: Must be placed here
│ ├── requirements.txt # Python dependencies
│ └── .env # For environment variables
│
├── frontend/ # Standard React project
│ ├── node_modules/ # Installed via `npm install`
│ └── ...
│
├── mediamtx/ # Extract the MediaMTX release here
│ └── mediamtx.exe # The local RTSP/HLS server
│
└── README.md # This file

🚀 Quick Start Guide (4-Terminal Setup)
This application requires four separate terminals running simultaneously. Follow these steps in order.
Terminal 1: Start the Media Server
This terminal runs the central hub for your video streams.

# Navigate to your MediaMTX folder

cd C:\mediamtx

# Run the server

.\mediamtx.exe

Terminal 2: Publish Your Video Source
This terminal acts as the "camera," continuously feeding a local video file to the media server.

# Navigate to the backend folder

cd backend

# Start streaming your video file (replace "yourVideo.mp4")

.\ffmpeg.exe -re -stream_loop -1 -i "yourVideo.mp4" -c copy -f rtsp -rtsp_transport tcp rtsp://localhost:8554/mystream

Terminal 3: Start the Flask Backend
This terminal runs the application's core logic and API.

# Navigate to the backend folder

cd backend

# Set up and activate the virtual environment

python -m venv venv
.\venv\Scripts\activate

# Install dependencies and run the app

pip install -r requirements.txt
python app.py

Terminal 4: Start the React Frontend
This terminal runs the user interface.

# Navigate to the frontend folder

cd frontend

# Install dependencies and start the dev server

npm install
npm run dev

Once all four terminals are running, open your browser to http://localhost:3000. Paste your local RTSP URL (rtsp://localhost:8554/mystream) and click "Start Stream."
🌐 Sample RTSP URLs
Local Stream (Recommended): rtsp://localhost:8554/mystream
Public Test Stream: rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov
⚙️ Environment Variables
Create a .env file inside the backend/ directory with the following content:
MONGODB_URI=mongodb://localhost:27017/livestream_app
PORT=5001

🩺 Troubleshooting
500 Error on /api/stream/start:
Confirm that ffmpeg.exe is located directly inside the backend/ folder.
Check the latest log file in your temporary directory (%TEMP%\ffmpeg\_\*.log) for detailed errors. The path is printed in the Flask console.
Video Player Doesn't Start:
Look at Terminal 2. It must be showing continuous frame=... counters. If it has stopped, the video source is offline.
Ensure you are using a modern browser like Chrome or Edge.
Overlays Don't Appear:
After adding an overlay, you must first save it. Then, go to the "Saved Overlays" tab and click "Load" to apply it to the stream.
📚 Documentation
API Specification: backend/API_Documentation.md
User Guide: User_Guide.md
