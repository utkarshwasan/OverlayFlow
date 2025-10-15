
# OverlayFlow: RTSP Overlay Streamer 🎥

A full-stack web application for transcoding live RTSP video streams into browser-compatible HLS format, enabling real-time playback directly in any modern browser. Built with a **React + Vite** frontend and a **Python Flask** backend, OverlayFlow introduces an intuitive **Overlay Studio** for creating, positioning, and managing dynamic text and image overlays — all fully persisted via MongoDB.  

This project was developed as part of a full-stack developer assessment, showcasing robust real-time video processing, a complete CRUD API, and a modular architecture for local or remote streaming environments.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Setup](#installation-and-setup)
- [How to Use](#how-to-use)
- [Configuration](#configuration)
- [Application Workflow](#application-workflow)
- [License](#license)

---

## Features

- **🎬 RTSP → HLS Transcoding**: Converts live RTSP feeds to HLS format via FFmpeg for universal web playback.
- **🖥 Real-Time Video Playback**: Smooth and low-latency streaming using HLS.js integrated with React.
- **🧩 Dynamic Overlay Studio**: Add, move, resize, and customize text or image overlays directly on a live video canvas.
- **⚙️ Full CRUD API**: Overlay configurations (name, type, position, size, and styling) are fully manageable via a RESTful Flask API.
- **💾 Persistent Data Layer**: All overlays are stored and retrieved from MongoDB, ensuring saved layout states.
- **🧱 Local Streaming Environment**: Complete setup guide for testing and development using MediaMTX and FFmpeg.

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React 18, Vite, HLS.js, Axios |
| Backend | Python 3.8+, Flask, PyMongo |
| Database | MongoDB (Local or Atlas) |
| Video Transcoding | FFmpeg |
| RTSP Server | MediaMTX |

---

## Project Structure

```bash
overlayflow/
├── backend/                # Flask backend
│   ├── app.py              # Main application entrypoint
│   ├── requirements.txt    # Python dependencies
│   ├── ffmpeg.exe          # FFmpeg binary (local)
│   ├── .env                # Environment variables
│   └── ...
├── frontend/               # React + Vite frontend
│   ├── src/                # Components and pages
│   ├── package.json        # Frontend dependencies
│   └── ...
├── your_video.mp4          # Sample input video
└── README.md
````

---

## Getting Started

### Prerequisites

* **Node.js** v16 or later
* **Python** v3.8 or later
* **MediaMTX** (Download latest from [GitHub Releases](https://github.com/bluenviron/mediamtx/releases))
* **FFmpeg** (Full build from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/))

> Place the `ffmpeg.exe` file inside the `backend/` directory.

---

### Installation and Setup

Get OverlayFlow running locally in just a few steps.

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/overlayflow.git
   cd overlayflow
   ```

2. **Start the MediaMTX RTSP Server**

   ```bash
   cd C:\mediamtx
   .\mediamtx.exe
   ```

3. **Publish your RTSP Stream**

   ```bash
   cd path\to\overlayflow
   .\backend\ffmpeg.exe -re -stream_loop -1 -i "your_video.mp4" -c copy -f rtsp -rtsp_transport tcp rtsp://localhost:8554/mystream
   ```

4. **Run the Flask Backend**

   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

   Backend will be available at `http://localhost:5001`.

5. **Run the React Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`.

---

## How to Use

1. Ensure all four terminals (MediaMTX, FFmpeg stream, Flask backend, and React frontend) are running.
2. Visit `http://localhost:3000` in your browser.
3. Paste your stream URL:

   ```
   rtsp://localhost:8554/mystream
   ```
4. Click **Start Stream** to initialize playback.
5. Once the video loads, click **Continue to App** to enter the Overlay Studio.
6. Add, position, and style overlays using the Controls Panel.
7. Save overlay configurations to persist them in the database.

---

## Configuration

Create a `.env` file in the backend directory with the following structure:

```bash
# backend/.env
MONGODB_URI=your_mongodb_connection_string_here
PORT=5001
```

> You can copy the `.env.template` provided in the project for a starting point.

---

## Application Workflow

1. **Start the RTSP Server** (MediaMTX).
2. **Stream a video source** via FFmpeg.
3. **Launch Flask backend** to handle transcoding and overlay APIs.
4. **Run React frontend** to view and interact with the live HLS stream.
5. **Use Overlay Studio** to dynamically modify overlays.
6. **Save configurations** for persistence in MongoDB.

The Flask backend uses FFmpeg to transcode the live RTSP stream into HLS segments, which the frontend then consumes using HLS.js for browser playback. Overlay positions, content, and styles are stored and retrieved through a RESTful API layer.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

