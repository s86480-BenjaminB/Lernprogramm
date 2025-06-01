const fragenUrl = '../json/fragen.json';
let alleFragen = [];
let aktuellerIndex = 0;
let ergebnisse = [];

function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
  

async function ladeAlleMatheFragen() {
    console.log('📥 ladeAlleMatheFragen() wurde aufgerufen');
    try {
        const res = await fetch(fragenUrl);
        const daten = await res.json();
        alleFragen = shuffleArray(daten.mathe); // einmal mischen
        aktuellerIndex = 0;
        ergebnisse = [];
        zeigeMatheFrage(alleFragen[aktuellerIndex]);
        updateProgressBar();
    } catch (err) {
        console.error('Fehler beim Laden:', err);
    }
}

async function ladeAlleNaturFragen() {
  console.log('🌐 Lade Naturfragen über REST');
  try {
    const fragen = await getAllQuizzes();

    if (!fragen.length) {
      document.getElementById('view-natur').innerHTML = `
        <h2>Naturwissenschaften</h2>
        <p>⚠️ Keine Fragen verfügbar.</p>
      `;
      return;
    }

    zeigeNaturFrage(fragen[0]);
  } catch (err) {
    console.error('❌ Fehler in ladeNaturFragen():', err);
    document.getElementById('view-natur').innerHTML = `
      <h2>Naturwissenschaften</h2>
      <p>❌ Fehler beim Laden der Fragen.</p>
    `;
  }
}


function zeigeNaturFrage(frageObjekt) {
  const container = document.getElementById('view-natur');
  container.innerHTML = ''; // alles löschen, damit kein doppelter Text

  const title = document.createElement('h2');
  title.textContent = frageObjekt.title;

  const text = document.createElement('p');
  text.textContent = frageObjekt.text;

  const buttonArea = document.createElement('div');
  buttonArea.id = 'natur-buttons';
  buttonArea.className = 'answer-buttons';

  frageObjekt.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'antwort-btn';
    btn.textContent = opt;
    btn.onclick = () => alert(`Du hast Option ${index} gewählt (noch keine Prüfung)`);
    buttonArea.appendChild(btn);
  });

  container.appendChild(title);
  container.appendChild(text);
  container.appendChild(buttonArea);

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
  
    updateProgressBar();
}

function updateProgressBar() {
    const bar = document.getElementById('progress-bar');
    bar.max = alleFragen.length;
    bar.value = ergebnisse.length;
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
  
    ergebnisse.push(istKorrekt);
    updateProgressDots();
  
    setTimeout(() => {
      aktuellerIndex++;
      if (aktuellerIndex < alleFragen.length) {
        zeigeMatheFrage(alleFragen[aktuellerIndex]);
      } else {
        zeigeAuswertung();
      }
    }, 1500);
}


function zeigeAuswertung() {
    document.getElementById('frage-box').classList.add('hidden');
    document.getElementById('auswertung-box').classList.remove('hidden');
  
    const richtig = ergebnisse.filter(x => x).length;
    const falsch = ergebnisse.length - richtig;
  
    document.getElementById('auswertung-text').textContent =
      `Du hast ${richtig} richtig und ${falsch} falsch beantwortet.`;
}     
  
  
function matheNeuStarten() {
    aktuellerIndex = 0;
    ergebnisse = [];
  
    document.getElementById('auswertung-box').classList.add('hidden');
    document.getElementById('frage-box').classList.remove('hidden');
    document.getElementById('progress-bar').value = 0;
  
    ladeAlleMatheFragen();
}
  