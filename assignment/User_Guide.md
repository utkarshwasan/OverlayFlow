
# 📺 Livestreaming App - User Guide

This guide provides detailed instructions on how to set up the local development environment and use the features of the Livestreaming App.

---

## 📘 Table of Contents
1. [Introduction](#1-introduction)
2. [Local Development Setup (4-Terminal Guide)](#2-local-development-setup-4-terminal-guide)
3. [Using the Application: A Step-by-Step Workflow](#3-using-the-application-a-step-by-step-workflow)
4. [Managing Overlays](#4-managing-overlays)
5. [Troubleshooting Common Issues](#5-troubleshooting-common-issues)

---

## 1. Introduction

### 🎯 What is the Livestreaming App?

The **Livestreaming App** is a professional tool that allows you to stream **RTSP video feeds** with **custom text and image overlays**. It’s ideal for live events, branding, or any situation where you need to enhance your stream with dynamic visual information.

### 💻 System Requirements
- Modern web browser (Chrome or Edge recommended)
- Python 3.8+
- Node.js 16+
- FFmpeg (must be placed in the backend folder as `ffmpeg.exe`)
- MediaMTX (a local RTSP server)

---

## 2. Local Development Setup (4-Terminal Guide)

This application requires a local setup with **four active processes**. Follow these steps carefully.

### 🛰️ Media Server (MediaMTX)
```bash
cd C:\mediamtx
.\mediamtx.exe
````

✅ **Success Check:** Logs indicate the server is listening on **port 8554 (RTSP)**.

---

### 🎥 Publish Your Video Source

```bash
cd path/to/project/backend
.\ffmpeg.exe -re -stream_loop -1 -i "yourVideo.mp4" -c copy -f rtsp -rtsp_transport tcp rtsp://localhost:8554/mystream
```

✅ **Success Check:** Continuous frame updates (e.g., `frame=... time=...`) mean your video source is live.

---

### ⚙️ Start the Flask Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

✅ **Success Check:** The backend is running at **[http://localhost:5001](http://localhost:5001)**.

---

### 🖥️ Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ **Success Check:** Frontend runs at **[http://localhost:3000](http://localhost:3000)**.

---

## 3. Using the Application: A Step-by-Step Workflow

With all four terminals running, your environment is ready.

### Step 1: Start the Stream on the Landing Page

1. Open your browser and go to **[http://localhost:3000](http://localhost:3000)**
2. Enter your local stream URL:

   ```
   rtsp://localhost:8554/mystream
   ```
3. Click **Start Stream**.

> ⚠️ **Important:**
> If the stream shows a red overlay or fails to load, remove the URL from the input field and click **Start Stream** again. This resets the stream.

✅ After a few seconds, your video will appear in the preview player.

---

### Step 2: Access the Overlay Studio

1. Once the stream is live, click **Continue to App**.
2. You’ll be redirected to `/app`, which displays:

   * A live video player
   * An **Overlay Controls Panel** on the right

---

## 4. Managing Overlays

The **Controls Panel** contains three tabs:

* 🟢 **Add Overlay**
* 💾 **Saved Overlays**
* 🧱 **Current**

### ➕ Adding a New Overlay

1. Open the **Add Overlay** tab.
2. Fill in the form fields (name, content, type, size, and position).
3. Click **Add Overlay**.

Your overlay appears instantly on the video.

> 🔹 Note: Overlays added this way are temporary unless saved.

---

### 💾 Saving and Loading Overlays

**To Save:**

* After adding an overlay, click **Save Current** to store it in the database.

**To Load:**

* Open the **Saved Overlays** tab.
* Choose any saved configuration and click **Load** to bring it back onto the stream.

---

### 🧱 Managing Overlays

**Current Tab:**

* Displays all active overlays.
* Click **Remove** to delete one from the stream.

**Saved Overlays Tab:**

* Lists all saved overlays.
* Click **Delete** to permanently remove a configuration from the database.

---

## 5. Troubleshooting Common Issues

### ❌ “Failed to start FFmpeg. Check RTSP URL or backend logs.”

**Meaning:** Backend couldn’t find a valid video stream.
**Fix:** Ensure the video source (Terminal 2) is running and actively printing frame counters.

---

### 🧊 Video plays briefly then freezes

**Meaning:** Backend transcoding is unstable.
**Fix:** Use the latest `app.py` version that includes re-encoding logic for FFmpeg stability.

---

### 🔊 `bufferAppendError for 'audio'` in the browser console

**Meaning:** Audio codec is incompatible with the browser.
**Fix:** Update to the latest backend version that forces **AAC audio encoding** for universal playback.


✅ **All Set!**
You now have a fully operational livestreaming app with a real-time overlay editor and stable HLS transcoding pipeline.
