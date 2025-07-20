from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FeedHive API", version="1.0.0")

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Debug middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

# Initialize MySQL database FIRST
try:
    logger.info("Initializing MySQL database...")
    from .database import engine
    from . import models
    
    # Test database connection
    logger.info("Testing MySQL connection...")
    with engine.connect() as connection:
        logger.info("MySQL connection successful!")
    
    # Create database tables
    logger.info("Creating MySQL database tables...")
    models.Base.metadata.create_all(bind=engine)
    logger.info("MySQL database tables created successfully")
    
    # Import routers AFTER database is ready
    logger.info("Importing routers...")
    from .api import user, feedback
    
    # Include routers
    logger.info("Including user router...")
    app.include_router(user.router, prefix="/api", tags=["users"])
    logger.info("User router included successfully")
    
    logger.info("Including feedback router...")
    app.include_router(feedback.router, prefix="/api", tags=["feedback"])
    logger.info("Feedback router included successfully")
    
    logger.info("All routers included successfully")
    
except ImportError as e:
    logger.error(f"Import error: {e}")
    logger.error("Make sure all required files exist")
    
except Exception as e:
    logger.error(f"Error setting up MySQL database or routers: {e}")
    logger.error("Make sure MySQL is running and accessible")

# Test endpoints
@app.get("/")
def read_root():
    return {"message": "FeedHive API is running with MySQL"}

@app.get("/test")
def test_endpoint():
    return {"message": "API is working", "status": "ok"}

@app.get("/cors-test")
def cors_test():
    return {"message": "CORS is working"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "cors": "enabled", "database": "mysql"}

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)