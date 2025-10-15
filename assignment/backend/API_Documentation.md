# API Documentation

## Base URL
`http://localhost:5001`

## Authentication
No authentication is required for this MVP version.

## Endpoints

### Overlay Management

#### Create Overlay
```http
POST /api/overlays
```

**Request Body:**
```json
{
  "name": "My Brand Logo",
  "type": "image",
  "content": "https://example.com/logo.png",
  "position": {
    "x": 50,
    "y": 10
  },
  "size": {
    "width": 15,
    "height": 10
  },
  "style": {
    "color": "#ffffff",
    "fontSize": "24px",
    "zIndex": 1
  }
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "My Brand Logo",
  "type": "image",
  "content": "https://example.com/logo.png",
  "position": {
    "x": 50,
    "y": 10
  },
  "size": {
    "width": 15,
    "height": 10
  },
  "style": {
    "color": "#ffffff",
    "fontSize": "24px",
    "zIndex": 1
  }
}
```

#### Get All Overlays
```http
GET /api/overlays
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "My Brand Logo",
    "type": "image",
    "content": "https://example.com/logo.png",
    "position": {
      "x": 50,
      "y": 10
    },
    "size": {
      "width": 15,
      "height": 10
    },
    "style": {
      "color": "#ffffff",
      "fontSize": "24px",
      "zIndex": 1
    }
  }
]
```

#### Get Single Overlay
```http
GET /api/overlays/{overlay_id}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "My Brand Logo",
  "type": "image",
  "content": "https://example.com/logo.png",
  "position": {
    "x": 50,
    "y": 10
  },
  "size": {
    "width": 15,
    "height": 10
  },
  "style": {
    "color": "#ffffff",
    "fontSize": "24px",
    "zIndex": 1
  }
}
```

#### Update Overlay
```http
PUT /api/overlays/{overlay_id}
```

**Request Body:**
```json
{
  "name": "Updated Logo",
  "position": {
    "x": 60,
    "y": 20
  }
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Logo",
  "type": "image",
  "content": "https://example.com/logo.png",
  "position": {
    "x": 60,
    "y": 20
  },
  "size": {
    "width": 15,
    "height": 10
  },
  "style": {
    "color": "#ffffff",
    "fontSize": "24px",
    "zIndex": 1
  }
}
```

#### Delete Overlay
```http
DELETE /api/overlays/{overlay_id}
```

**Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

### Video Streaming

#### Start Stream
```http
POST /api/stream/start
```

**Request Body:**
```json
{
  "rtspUrl": "rtsp://example.com/stream"
}
```

**Response:**
```json
{
  "hlsUrl": "http://localhost:5001/static/stream.m3u8",
  "message": "Stream started successfully"
}
```

#### Stop Stream
```http
POST /api/stream/stop
```

**Response:**
```json
{
  "message": "Stream stopped successfully"
}
```

#### Stream Status
```http
GET /api/stream/status
```

**Response:**
```json
{
  "isActive": true,
  "hlsUrl": "http://localhost:5001/static/stream.m3u8"
}
```

## Data Models

### Overlay Object
```json
{
  "_id": "string", // MongoDB ObjectId (auto-generated)
  "name": "string", // Display name for the overlay
  "type": "string", // "image" or "text"
  "content": "string", // URL for images or text content
  "position": {
    "x": "number", // Percentage from left (0-100)
    "y": "number"  // Percentage from top (0-100)
  },
  "size": {
    "width": "number", // Percentage of video width (0-100)
    "height": "number" // Percentage of video height (0-100)
  },
  "style": {
    "color": "string", // CSS color value (for text)
    "fontSize": "string", // CSS font size (for text)
    "zIndex": "number" // Stacking order
  }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (invalid input)
- `404` - Not found
- `500` - Internal server error