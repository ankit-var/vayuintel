# Vayu Intel Backend

FastAPI backend for the Vayu Intel Air Quality Intelligence Platform.

## Features
- Health check endpoint
- OpenAQ API integration for real-time air quality observations
- Open-Meteo API integration for live weather data
- Mocked endpoints for alerts and forecasts for UI demonstration
- CORS enabled for frontend integration

## Setup Instructions

1. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your OpenAQ API key to `.env` if you have one (optional, but helps avoid rate limits).

4. **Run the server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **API Documentation**
   Once running, visit `http://localhost:8000/docs` to see the interactive Swagger UI.

## Deployment on Render
To deploy this backend as a Web Service on Render:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Root Directory**: `vayu-backend`
- **Environment Variables**: Add `OPENAQ_API_KEY` (optional) or any required runtime variables.

## Running Full Stack
To run the full stack:
1. Start this backend on port 8000.
2. In a separate terminal, start the frontend (`cd ../vayu-frontend && npm run dev`) which typically runs on port 5173.
