import json
import re
from typing import Any


def validate_job_description(text: str) -> str:
    if not isinstance(text, str):
        raise ValueError("Job description must be text.")

    cleaned = text.strip()

    if not cleaned:
        raise ValueError("Please enter a job description.")

    if len(cleaned) < 30:
        raise ValueError(
            "Please enter a more detailed job description "
            "(at least 30 characters)."
        )

    if len(cleaned) > 20000:
        raise ValueError(
            "Job description is too long. Maximum: 20,000 characters."
        )

    return cleaned


def parse_json_response(content: str) -> dict[str, Any]:
    if not content or not content.strip():
        raise ValueError("The AI returned an empty response.")

    cleaned = content.strip()

    # Remove Markdown code fences if the model includes them.
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ValueError("The AI returned invalid JSON.") from exc

    if not isinstance(data, dict):
        raise ValueError("The AI response must be a JSON object.")

    return data