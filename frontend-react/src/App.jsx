
import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/analyze";

function firstValue(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ""
  );
}

function listValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string"
        ? item
        : item?.name || item?.skill || item?.title || ""
    ).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function App() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");

  const extraction =
    result?.job_extraction || result?.extraction || result?.job || result || {};
  const classification =
    result?.job_classification || result?.classification || {};
  // Backend response uses the key "skills".
  const skillAnalysis =
    result?.skills || result?.skill_analysis || result?.skills_analysis || {};
  const report = result?.hiring_report || result?.report || {};

  const title = firstValue(extraction.job_title, extraction.title, "Not specified");
  const company = firstValue(extraction.company, extraction.company_name, "Not specified");
  const experience = firstValue(
    extraction.experience,
    extraction.required_experience,
    classification.required_experience,
    "Not specified"
  );
  const employment = firstValue(
    classification.employment_type,
    extraction.employment_type,
    "Not specified"
  );
  const category = firstValue(
    classification.job_category,
    classification.category,
    "Not specified"
  );

  const technicalSkills = listValue(
    firstValue(skillAnalysis.technical_skills, result?.technical_skills, [])
  );
  const softSkills = listValue(
    firstValue(skillAnalysis.soft_skills, result?.soft_skills, [])
  );
  const prioritySkills = listValue(
    firstValue(
      skillAnalysis.top_3_skills,
      skillAnalysis.priority_skills,
      skillAnalysis.top_skills,
      result?.top_3_skills,
      result?.priority_skills,
      []
    )
  );
  const summary = firstValue(
    report.executive_summary,
    report.summary,
    report.candidate_profile,
    "No summary was returned."
  );

  async function analyzeJob(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (description.trim().length < 30) {
      setError("Please enter a job description containing at least 30 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: description.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Analysis failed. Please check the job description and try again."
        );
      }

      setResult(data);
      setActiveTab("report");
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Cannot connect to the backend. Start FastAPI at http://127.0.0.1:8000 and check CORS settings."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function exportJSON() {
    if (!result) return;

    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hirelens-hiring-report.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="HireLens AI home">
          <span className="brand-mark"><span>✳</span></span>
          <span className="brand-copy"><strong>HireLens<span>-AI</span></strong><small>HIRING INTELLIGENCE</small></span>
        </a>
        <div className="sidebar-divider" />
        <p className="nav-label">WORKSPACE</p>
        <button className={`nav-item ${activeTab === "analysis" ? "selected" : ""}`} onClick={() => { setActiveTab("analysis"); document.getElementById("analysis-workspace")?.scrollIntoView({behavior:"smooth"}); }}>
          <span className="nav-icon">⌕</span><span>Job Analysis</span><span className="nav-arrow">↗</span>
        </button>
        <button className={`nav-item ${activeTab === "report" ? "selected" : ""}`} onClick={() => { if (result) { setActiveTab("report"); document.getElementById("hiring-report")?.scrollIntoView({behavior:"smooth"}); } else { setError("Run a job analysis first to generate your hiring report."); document.getElementById("analysis-workspace")?.scrollIntoView({behavior:"smooth"}); } }}>
          <span className="nav-icon">▤</span><span>Hiring Reports</span><span className="nav-arrow">↗</span>
        </button>
        <div className="sidebar-spacer" />
        <div className="engine-card"><div className="engine-orb">✦</div><div><strong>Groq AI Engine</strong><small><span className="status-dot" /> System operational</small></div></div>
        <div className="sidebar-quote"><span className="quote-leaf">✧</span><p>Better insights.<br/><strong>Smarter hiring.</strong></p></div>
        <div className="sidebar-footer"><span className="footer-mark">H</span><span><strong>HireLens-AI</strong><small>Job intelligence workspace</small></span><span className="version">v1.0</span></div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{activeTab === "report" && result ? "Hiring Reports" : "Job Analysis"}</strong></div>
          <div className="topbar-actions"><span className="system-status"><span className="status-dot"/> AI engine ready</span><span className="topbar-divider"/><div className="profile-avatar" title="HireLens workspace">H</div><div className="profile-copy"><strong>Workspace User</strong><small>AI Hiring Analyst</small></div></div>
        </header>

        <section className="hero" id="analysis-workspace">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-star">✳</span> AI RECRUITMENT INTELLIGENCE</p>
            <h1>See beyond the job title.<br/><em>Discover the talent signals.</em></h1>
            <p className="hero-subtitle">Transform unstructured job descriptions into clear, actionable hiring intelligence — powered by AI.</p>
            <div className="hero-pills"><span><i>✓</i> Structured analysis</span><span><i>✦</i> Skill intelligence</span><span><i>↗</i> Actionable insights</span></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="art-glow"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-document"><div className="doc-top"><span className="doc-mini-logo">H</span><span>JOB INTELLIGENCE</span><span className="doc-dots">•••</span></div><div className="doc-ai">✦ <span>AI analysis</span></div><div className="doc-line wide"/><div className="doc-line medium"/><div className="doc-line short"/><div className="doc-chart"><span/><span/><span/><span/><span/><span/><span/></div><div className="doc-foot"><span>SKILL MATCH</span><strong>94%</strong></div></div><div className="floating-chip chip-top"><span>✦</span> AI insights</div><div className="floating-chip chip-bottom"><span>↗</span> Skills mapped</div><span className="art-spark spark-one">✧</span><span className="art-spark spark-two">✳</span></div>
        </section>

        <section className="workspace-grid">
          <form className="panel input-panel" onSubmit={analyzeJob}>
            <div className="panel-heading"><span className="heading-icon">↗</span><div><p className="card-kicker">START AN ANALYSIS</p><h2>Job description analyzer</h2><p>Paste a role description to uncover its key requirements.</p></div><span className="required-pill">INPUT</span></div>
            <div className="field-heading"><label htmlFor="job-description">JOB DESCRIPTION</label><span>Required field</span></div>
            <textarea id="job-description" value={description} onChange={(event) => setDescription(event.target.value.slice(0, 20000))} placeholder={'Paste a job description here…\n\nFor example: We are looking for a Junior AI Engineer with Python, machine learning, FastAPI and SQL experience.'} maxLength={20000} required />
            <div className="textarea-footer"><span>Tip: Include responsibilities, qualifications and required skills.</span><span className="char-count">{description.length.toLocaleString()} <i>/ 20,000</i></span></div>
            {error && <div className="error-message" role="alert"><span>!</span>{error}</div>}
            <button className="primary-button" type="submit" disabled={loading}>{loading ? <><span className="spinner"/> Analyzing job description…</> : <><span>✦</span> Analyze job description <b>↗</b></>}</button>
            <div className="secure-note"><span>◇</span> Analysis is processed by your configured AI backend.</div>
          </form>
          <aside className="panel workflow-panel">
            <div className="workflow-top"><span className="card-kicker">THE INTELLIGENCE FLOW</span><span className="steps-badge">04 STAGES</span></div>
            <h2>From job post<br/>to <em>clear insight.</em></h2>
            <p className="workflow-description">A focused, four-stage workflow that turns job text into structured hiring intelligence.</p>
            <div className="workflow-steps">{[["01","Extract","Role, company and experience"],["02","Classify","Role category and work type"],["03","Map skills","Technical, soft and priority skills"],["04","Report","Summary and hiring recommendations"]].map(([number,heading,description])=><div className="workflow-step" key={number}><span className="step-number">{number}</span><div><strong>{heading}</strong><p>{description}</p></div><span className="step-check">↗</span></div>)}</div>
            <div className="workflow-bottom"><span className="workflow-bottom-icon">✳</span><span><strong>Built for better decisions</strong><small>Structured output. Practical insight.</small></span></div>
          </aside>
        </section>

        {result && (
          <section className="results-section" id="hiring-report" aria-live="polite">
            <div className="results-heading"><div><p className="eyebrow"><span className="eyebrow-star">✳</span> ANALYSIS COMPLETE</p><h2>Your hiring intelligence <em>report.</em></h2><p>A structured view of the role, its skills and the candidate profile.</p></div><button className="export-button" type="button" onClick={exportJSON}><span>↓</span> Export JSON</button></div>
            <div className="overview-grid">{[["ROLE TITLE",title,"✧"],["COMPANY",company,"⌂"],["EXPERIENCE",experience,"◷"],["EMPLOYMENT TYPE",employment,"▣"]].map(([label,value,icon])=><div className="overview-item" key={label}><span className="overview-icon">{icon}</span><div><span className="overview-label">{label}</span><strong>{value}</strong></div></div>)}</div>
            <div className="report-grid">
              <article className="panel result-card classification-card"><div className="result-card-heading"><span className="heading-icon">⌘</span><div><h3>Role classification</h3><p>Role category and work arrangement</p></div></div><div className="detail-box"><span>JOB CATEGORY</span><strong>{category}</strong></div><div className="detail-box"><span>REQUIRED EXPERIENCE</span><strong>{experience}</strong></div><div className="detail-box"><span>EMPLOYMENT TYPE</span><strong>{employment}</strong></div></article>
              <article className="panel result-card priority-card"><div className="result-card-heading"><span className="heading-icon">✦</span><div><h3>Priority skills</h3><p>The most important skills identified by AI</p></div></div>{prioritySkills.length ? prioritySkills.slice(0,3).map((skill,index)=><div className="priority-item" key={`${skill}-${index}`}><span>{String(index+1).padStart(2,"0")}</span><strong>{skill}</strong><i>↗</i></div>) : <p className="muted">No priority skills returned.</p>}</article>
              <article className="panel result-card"><div className="result-card-heading"><span className="heading-icon">⌘</span><div><h3>Technical skills</h3><p>Tools, technologies and technical knowledge</p></div></div><div className="skill-tags">{technicalSkills.length ? technicalSkills.map((skill,index)=><span key={`${skill}-${index}`}>{skill}</span>) : <span>Not specified</span>}</div></article>
              <article className="panel result-card"><div className="result-card-heading"><span className="heading-icon">◎</span><div><h3>Professional skills</h3><p>Communication and collaboration capabilities</p></div></div><div className="skill-tags soft-tags">{softSkills.length ? softSkills.map((skill,index)=><span key={`${skill}-${index}`}>{skill}</span>) : <span>Not specified</span>}</div></article>
              <article className="panel hiring-report-card"><div className="report-card-top"><div className="result-card-heading"><span className="heading-icon">▤</span><div><h3>Hiring intelligence report</h3><p>Detailed findings and recommendations for this role</p></div></div><span className="report-ready"><span className="status-dot"/> REPORT READY</span></div>
                <div className="report-content"><div className="report-block"><span className="section-label"><i>01</i> EXECUTIVE SUMMARY</span><p className="summary-text">{summary}</p></div>
                {listValue(report.key_requirements).filter(item=>item.trim()).length>0 && <div className="report-block"><span className="section-label"><i>02</i> KEY REQUIREMENTS</span><ul className="report-list">{listValue(report.key_requirements).filter(item=>item.trim()).map((item,index)=><li key={`requirement-${index}`}>{item}</li>)}</ul></div>}
                {report.candidate_profile && <div className="report-block"><span className="section-label"><i>03</i> CANDIDATE PROFILE</span><p className="summary-text">{report.candidate_profile}</p></div>}
                {listValue(report.recommendations).filter(item=>item.trim()).length>0 && <div className="report-block"><span className="section-label"><i>04</i> HIRING RECOMMENDATIONS</span><ul className="report-list recommendation-list">{listValue(report.recommendations).filter(item=>item.trim()).map((item,index)=><li key={`recommendation-${index}`}><span>{String(index+1).padStart(2,"0")}</span>{item}</li>)}</ul></div>}
                {report.responsibilities && <div className="report-block"><span className="section-label">RESPONSIBILITIES</span><p className="summary-text">{listValue(report.responsibilities).join(" • ") || report.responsibilities}</p></div>}</div>
                <div className="report-end-banner"><span className="banner-star">✳</span><div><strong>Better hiring starts with better insight.</strong><p>HireLens-AI turns job descriptions into structured, actionable intelligence.</p></div><button type="button" onClick={exportJSON}>Export report ↗</button></div>
              </article>
            </div>
          </section>
        )}
        <footer className="page-footer"><span className="footer-brand-mark">✳</span><span><strong>HireLens-AI</strong> <i>•</i> Job intelligence workspace</span><span className="footer-powered">POWERED BY GROQ + LANGGRAPH</span></footer>
      </main>
    </div>
  );
}

export default App;
