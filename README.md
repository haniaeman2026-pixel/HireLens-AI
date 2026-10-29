# HireLens-AI — Job Intelligence Workspace

HireLens-AI is an AI-powered job description analyzer that converts unstructured recruitment text into structured hiring intelligence. It extracts job information, classifies the role, analyzes skills, and generates a hiring report.

## Features

- Job title, company, experience, and required-skill extraction
- Job category and employment-type classification
- Technical and soft skill identification
- Top-three priority skills
- Structured hiring report and candidate profile
- JSON report export
- Input validation and user-friendly error messages
- Responsive, light-theme HTML/CSS/JavaScript interface

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Python, FastAPI
- **Workflow:** LangGraph with four analysis nodes
- **Validation:** Pydantic
- **LLM API:** Groq
- **Model:** `openai/gpt-oss-20b`

## Project Structure

```text
HireLens-AI/
├── backend/
│   ├── __init__.py
│   ├── app.py
│   ├── graph.py
│   ├── prompts.py
│   ├── schemas.py
│   └── utils.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── tests/
│   └── test_app.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## LangGraph Workflow

1. **Information Extraction:** Extracts the job title, company, experience, and required skills.
2. **Job Classification:** Identifies the job category and employment type.
3. **Skill Analysis:** Separates technical and soft skills and selects up to three priority skills.
4. **Hiring Report:** Produces a structured summary, key requirements, candidate profile, and recommendations.

## Setup

### 1. Install Python dependencies

Create and activate a virtual environment, then run:

```bash
python -m pip install -r requirements.txt
```

### 2. Configure the Groq API

Create a `.env` file in the project root:

```dotenv
GROQ_API_KEY=your_actual_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Keep `.env` private and never expose your API key in frontend code or GitHub.

### 3. Start the application

Run from the project root:

```bash
python -m uvicorn backend.app:app --reload
```

Open `http://127.0.0.1:8000` in your browser.

API documentation is available at `http://127.0.0.1:8000/docs`.

### 4. Run tests

```bash
python -m pytest -q
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Serve the frontend |
| GET | `/api/health` | Check backend status |
| POST | `/api/analyze` | Analyze a job description |
| GET | `/docs` | Interactive API documentation |

## Notes

- A valid Groq API key and an accessible model are required for live AI analysis.
- AI-generated findings should be reviewed before being used for hiring decisions.
- The health endpoint checks service availability; it does not verify live Groq model access.

---

**Developed by Hania Eman**