from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import redis
from app.core.database import Base, engine
from app.core.config import settings
from app.api import auth, events, bookings

# Redis connection for Railway
def get_redis_client():
    try:
        if settings.REDIS_URL:
            redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            # Test connection
            redis_client.ping()
            print("Redis connection successful!")
            return redis_client
    except Exception as e:
        print(f"Redis connection failed: {e}")
        print("Continuing without Redis cache...")
        return None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        
        # Test Redis connection
        redis_client = get_redis_client()
        app.state.redis = redis_client
        
        # Create seed data
        from seed import create_seed_data
        create_seed_data()
        
    except Exception as e:
        print(f"Startup error: {e}")
        print("Continuing without some services...")
    
    yield
    
    # Cleanup
    if hasattr(app.state, 'redis') and app.state.redis:
        app.state.redis.close()

app = FastAPI(
    title="EventHive API",
    description="Complete Event Management Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for Railway deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.RAILWAY_ENVIRONMENT == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])

@app.get("/")
async def root():
    return {
        "message": "EventHive API is running!", 
        "docs": "/docs",
        "environment": settings.RAILWAY_ENVIRONMENT,
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    health_status = {
        "status": "healthy",
        "database": "unknown",
        "redis": "unknown"
    }
    
    # Check database
    try:
        from app.core.database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        health_status["database"] = "connected"
    except Exception as e:
        health_status["database"] = f"error: {str(e)}"
    
    # Check Redis
    if hasattr(app.state, 'redis') and app.state.redis:
        try:
            app.state.redis.ping()
            health_status["redis"] = "connected"
        except Exception as e:
            health_status["redis"] = f"error: {str(e)}"
    else:
        health_status["redis"] = "not_configured"
    
    return health_status

if __name__ == "__main__":
    import uvicorn
    # Use Railway's PORT environment variable
    port = settings.PORT
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
    