from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FeedHive API", 
    version="1.0.0",
    description="Feedback collection and analysis system"
)

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Import and include routers
from .api import user, feedback

app.include_router(user.router, prefix="/api", tags=["users"])
app.include_router(feedback.router, prefix="/api", tags=["feedback"])

@app.get("/")
async def read_root():
    return {"message": "FeedHive API is running!", "version": "1.0.0"}

@app.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint working!"}

@app.get("/cors-test")
async def cors_test():
    return {"message": "CORS is working!", "status": "success"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "FeedHive API is healthy!"}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response