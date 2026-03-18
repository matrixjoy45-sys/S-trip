from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import analysis
from api.routes import trips

app = FastAPI(title="Trip Us API")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(trips.router, prefix="/api/trips", tags=["trips"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Global Smart Travel API"}
