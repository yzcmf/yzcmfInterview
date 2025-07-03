from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, users, items
from backend.database import engine
from backend.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fullstack Python API",
    description="A modern fullstack application built with FastAPI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(items.router, prefix="/api/items", tags=["Items"])

@app.get("/")
async def root():
    return {"message": "Welcome to Fullstack Python API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 