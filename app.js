const API = "http://localhost:3000";

// ---------------- Auth ----------------
function loginUser(userId) {
  localStorage.setItem("loggedUser", String(userId));
}

function getLoggedUser() {
  const id = localStorage.getItem("loggedUser");
  return id ? Number(id) : null;
}

function requireLogin() {
  if (!getLoggedUser()) window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "index.html";
}

// --------------- Utils ----------------
function isEmpty(str) {
  return !str || str.trim().length === 0;
}
function isShort(str, min) {
  return !str || str.trim().length < min;
}

// --------------- API Helpers ----------
async function httpJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} on ${url}\n${txt}`);
  }
  return res.json();
}

async function fetchUsers() {
  return httpJson(`${API}/users`);
}
async function fetchNews() {
  return httpJson(`${API}/news`);
}
async function fetchNewsById(id) {
  return httpJson(`${API}/news/${id}`);
}
async function createNews(payload) {
  return httpJson(`${API}/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
async function patchNews(id, payload) {
  return httpJson(`${API}/news/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
async function deleteNewsById(id) {
  const res = await fetch(`${API}/news/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return true;
}
