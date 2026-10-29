 <div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:173F35,50:2F6B52,100:A8C5A0&height=220&section=header&text=HireLens-AI&fontSize=58&fontColor=FFFFFF&fontAlignY=38&desc=AI-Powered%20Recruitment%20Intelligence&descSize=18&descAlignY=58&animation=fadeIn" width="100%" alt="HireLens-AI animated header" />

### Intelligent Job Analysis • Skill Extraction • Hiring Insights

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-AI%20Workflow-355E3B?style=for-the-badge)](https://www.langchain.com/langgraph)
[![Groq](https://img.shields.io/badge/Groq-LLM%20Integration-F55036?style=for-the-badge)](https://groq.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)

</div>

---

## 📌 Overview

**HireLens-AI** is an AI-powered recruitment intelligence system that analyzes job descriptions and converts unstructured hiring requirements into clear, structured insights.

Built with **Python, FastAPI, LangGraph, Groq, and React**, the system helps users understand job requirements, identify essential skills, classify roles, and generate organized hiring reports.

## ✨ Key Features

- **Job Description Analysis** — Extracts important information from job descriptions.
- **Skill Identification** — Highlights required technical and professional skills.
- **Job Classification** — Organizes role-related information into structured categories.
- **Hiring Reports** — Generates clear, actionable recruitment insights.
- **AI Workflow** — Uses LangGraph to organize analysis into defined processing steps.
- **Interactive Dashboard** — Provides a modern interface for job analysis and hiring reports.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend logic and processing |
| FastAPI | REST API development |
| LangGraph | AI workflow orchestration |
| Groq API | Language model integration |
| React | Interactive user interface |
| Vite | Frontend development and build tooling |

## 🔄 How It Works

1. **Input:** The user submits a job description.
2. **Processing:** The backend processes the provided text.
3. **AI Analysis:** The workflow extracts requirements, identifies skills, and organizes job-related information.
4. **Report Generation:** Structured insights are returned to the frontend.
5. **Output:** The user reviews the analysis and hiring report.

## 📂 Project Structure

```text
HireLens-AI/
├── backend/
│   ├── app.py
│   ├── graph.py
│   ├── schemas.py
│   └── utils.py
├── frontend-react/
│   ├── src/
│   ├── public/
│   └── package.json
├── tests/
├── .env
├── .gitignore
└── requirements.txt
```

*Note: The structure above represents the main project components; additional frontend files may be present.*

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/haniaeman2026-pixel/HireLens-AI.git
cd HireLens-AI
```

### 2. Set Up the Backend

```bash
python -m venv .venv
```

Activate the environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Replace the placeholder with your own API key. **Never upload your API key or `.env` file to GitHub.**

### 4. Run the Backend

```bash
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

### 5. Run the React Frontend

Open another terminal:

```bash
cd frontend-react
npm install
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## 🎯 Project Objective

The objective of HireLens-AI is to demonstrate how large language models and structured AI workflows can support recruitment by transforming job descriptions into useful, understandable hiring intelligence.

## 🚀 Future Improvements

- Resume-to-job matching
- Candidate skill-gap analysis
- Job market insights
- Exportable recruitment reports
- Role-based access and user authentication

---

<div align="center">

**Transforming Job Descriptions into Intelligent Hiring Insights.**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:A8C5A0,50:2F6B52,100:173F35&height=140&section=footer&text=Developed%20by%20Hania%20Eman&fontSize=25&fontColor=FFFFFF&animation=fadeIn" width="100%" alt="Animated developer credit footer" />

</div>
