
const API = "http://localhost:3000";


function loginUser(userId) {
  localStorage.setItem("loggedUser", String(userId));
}

function getLoggedUser() {
  const id = localStorage.getItem("loggedUser");
  return id ? Number(id) : null;
}

function requireLogin() {
  if (!getLoggedUser()) {
    window.location.href = "index.html";
  }
}


async function fetchUsers() {
  const res = await fetch(`${API}/users`);
  return res.json();
}

async function fetchUserById(id) {
  const res = await fetch(`${API}/users/${id}`);
  return res.json();
}

async function fetchNews() {
  const res = await fetch(`${API}/news`);
  return res.json();
}

async function fetchNewsById(id) {
  const res = await fetch(`${API}/news/${id}`);
  return res.json();
}


function isEmpty(str) {
  return !str || str.trim().length === 0;
}

function isShort(str, min) {
  return !str || str.trim().length < min;
}
