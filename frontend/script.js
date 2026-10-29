const form = document.getElementById("analysis-form");
const descriptionInput = document.getElementById("job-description");
const analyzeButton = document.getElementById("analyze-button");
const formError = document.getElementById("form-error");
const characterCount = document.getElementById("character-count");
const resultsSection = document.getElementById("results");
const exportButton = document.getElementById("export-button");

let latestReport = null;

descriptionInput.addEventListener("input", () => {
  characterCount.textContent =
    `${descriptionInput.value.length.toLocaleString()} / 20,000`;
  hideError();
});

function hideError() {
  formError.hidden = true;
  formError.textContent = "";
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function setLoading(loading) {
  analyzeButton.disabled = loading;
  descriptionInput.disabled = loading;
  analyzeButton.classList.toggle("is-loading", loading);

  analyzeButton.querySelector(".button-label").textContent = loading
    ? "Analyzing job description..."
    : "Analyze job description";
}

function displayText(id, value, fallback = "Not specified") {
  const element = document.getElementById(id);
  element.textContent =
    typeof value === "string" && value.trim()
      ? value
      : fallback;
}

function renderList(containerId, values, emptyMessage = "No items identified.") {
  const container = document.getElementById(containerId);
  container.replaceChildren();

  const safeValues = Array.isArray(values)
    ? values.filter(
        (item) => typeof item === "string" && item.trim().length > 0
      )
    : [];

  if (safeValues.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }

  safeValues.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    container.appendChild(item);
  });
}

function renderTags(containerId, values, variant = "") {
  const container = document.getElementById(containerId);
  container.replaceChildren();

  const safeValues = Array.isArray(values)
    ? [...new Set(
        values.filter(
          (item) => typeof item === "string" && item.trim().length > 0
        )
      )]
    : [];

  if (safeValues.length === 0) {
    const empty = document.createElement("span");
    empty.className = "empty-state";
    empty.textContent = "No skills identified.";
    container.appendChild(empty);
    return;
  }

  safeValues.forEach((value) => {
    const tag = document.createElement("span");
    tag.className = `skill-tag ${variant}`.trim();
    tag.textContent = value;
    container.appendChild(tag);
  });
}

function renderPrioritySkills(skills) {
  const container = document.getElementById("top-skills");
  container.replaceChildren();

  const safeSkills = Array.isArray(skills)
    ? skills.filter(
        (item) => typeof item === "string" && item.trim().length > 0
      ).slice(0, 3)
    : [];

  if (safeSkills.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No priority skills identified.";
    container.appendChild(empty);
    return;
  }

  safeSkills.forEach((skill, index) => {
    const row = document.createElement("div");
    row.className = "priority-item";

    const rank = document.createElement("span");
    rank.className = "priority-rank";
    rank.textContent = String(index + 1).padStart(2, "0");

    const label = document.createElement("strong");
    label.textContent = skill;

    row.append(rank, label);
    container.appendChild(row);
  });
}

function renderReport(data) {
  const extraction = data.extraction || {};
  const classification = data.classification || {};
  const skills = data.skills || {};
  const report = data.report || {};

  displayText("result-title", extraction.job_title);
  displayText("result-company", extraction.company);
  displayText("result-experience", extraction.experience);
  displayText("result-employment", classification.employment_type);
  displayText("result-category", classification.job_category);
  displayText("classification-experience", extraction.experience);

  renderPrioritySkills(skills.top_3_skills);
  renderTags("technical-skills", skills.technical_skills);
  renderTags("soft-skills", skills.soft_skills, "soft");
  renderTags("required-skills", extraction.required_skills);

  displayText("report-summary", report.summary, "No summary available.");
  displayText(
    "report-profile",
    report.candidate_profile,
    "No candidate profile available."
  );

  renderList("report-requirements", report.key_requirements);
  renderList("report-recommendations", report.recommendations);

  latestReport = data;
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function getErrorMessage(response) {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => item.msg || "Invalid input")
        .join(" ");
    }
  } catch {
    // Use the default message below.
  }

  return `Request failed (${response.status}). Please try again.`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  const jobDescription = descriptionInput.value.trim();

  if (jobDescription.length < 30) {
    showError(
      "Please enter a more detailed job description (at least 30 characters)."
    );
    descriptionInput.focus();
    return;
  }

  if (jobDescription.length > 20000) {
    showError("The job description exceeds the 20,000 character limit.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_description: jobDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    const data = await response.json();
    renderReport(data);
  } catch (error) {
    showError(
      error instanceof TypeError
        ? "Could not connect to the backend. Make sure HireLens-AI is running."
        : error.message || "Analysis failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
});

exportButton.addEventListener("click", () => {
  if (!latestReport) {
    showError("Run a job analysis before exporting a report.");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(latestReport, null, 2)],
    { type: "application/json;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "hirelens-hiring-report.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});