const fragenUrl = '../json/fragen.json';
let alleMatheFragen = [];
let aktuellerMatheIndex = 0;
let matheErgebnisse = [];
let geschichteFragen = [];
let geschichteIndex = 0;
let geschichteErgebnisse = [];


function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
  

async function ladeAlleMatheFragen() {
  try {
    const res = await fetch(fragenUrl);
    const daten = await res.json();
    alleMatheFragen = shuffleArray(daten.mathe);
    aktuellerMatheIndex = 0;
    matheErgebnisse = [];

    updateProgressBar(aktuellerMatheIndex, alleMatheFragen.length, "mathe");
    zeigeMatheFrage(alleMatheFragen[aktuellerMatheIndex]);
  } catch (err) {
    console.error('Fehler beim Laden:', err);
  }
}


async function ladeAlleGeschichteFragen() {
  try {
    geschichteFragen = (await getAllQuizzes()).slice(0, 10);
    geschichteIndex = 0;
    geschichteErgebnisse = [];

    updateProgressBar(geschichteIndex, geschichteFragen.length, "geschichte");

    if (geschichteFragen.length === 0) {
      document.getElementById('view-geschichte').innerHTML = `
        <h2>Geschichte</h2>
        <p>Keine Fragen verfügbar.</p>
      `;
      return;
    }

    zeigeGeschichteFrage(geschichteFragen[geschichteIndex]);
  } catch (err) {
    document.getElementById('view-geschichte').innerHTML = `
      <h2>Geschichte</h2>
      <p>Fehler beim Laden der Fragen.</p>
    `;
  }
}



function zeigeGeschichteFrage(frageObjekt) {
  const frageText = document.getElementById('geschichte-frage-text');
  const antwortContainer = document.getElementById('geschichte-antwort-buttons');

  frageText.innerHTML = frageObjekt.text;
  antwortContainer.innerHTML = '';

  document.getElementById('progress-bar').value = geschichteIndex;

  frageObjekt.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'antwort-btn';
    btn.textContent = opt;

    btn.onclick = async () => {
      const result = await solveQuiz(frageObjekt.id, [index]);

      const buttons = antwortContainer.querySelectorAll('button');
      buttons.forEach((b, i) => {
        if (i === index) {
          b.classList.add(result.success ? 'antwort-richtig' : 'antwort-falsch');
        } else {
          b.classList.add('antwort-neutral');
        }
        b.disabled = true;
      });

      geschichteErgebnisse.push(result.success);
      geschichteIndex++;
      updateProgressBar(geschichteIndex, geschichteFragen.length, "geschichte");

      setTimeout(() => {
        if (geschichteIndex < geschichteFragen.length) {
          zeigeGeschichteFrage(geschichteFragen[geschichteIndex]);
        } else {
          zeigeGeschichteAuswertung();
        }
      }, 1500);
    };

    antwortContainer.appendChild(btn);
  });
}
  
  
function zeigeMatheFrage(frageObjekt) {
    const frageText = document.getElementById('frage-text');
    const antwortContainer = document.getElementById('antwort-buttons');
  
    frageText.innerHTML = '';
    antwortContainer.innerHTML = '';
  
    katex.render(frageObjekt.a, frageText, { throwOnError: false });
  
    const antworten = [...frageObjekt.l].sort(() => Math.random() - 0.5);
  
    antworten.forEach(antwort => {
      const btn = document.createElement('button');
      const span = document.createElement('span');
  
      katex.render(antwort, span, { throwOnError: false });
  
      btn.appendChild(span);
      btn.classList.add('antwort-btn');
      btn.onclick = () => prüfeMatheAntwort(antwort === frageObjekt.l[0], btn, frageObjekt.l[0]);
      antwortContainer.appendChild(btn);
    });
    updateProgressBar(aktuellerMatheIndex, alleMatheFragen.length, "mathe");
  
}

function updateProgressBar(value, max, fach) {
  const bar = document.getElementById(`progress-bar-${fach}`);
  if (bar) {
    bar.max = max;
    bar.value = value;
  }
}

  

function prüfeMatheAntwort(istKorrekt, btn, richtigeAntwort) {
  const buttons = document.querySelectorAll('.antwort-btn');
  buttons.forEach(b => {
    const val = b.textContent.trim().replace(/\s/g, '');
    const richtig = richtigeAntwort.replace(/\s/g, '');
    if (b === btn) {
      b.classList.add(istKorrekt ? 'antwort-richtig' : 'antwort-falsch');
    } else if (val === richtig) {
      b.classList.add('antwort-richtig');
    } else {
      b.classList.add('antwort-neutral');
    }
    b.disabled = true;
  });

  matheErgebnisse.push(istKorrekt);
  aktuellerMatheIndex++;
  updateProgressBar(aktuellerMatheIndex, alleMatheFragen.length, "mathe");

  setTimeout(() => {
    if (aktuellerMatheIndex < alleMatheFragen.length) {
      zeigeMatheFrage(alleMatheFragen[aktuellerMatheIndex]);
    } else {
      zeigeAuswertung();
    }
  }, 1500);
}


function zeigeGeschichteAuswertung() {
  const richtig = geschichteErgebnisse.filter(x => x).length;
  const falsch = geschichteErgebnisse.length - richtig;

  document.getElementById('geschichte-auswertung-box').classList.remove('hidden');
  document.getElementById('geschichte-frage-box').classList.add('hidden');
  document.getElementById('geschichte-auswertung-text').textContent =
    `Du hast ${richtig} richtig und ${falsch} falsch beantwortet.`;

  document.getElementById('geschichte-restart-btn').onclick = geschichteNeuStarten;
}



function zeigeAuswertung() {
    document.getElementById('frage-box').classList.add('hidden');
    document.getElementById('auswertung-box').classList.remove('hidden');
  
    const richtig = matheErgebnisse.filter(x => x).length;
    const falsch = matheErgebnisse.length - richtig;
  
    document.getElementById('auswertung-text').textContent =
      `Du hast ${richtig} richtig und ${falsch} falsch beantwortet.`;
}     
  
  
function matheNeuStarten() {
    aktuellerMatheIndex = 0;
    matheErgebnisse = [];
  
    document.getElementById('auswertung-box').classList.add('hidden');
    document.getElementById('frage-box').classList.remove('hidden');
    document.getElementById('progress-bar-mathe').value = 0;
  
    ladeAlleMatheFragen();
}

function geschichteNeuStarten() {
  geschichteIndex = 0;
  geschichteErgebnisse = [];

  document.getElementById('geschichte-auswertung-box').classList.add('hidden');
  document.getElementById('geschichte-frage-box').classList.remove('hidden');
  document.getElementById('progress-bar-geschichte').value = 0;

  ladeAlleGeschichteFragen();
}
