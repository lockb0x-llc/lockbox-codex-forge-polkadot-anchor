document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("codexEntry", ({ codexEntry }) => {
    const entryElem = document.getElementById("entry");
    entryElem.textContent = codexEntry
      ? JSON.stringify(codexEntry, null, 2)
      : "No codex entry found.";

    document.getElementById("copyBtn").onclick = () => {
      navigator.clipboard.writeText(entryElem.textContent);
    };

    document.getElementById("downloadBtn").onclick = () => {
      const blob = new Blob([entryElem.textContent], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "codex-entry.json";
      a.click();
      URL.revokeObjectURL(url);
    };
  });
});
