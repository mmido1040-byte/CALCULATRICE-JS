let operation = "";
let showingHistory = false;

const opDisplay = document.getElementById("operation");
const resDisplay = document.getElementById("result");

/* ---------------- TOGGLE HISTORY ---------------- */
function toggleHistory() {
  const calcView = document.getElementById("calcView");
  const historyView = document.getElementById("historyView");

  showingHistory = !showingHistory;
  calcView.style.display = showingHistory ? "none" : "block";
  historyView.style.display = showingHistory ? "block" : "none";
}

/* ---------------- INPUT ---------------- */
function add(value) {
  if (value === "()") {
    const open = (operation.match(/\(/g) || []).length;
    const close = (operation.match(/\)/g) || []).length;
    operation += open > close ? ")" : "(";
  } else {
    operation += value;
  }
  opDisplay.textContent = operation;
}

function clearAll() {
  operation = "";
  opDisplay.textContent = "";
  resDisplay.textContent = "0";
}

function backspace() {
  operation = operation.slice(0, -1);
  opDisplay.textContent = operation;
}

/* ---------------- CALCULATE ---------------- */
function calculate() {
  try {
    if (operation.trim() === "") return;

    let expression = operation
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/%/g, "/100");

    const result = Function(`"use strict"; return (${expression})`)();

    if (!isFinite(result)) throw "Math error";

    resDisplay.textContent = result;
    saveHistory(operation, result);
    operation = "";

    // return to calculator view
    showingHistory = false;
    document.getElementById("historyView").style.display = "none";
    document.getElementById("calcView").style.display = "block";

  } catch {
    resDisplay.textContent = "Erreur";
  }
}

/* ---------------- HISTORY ---------------- */
function saveHistory(op, res) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(`${op} = ${res}`);
  history = history.slice(0, 3);
  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// load history on startup
loadHistory();
