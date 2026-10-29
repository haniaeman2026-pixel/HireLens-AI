
from typing import Literal

from pydantic import BaseModel, Field


class JobExtraction(BaseModel):
    job_title: str = "Not specified"
    company: str = "Not specified"
    experience: str = "Not specified"
    required_skills: list[str] = Field(default_factory=list)


class JobClassification(BaseModel):
    job_category: str = "Other"
    employment_type: str = "Not specified"


class SkillAnalysis(BaseModel):
    technical_skills: list[str] = Field(default_factory=list)
    soft_skills: list[str] = Field(default_factory=list)
    top_3_skills: list[str] = Field(default_factory=list)


class HiringReport(BaseModel):
    summary: str = Field(
        ...,
        min_length=1,
        description="Complete professional summary of the role.",
    )
    key_requirements: list[str] = Field(default_factory=list)
    candidate_profile: str = Field(
        ...,
        min_length=1,
        description="Description of the candidate sought.",
    )
    recommendations: list[str] = Field(default_factory=list)
    report_status: Literal["completed"] = "completed"


class AnalysisResponse(BaseModel):
    extraction: JobExtraction
    classification: JobClassification
    skills: SkillAnalysis
    report: HiringReport
