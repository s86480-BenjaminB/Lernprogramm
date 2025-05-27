'use strict';

let questions = [];
let currentIndex = 0;
let correctCount = 0;

document.querySelectorAll('[data-category]').forEach(btn =>
  btn.addEventListener('click', async () => {
    const category = btn.dataset.category;
    await loadQuestions(category);
    startQuiz();
  })
);

async function loadQuestions(category) {
  // Dummy-Daten – später durch REST-API ersetzen
  const data = {
    mathe: [
      { a: 'x^2 + x^2', l: ['2x^2', 'x^4', 'x^8', '2x^4'] },
      { a: 'x^2 * x^2', l: ['x^4', 'x^2', '2x^2', '4x'] }
    ],
    web: [
      { a: 'Welche Authentifizierung bietet HTTP?', l: ['Digest Access Authentication', 'OTP', 'OAuth', '2-Faktor'] },
      { a: 'Welches Protokoll eignet sich für zeitkritische Übertragungen?', l: ['UDP', 'TCP', 'HTTP', 'Fast Retransmit'] }
    ]
  };

  questions = shuffleArray(data[category]);
}

function startQuiz() {
  currentIndex = 0;
  correctCount = 0;

  document.getElementById('category-selection').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');

  showQuestion();
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    showSummary();
    return;
  }

  const q = questions[currentIndex];
  const answers = shuffleArray(q.l);
  const questionText = document.getElementById('question-text');
  const answersDiv = document.getElementById('answers');

  questionText.textContent = q.a;
  answersDiv.innerHTML = '';

  answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.addEventListener('click', () => handleAnswer(answer === q.l[0]));
    answersDiv.appendChild(btn);
  });

  updateProgress();
}

function handleAnswer(isCorrect) {
  if (isCorrect) correctCount++;
  currentIndex++;
  showQuestion();
}

function updateProgress() {
  const progress = document.getElementById('progress');
  progress.max = questions.length;
  progress.value = currentIndex;
}

function showSummary() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('summary').classList.remove('hidden');

  const stats = document.getElementById('stats');
  stats.textContent = `Du hast ${correctCount} von ${questions.length} Aufgaben richtig beantwortet.`;
}

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
