from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.session_routes import router as session_router

app = FastAPI(
    title="IntelliInterview API",
    version="1.0.0"
)

# Enable CORS (for frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include only session router
app.include_router(session_router)


@app.get("/")
def root():
    return {"message": "Backend is running successfully 🚀"}