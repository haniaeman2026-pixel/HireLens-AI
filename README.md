 <div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:173D2C,50:2E6548,100:8CB99A&height=200&section=header&text=HireLens-AI&fontSize=58&fontColor=FFFFFF&animation=fadeIn&fontAlignY=42&desc=AI%20Recruitment%20Intelligence&descSize=18&descAlignY=68&descColor=E8F3E9" width="100%" alt="HireLens-AI Animated Header" />

### Transform Job Descriptions into Hiring Intelligence

An AI-powered recruitment intelligence system that analyzes job descriptions, identifies essential skills, classifies roles, and generates structured hiring insights.

[Features](#-key-features) • [Workflow](#-how-it-works) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## 🚀 Overview

**HireLens-AI** is an AI-powered application designed to simplify job description analysis. It transforms unstructured job requirements into organized, actionable insights to help users understand role expectations, required skills, and hiring priorities.

The project combines AI-powered analysis with a clean, professional interface to make recruitment information easier to understand.

## ✨ Key Features

- **Job Description Analysis** — Extracts important information from job postings.
- **Skill Intelligence** — Identifies technical skills, soft skills, and key competencies.
- **Role Classification** — Organizes job information into structured categories.
- **Hiring Reports** — Generates summaries and actionable recruitment insights.
- **AI Workflow** — Uses a structured LangGraph workflow for processing and analysis.
- **Interactive UI** — Provides dedicated Job Analysis and Hiring Reports sections.
- **JSON Export** — Supports exporting structured analysis results.

## ⚙️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | API and application endpoints |
| LangGraph | AI workflow orchestration |
| Groq API | AI-powered analysis |
| React | Frontend interface |
| Vite | Frontend development and build |
| CSS | Responsive UI styling |

## 🔄 How It Works

<div align="center">

**01 — User Input**

Paste a job description.

↓ 

**02 — AI Processing**

Process and analyze the provided text.

↓

**03 — Intelligence Extraction**

Identify skills, requirements, and role information.

↓

**04 — Hiring Report**

Present structured insights and recommendations.

</div>

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
│   ├── package.json
│   └── vite.config.js
├── tests/
├── .gitignore
├── requirements.txt
└── README.md
```

## 💻 Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/HireLens-AI.git
cd HireLens-AI
```

**2. Create and activate a virtual environment**

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

**3. Install backend dependencies**

```bash
pip install -r requirements.txt
```

**4. Configure environment variables**

Create a `.env` file in the project root and configure your Groq API key and supported model:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Keep your API key private. Never commit `.env` to GitHub.

**5. Start the backend**

```bash
python -m uvicorn backend.app:app --reload
```

**6. Start the frontend**

Open another terminal:

```bash
cd frontend-react
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🧪 Testing

Run the available backend tests from the project root:

```bash
python -m pytest -q
```

Check the backend health endpoint:

```text
http://127.0.0.1:8000/api/health
```

## 🎯 Project Objective

The objective of HireLens-AI is to make job descriptions easier to interpret by converting unstructured recruitment information into clear, structured, and actionable hiring insights.

## 🔮 Future Improvements

- Candidate-to-job skill matching
- Advanced recruitment analytics
- Downloadable hiring reports
- Enhanced job market insights

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:8CB99A,50:2E6548,100:173D2C&height=3&section=footer" width="100%" alt="Green divider" />

### Developed by Hania Eman

**AI & Data Science | Python | AI Engineering**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:173D2C,50:2E6548,100:8CB99A&height=120&section=footer&text=Building%20Intelligent%20Solutions&fontSize=20&fontColor=FFFFFF&animation=fadeIn" width="100%" alt="Animated developer footer" />

</div>
