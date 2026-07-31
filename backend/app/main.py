from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .api import analyze, history, analytics, policies, recipients

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SendGuard API")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(policies.router, prefix="/api/policies", tags=["Policies"])
app.include_router(recipients.router, prefix="/api/recipients", tags=["Recipients"])

@app.get("/")
def root():
    return {"message": "Welcome to SendGuard API"}
