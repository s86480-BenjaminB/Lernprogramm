document.querySelectorAll('[data-view]').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const ziel = link.getAttribute('data-view');

    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${ziel}`).classList.remove('hidden');

    if (ziel === 'mathe') {
      ladeAlleMatheFragen();
    } else if (ziel === 'geschichte') {
      ladeAlleGeschichteFragen();
    } else if (ziel === 'noten') {
      ladeAlleNotenFragen();
    }
  });
});

// Extra: fürs zurückführen auf Start-view bei Click auf Titel
document.querySelector('.branding').addEventListener('click', () => {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-start').classList.remove('hidden');
});
