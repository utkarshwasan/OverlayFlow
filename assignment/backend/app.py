import os
import subprocess
import time
import json
import logging
import tempfile
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGODB_URI", "mongodb://localhost:27017/livestream_app")
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app)
mongo = PyMongo(app)
db = mongo.db
overlays_collection = db.overlays

ffmpeg_process = None
STATIC_DIR = "static"
os.makedirs(STATIC_DIR, exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stream")

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        return str(obj) if isinstance(obj, ObjectId) else super().default(obj)

app.json_encoder = JSONEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_EXE = os.path.join(BASE_DIR, "ffmpeg.exe")
if not os.path.exists(FFMPEG_EXE):
    FFMPEG_EXE = "ffmpeg"

@app.route('/')
def index():
    return jsonify({"message": "Livestreaming App Backend is running!"})

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    try:
        data = request.get_json()
        required_fields = ['name', 'type', 'content', 'position', 'size']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        if data['type'] not in ['image', 'text']:
            return jsonify({"error": "Type must be either 'image' or 'text'"}), 400
        overlay = {
            "name": data['name'], "type": data['type'], "content": data['content'],
            "position": {"x": data['position']['x'], "y": data['position']['y']},
            "size": {"width": data['size']['width'], "height": data['size']['height']},
            "style": data.get('style', {"color": "#ffffff", "fontSize": "24px", "zIndex": 1})
        }
        result = overlays_collection.insert_one(overlay)
        overlay['_id'] = result.inserted_id
        return jsonify(overlay), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    try:
        overlays = list(overlays_collection.find())
        return jsonify(overlays), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    try:
        overlay = overlays_collection.find_one({"_id": ObjectId(overlay_id)})
        if not overlay:
            return jsonify({"error": "Overlay not found"}), 404
        return jsonify(overlay), 200
    except InvalidId:
        return jsonify({"error": "Invalid overlay ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    try:
        data = request.get_json()
        if '_id' in data:
            del data['_id']
        result = overlays_collection.update_one({"_id": ObjectId(overlay_id)}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        updated_overlay = overlays_collection.find_one({"_id": ObjectId(overlay_id)})
        return jsonify(updated_overlay), 200
    except InvalidId:
        return jsonify({"error": "Invalid overlay ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    try:
        result = overlays_collection.delete_one({"_id": ObjectId(overlay_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        return jsonify({"message": "Overlay deleted successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid overlay ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

PLAYLIST_PATH = os.path.join(STATIC_DIR, "stream.m3u8")

def _clean_hls_residuals():
    for f in os.listdir(STATIC_DIR):
        if f.startswith("stream") and f.endswith((".m3u8", ".ts")):
            os.remove(os.path.join(STATIC_DIR, f))

@app.route('/api/stream/start', methods=['POST'])
def start_stream():
    global ffmpeg_process
    data = request.get_json()
    rtsp_url = data.get("rtspUrl")
    if not rtsp_url:
        return jsonify(error="RTSP URL is required"), 400
    if ffmpeg_process and ffmpeg_process.poll() is None:
        ffmpeg_process.terminate()
        try:
            ffmpeg_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            ffmpeg_process.kill()
            ffmpeg_process.wait()
        logger.info("Previous FFmpeg terminated")
    _clean_hls_residuals()
    FFMPEG = os.path.join(os.path.dirname(__file__), "ffmpeg.exe")
    cmd = [
        FFMPEG, "-fflags", "nobuffer", "-flags", "low_delay", "-i", rtsp_url,
        "-c:v", "libx264", "-preset", "ultrafast", "-tune", "zerolatency",
        "-x264-params", "keyint=120:min-keyint=120:no-scenecut=1",
        "-b:v", "2M", "-maxrate", "2M", "-bufsize", "4M",
        "-c:a", "aac", "-mpegts_flags", "latm", "-ar", "48000", "-ac", "2", "-b:a", "128k",
        "-f", "hls", "-hls_time", "2", "-hls_playlist_type", "event",
        "-hls_flags", "delete_segments+append_list",
        "-hls_segment_filename", os.path.join(STATIC_DIR, "stream%03d.ts"),
        PLAYLIST_PATH,
    ]
    log_file_path = os.path.join(tempfile.gettempdir(), f"ffmpeg_{datetime.datetime.now():%Y%m%d_%H%M%S}.log")
    logger.info(f"Starting FFmpeg... Log file at: {log_file_path}")
    with open(log_file_path, "w", encoding="utf-8") as log_file:
        ffmpeg_process = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=log_file)
    time.sleep(1)
    if ffmpeg_process.poll() is not None:
        logger.error("FFmpeg process failed immediately on startup.")
        return jsonify(error="FFmpeg process failed on startup. Check logs."), 500
    seg_path = os.path.join(STATIC_DIR, "stream000.ts")
    start = time.time()
    while time.time() - start < 15:
        playlist_exists = os.path.exists(PLAYLIST_PATH) and os.path.getsize(PLAYLIST_PATH) > 0
        segment_exists = os.path.exists(seg_path) and os.path.getsize(seg_path) > 50_000
        if playlist_exists and segment_exists:
            logger.info("First HLS segment and playlist ready – returning success")
            return jsonify(hlsUrl="http://localhost:5001/static/stream.m3u8", message="Stream started successfully"), 200
        time.sleep(0.5)
    if ffmpeg_process.poll() is None:
        ffmpeg_process.terminate()
    ffmpeg_process.wait()
    logger.error(f"FFmpeg timed out. Check log file: {log_file_path}")
    return jsonify(error="Failed to start FFmpeg (timeout). Check RTSP URL or backend logs.", details=f"Log file at {log_file_path}"), 500

@app.route('/api/stream/stop', methods=['POST'])
def stop_stream():
    global ffmpeg_process
    try:
        if ffmpeg_process and ffmpeg_process.poll() is None:
            ffmpeg_process.terminate()
            ffmpeg_process.wait()
            ffmpeg_process = None
            _clean_hls_residuals()
        return jsonify({"message": "Stream stopped successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stream/status', methods=['GET'])
def stream_status():
    is_active = ffmpeg_process is not None and ffmpeg_process.poll() is None
    return jsonify({"isActive": is_active, "hlsUrl": "http://localhost:5001/static/stream.m3u8" if is_active else None}), 200

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_DIR, filename)

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(debug=True, port=port, host='0.0.0.0', use_reloader=False)