from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

# Handle Railway DATABASE_URL format (postgres:// vs postgresql://)
database_url = settings.DATABASE_URL

# Railway sometimes provides postgres:// but SQLAlchemy 2.0 requires postgresql://
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

print(f"Database URL: {database_url[:50]}...")  # Log for debugging

# Connection arguments based on database type
connect_args = {}
if "sqlite" in database_url:
    connect_args = {"check_same_thread": False}
else:
    # PostgreSQL connection pool settings for Railway
    connect_args = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "connect_timeout": 60,
    }

try:
    engine = create_engine(
        database_url, 
        **connect_args,
        echo=False  # Set to True for SQL query logging
    )
    
    # Test the connection
    with engine.connect() as conn:
        print("Database connection successful!")
        
except Exception as e:
    print(f"Database connection failed: {e}")
    # Fallback to SQLite for local development
    print("Falling back to SQLite...")
    engine = create_engine(
        "sqlite:///./eventhive.db", 
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()