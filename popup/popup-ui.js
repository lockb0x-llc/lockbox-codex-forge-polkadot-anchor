// popup-ui.js

export function setStatusMessage(message, type = "info", recovery = "") {
  const statusDiv = document.getElementById("status");
  if (!statusDiv) return;
  statusDiv.textContent = message + (recovery ? `\nRecovery: ${recovery}` : "");
  statusDiv.className = "status"; // Reset classes, always include 'status'
  statusDiv.classList.add(type); // e.g., "error", "success", "info"
}

export function toggleButtonVisibility(buttonId, visible) {
  const btn = document.getElementById(buttonId);
  if (btn) btn.style.display = visible ? "inline-block" : "none";
}

export function showJsonResult(entry) {
  const jsonResult = document.getElementById("jsonResult");
  if (jsonResult) {
    jsonResult.textContent = entry ? JSON.stringify(entry, null, 2) : "";
    jsonResult.style.display = entry ? "block" : "none";
  }
}

export function showCertificateSummary(certificate) {
  const certificateSummary = document.getElementById("certificateSummary");
  if (certificateSummary) {
    certificateSummary.textContent = certificate
      ? `Certificate: ${JSON.stringify(certificate, null, 2)}`
      : "";
    certificateSummary.style.display = certificate ? "block" : "none";
  }
}

export function showAISummary(ai) {
  const aiSummary = document.getElementById("aiSummary");
  if (aiSummary) {
    aiSummary.textContent = ai
      ? `AI Summary: ${JSON.stringify(ai, null, 2)}`
      : "";
    aiSummary.style.display = ai ? "block" : "none";
  }
}

export function updateStepper(step, status) {
  const el = document.getElementById(step);
  if (!el) return;
  const statusSpan = el.querySelector(".step-status");
  if (status === "done") {
    statusSpan.textContent = "✔";
    el.className = "step done";
  } else if (status === "active") {
    statusSpan.textContent = "...";
    el.className = "step active";
  } else if (status === "error") {
    statusSpan.textContent = "✖";
    el.className = "step error";
  } else {
    statusSpan.textContent = "";
    el.className = "step";
  }
}
