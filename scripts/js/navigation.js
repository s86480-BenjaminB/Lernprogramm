document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
  
      const target = link.dataset.view;
  
      document.querySelectorAll('.view').forEach(view =>
        view.classList.add('hidden')
      );
  
      const toShow = document.getElementById(`view-${target}`);
      if (toShow) {
        toShow.classList.remove('hidden');
      }
  
      if (target === 'mathe') {
        ladeAlleMatheFragen();
      } else if (target === 'natur') {
        ladeAlleNaturFragen();
      }
      
    });
  });
  