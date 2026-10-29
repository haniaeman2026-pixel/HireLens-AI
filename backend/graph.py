
import json
import logging
import os
from typing import Any, TypedDict

from dotenv import load_dotenv
from groq import Groq
from langgraph.graph import StateGraph, START, END

from backend.schemas import (
    JobExtraction,
    JobClassification,
    SkillAnalysis,
    HiringReport,
)
from backend.prompts import (
    EXTRACTION_PROMPT,
    CLASSIFICATION_PROMPT,
    SKILL_ANALYSIS_PROMPT,
    HIRING_REPORT_PROMPT,
)
from backend.utils import parse_json_response


# --------------------------------------------------
# Configuration
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

logger = logging.getLogger(__name__)

MODEL_DEFAULT = "openai/gpt-oss-20b"
MAX_COMPLETION_TOKENS = 4096


# --------------------------------------------------
# LangGraph State
# --------------------------------------------------

class JobState(TypedDict, total=False):
    job_description: str
    extraction: dict[str, Any]
    classification: dict[str, Any]
    skills: dict[str, Any]
    report: dict[str, Any]


# --------------------------------------------------
# Groq Client
# --------------------------------------------------

def get_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY", "").strip()

    if not api_key or api_key == "your_groq_api_key_here":
        raise RuntimeError(
            "Groq API key is missing. Add GROQ_API_KEY to your project .env file."
        )

    return Groq(api_key=api_key)


# --------------------------------------------------
# AI Completion
# --------------------------------------------------

def call_ai(system_prompt: str, user_content: str) -> dict[str, Any]:
    client = get_client()
    model = os.getenv("GROQ_MODEL", MODEL_DEFAULT).strip()

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        system_prompt
                        + "\n\nReturn only a valid JSON object. "
                        "Include all required fields. Do not use Markdown fences."
                    ),
                },
                {
                    "role": "user",
                    "content": user_content,
                },
            ],
            response_format={"type": "json_object"},
            max_completion_tokens=MAX_COMPLETION_TOKENS,
            reasoning_effort="low",
        )

    except Exception:
        logger.exception("Groq request failed for model %s", model)
        raise

    choice = response.choices[0]
    content = choice.message.content or ""

    if not content.strip():
        raise RuntimeError(
            "Groq returned an empty response. "
            f"Finish reason: {choice.finish_reason}. "
            f"Model: {model}."
        )

    try:
        parsed = parse_json_response(content)

        if not isinstance(parsed, dict):
            raise ValueError("The AI response is not a JSON object.")

        return parsed

    except Exception as exc:
        logger.exception("Failed to parse the AI JSON response")
        raise ValueError(
            "The AI returned invalid JSON. Please retry the analysis."
        ) from exc


# --------------------------------------------------
# Information Extraction
# --------------------------------------------------

def extraction_node(state: JobState) -> dict:
    raw = call_ai(
        EXTRACTION_PROMPT,
        state["job_description"],
    )

    result = JobExtraction.model_validate(raw)

    return {
        "extraction": result.model_dump(),
    }


# --------------------------------------------------
# Job Classification
# --------------------------------------------------

def classification_node(state: JobState) -> dict:
    payload = {
        "job_description": state["job_description"],
        "extraction": state["extraction"],
    }

    raw = call_ai(
        CLASSIFICATION_PROMPT,
        json.dumps(payload, ensure_ascii=False),
    )

    result = JobClassification.model_validate(raw)

    return {
        "classification": result.model_dump(),
    }


# --------------------------------------------------
# Skill Analysis
# --------------------------------------------------

def skill_analysis_node(state: JobState) -> dict:
    payload = {
        "job_description": state["job_description"],
        "extraction": state["extraction"],
    }

    raw = call_ai(
        SKILL_ANALYSIS_PROMPT,
        json.dumps(payload, ensure_ascii=False),
    )

    result = SkillAnalysis.model_validate(raw)

    return {
        "skills": result.model_dump(),
    }


# --------------------------------------------------
# Hiring Report
# --------------------------------------------------

def hiring_report_node(state: JobState) -> dict:
    payload = {
        "job_description": state["job_description"],
        "extraction": state["extraction"],
        "classification": state["classification"],
        "skills": state["skills"],
    }

    raw = call_ai(
        HIRING_REPORT_PROMPT,
        json.dumps(payload, ensure_ascii=False),
    )

    result = HiringReport.model_validate(raw)

    return {
        "report": result.model_dump(),
    }


# --------------------------------------------------
# Build LangGraph Workflow
# --------------------------------------------------

def build_graph():
    workflow = StateGraph(JobState)

    workflow.add_node(
        "information_extraction",
        extraction_node,
    )
    workflow.add_node(
        "job_classification",
        classification_node,
    )
    workflow.add_node(
        "skill_analysis",
        skill_analysis_node,
    )
    workflow.add_node(
        "hiring_report",
        hiring_report_node,
    )

    workflow.add_edge(
        START,
        "information_extraction",
    )
    workflow.add_edge(
        "information_extraction",
        "job_classification",
    )
    workflow.add_edge(
        "job_classification",
        "skill_analysis",
    )
    workflow.add_edge(
        "skill_analysis",
        "hiring_report",
    )
    workflow.add_edge(
        "hiring_report",
        END,
    )

    return workflow.compile()


job_analysis_graph = build_graph()


# --------------------------------------------------
# Public Analysis Function
# --------------------------------------------------

def analyze_job_description(job_description: str) -> dict:
    result = job_analysis_graph.invoke(
        {
            "job_description": job_description,
        }
    )

    return {
        "extraction": result["extraction"],
        "classification": result["classification"],
        "skills": result["skills"],
        "report": result["report"],
    }
