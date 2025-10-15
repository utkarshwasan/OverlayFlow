Livestreaming App - User Guide

This guide provides detailed instructions on how to set up the local development environment and use the features of the Livestreaming App.

Table of Contents

Introduction

Local Development Setup (4-Terminal Guide)

Using the Application: A Step-by-Step Workflow

Managing Overlays

Troubleshooting Common Issues

1. Introduction

What is the Livestreaming App?

The Livestreaming App is a professional tool that allows you to stream RTSP video feeds with custom text and image overlays. It's perfect for live events or any situation where you need to add branding or information to your video stream.

System Requirements

Modern web browser (Chrome or Edge recommended)

Python 3.8+

Node.js 16+

FFmpeg (must be placed in the backend folder as ffmpeg.exe)

MediaMTX (a local RTSP server)

2. Local Development Setup (4-Terminal Guide)

This application requires a specific local environment consisting of four separate terminals running simultaneously. Please follow these steps carefully.

Terminal 1: Start the Media Server (MediaMTX)

This server acts as the central hub or "meeting point" for your video streams.

Open your first terminal.

Navigate to the folder where you extracted MediaMTX.

Run the server:

cd C:\mediamtx
.\mediamtx.exe

✅ Success Check: The terminal will show logs indicating that the server is running and listening on port 8554 (RTSP).

Terminal 2: Publish Your Video Source

This terminal acts as your "camera." It takes a local video file and continuously streams it to the MediaMTX server.

Open a second, separate terminal.

Navigate to the project's backend directory.

Run the following command, making sure to replace "yourVideo.mp4" with the name of your video file:

.\ffmpeg.exe -re -stream_loop -1 -i "yourVideo.mp4" -c copy -f rtsp -rtsp_transport tcp rtsp://localhost:8554/mystream

✅ Success Check: This terminal must remain open and should be actively printing continuous timecode updates (e.g., frame=... time=...). If this process stops, your video source is offline.

Terminal 3: Start the Flask Backend

This terminal runs the application's brain—the API that handles transcoding and database operations.

Open a third, separate terminal.

Navigate to the backend directory.

Set up the environment and run the app:

python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py

✅ Success Check: The terminal will show logs indicating the server is running on http://localhost:5001.

Terminal 4: Start the React Frontend

This terminal runs the user interface that you interact with in the browser.

Open a fourth, separate terminal.

Navigate to the frontend directory.

Install dependencies and start the dev server:

npm install
npm run dev

✅ Success Check: The terminal will give you a local URL, typically http://localhost:3000.

3. Using the Application: A Step-by-Step Workflow

With all four terminals running, your application is ready to use.

Step 1: Start the Stream on the Landing Page

Open your browser and navigate to http://localhost:3000.

You will see the landing page with an input field for the RTSP URL.

Enter your local stream URL: rtsp://localhost:8554/mystream

Click the "Start Stream" button.

#IMPORTANT# - If the stream does not start properly and you see an red overlay afer pressing start then remove the url from input and the stram will start again.

After a few moments, your video stream will appear in the preview player.

Step 2: Access the Overlay Studio

Once the stream is active, a new section will appear on the landing page.

Click the "Continue to App" button.

This will take you to the main application page (/app), where you will see the video player on one side and the Overlay Controls Panel on the other.

4. Managing Overlays

The Controls Panel has three tabs: "Add Overlay," "Saved Overlays," and "Current."

Adding a New Overlay

On the "Add Overlay" tab, fill in the form with details for your text or image overlay (name, content, position, size, etc.).

Click the "Add Overlay" button at the bottom of the form.

Your overlay will immediately appear on the video stream.

Important: This overlay is temporary. To use it again later, you must save it.

Saving and Loading Overlays

To Save: After adding an overlay, click the "Save Current" button. This will save the configuration of the most recently added overlay to your database.

To Load: Go to the "Saved Overlays" tab. Here you will see a list of all your saved configurations. Click the "Load" button on any item to add it to your current stream.

Managing Overlays

Current Tab: This tab shows a list of all overlays currently active on the stream. You can click "Remove" to take one off the screen.

Saved Overlays Tab: In this tab, you can click "Delete" to permanently remove a saved overlay configuration from your database.

5. Troubleshooting Common Issues

"Failed to start FFmpeg. Check RTSP URL or backend logs."

Meaning: The backend (app.py) could not find a video stream at the URL you provided.

Solution: This almost always means Terminal 2 (the Video Source) is not running. Check that terminal to ensure it is open and actively printing frame counters.

The video plays for a second and then freezes.

Meaning: The backend transcoding process (ffmpeg) is unstable.

Solution: Ensure you are using the final, robust version of app.py that re-encodes the stream for stability.

bufferAppendError for 'audio' appears in the browser console.

Meaning: The audio from your source video file is in a format that the browser cannot play correctly after transcoding.

Solution: This has been fixed in the final version of app.py, which forces the audio into a highly compatible AAC format. If you see this error, ensure you are running the latest version of the code.
