
import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.graph import analyze_job_description
from backend.schemas import AnalysisResponse
from backend.utils import validate_job_description


# --------------------------------------------------
# Logging
# --------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend-react"


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="HireLens-AI",
    description="AI-powered job description analysis platform",
    version="1.0.0",
)


# --------------------------------------------------
# CORS: React + Vite Frontend
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# --------------------------------------------------
# Request Model
# --------------------------------------------------

class AnalyzeRequest(BaseModel):
    job_description: str = Field(
        ...,
        min_length=1,
        max_length=20000,
    )


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "HireLens-AI",
    }


# --------------------------------------------------
# Job Description Analysis
# --------------------------------------------------

@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze(request: AnalyzeRequest):
    try:
        description = validate_job_description(
            request.job_description
        )

        logger.info("Starting job description analysis")

        result = analyze_job_description(description)

        response = AnalysisResponse.model_validate(result)

        logger.info("Job description analysis completed successfully")

        return response

    except ValueError as exc:
        logger.warning("Invalid job description: %s", exc)

        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        logger.exception("AI service configuration error")

        message = str(exc)

        if "API key is missing" in message:
            raise HTTPException(
                status_code=500,
                detail=message,
            ) from exc

        raise HTTPException(
            status_code=502,
            detail="AI service configuration error. Check your Groq settings.",
        ) from exc

    except Exception as exc:
        logger.exception("HireLens-AI analysis failed")

        raise HTTPException(
            status_code=502,
            detail=(
                "Analysis could not be completed. "
                "Check the backend terminal for the actual error."
            ),
        ) from exc
