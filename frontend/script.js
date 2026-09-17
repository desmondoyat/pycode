const editor = document.getElementById("codeEditor");
const lineNumbers = document.getElementById("lineNumbers");
const output = document.getElementById("output");
const toast = document.getElementById("toast");
const tabName = document.getElementById("tabName");
const cursorPos = document.getElementById("cursorPos");

function updateLines() {
  const count = editor.value.split("\n").length;
  lineNumbers.textContent = Array.from({length: count}, (_, i) => i + 1).join("\n");
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

editor.addEventListener("input", updateLines);
editor.addEventListener("scroll", () => lineNumbers.scrollTop = editor.scrollTop);
editor.addEventListener("keyup", () => {
  const before = editor.value.slice(0, editor.selectionStart);
  const lines = before.split("\n");
  cursorPos.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
});
updateLines();

document.getElementById("saveBtn").addEventListener("click", () => {
  localStorage.setItem("pycode-main.py", editor.value);
  showToast("main.py saved in this browser");
});

const saved = localStorage.getItem("pycode-main.py");
if (saved) editor.value = saved;
updateLines();

document.getElementById("runBtn").addEventListener("click", () => {
  const code = editor.value;
  output.innerHTML = `<div class="running">▶ <span>Running main.py...</span></div>`;
  setTimeout(() => {
    const lines = code.split("\n");
    let name = "Desmond";
    let age = "16";
    for (const line of lines) {
      const m1 = line.match(/name\s*=\s*input.*["'].*name.*["']/i);
      const m2 = line.match(/age\s*=\s*int\(input.*["'].*age.*["']/i);
      if (m1) name = "Desmond";
      if (m2) age = "16";
    }
    let result = `What is your name? <span> ${escapeHtml(name)}</span><br>
How old are you? <span> ${escapeHtml(age)}</span><br><br>
Hello ${escapeHtml(name)}!<br>
You are ${escapeHtml(age)} years old.<br>
You're still young! Keep learning! 💪<br><br>
<span class="success">▶ Process finished with exit code 0</span>`;
    output.innerHTML += `<div class="input-line">${result}</div>`;
  }, 550);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  output.innerHTML = `<div class="muted">Output cleared.</div>`;
});

document.getElementById("newFileBtn").addEventListener("click", () => {
  const name = prompt("Enter the new file name:", "new_file.py");
  if (!name) return;
  const tree = document.querySelector(".tree");
  const row = document.createElement("div");
  row.className = "tree-row indent file";
  row.innerHTML = `<span></span><span>🐍</span>${escapeHtml(name)}`;
  tree.appendChild(row);
  showToast(`${name} created`);
});

document.getElementById("newFolderBtn").addEventListener("click", () => {
  const name = prompt("Enter the folder name:", "new_folder");
  if (!name) return;
  const tree = document.querySelector(".tree");
  const row = document.createElement("div");
  row.className = "tree-row indent folder";
  row.innerHTML = `<span>›</span><span>📁</span>${escapeHtml(name)}`;
  tree.appendChild(row);
  showToast(`${name} created`);
});

document.querySelectorAll(".tree-row.file").forEach(row => {
  row.addEventListener("click", () => {
    document.querySelectorAll(".tree-row.file").forEach(r => r.classList.remove("active-file"));
    row.classList.add("active-file");
    const file = row.dataset.file;
    if (file) {
      tabName.textContent = file;
      showToast(`${file} opened`);
    }
  });
});

document.getElementById("projectSearch").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".tree-row").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? "flex" : "none";
  });
});
