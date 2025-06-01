const REST_BASE = 'https://idefix.informatik.htw-dresden.de:8888/api';
const REST_USER = 's86480@htw-dresden.de';
const REST_PASS = 'Bb26.07.?';

// Basic Auth Header erzeugen
function authHeader() {
  return {
    'Authorization': 'Basic ' + btoa(`${REST_USER}:${REST_PASS}`),
    'Content-Type': 'application/json'
  };
}

// Registrierung eines neuen Users
async function registerUser(email, password) {
  try {
    const res = await fetch(`${REST_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('❌ Fehler bei Registrierung:', err);
    throw err;
  }
}

// Hole alle Quizfragen (1. Seite)
async function getAllQuizzes() {
  try {
    const res = await fetch(`${REST_BASE}/quizzes?page=0`, {
      method: 'GET',
      headers: authHeader()
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const data = await res.json();
    console.log('📦 REST-Antwort:', data);
    return data.content || [];
  } catch (err) {
    console.error('❌ Fehler beim Laden der Quizzes:', err);
    return [];
  }
}

// Hole ein spezifisches Quiz
async function getQuizById(id) {
  try {
    const res = await fetch(`${REST_BASE}/quizzes/${id}`, {
      method: 'GET',
      headers: authHeader()
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Fehler beim Laden von Quiz ID ${id}:`, err);
    return null;
  }
}

// Sende eine Antwort auf ein Quiz
async function solveQuiz(id, selectedIndices) {
  try {
    const res = await fetch(`${REST_BASE}/quizzes/${id}/solve`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(selectedIndices)
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json(); // { success: true/false, feedback: ... }
  } catch (err) {
    console.error(`❌ Fehler beim Senden der Antwort für Quiz ID ${id}:`, err);
    return { success: false, feedback: 'Fehler beim Senden der Antwort.' };
  }
}
