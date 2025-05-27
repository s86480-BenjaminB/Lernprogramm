// Navbar
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
  
      const target = link.dataset.view;
  
      document.querySelectorAll('.view').forEach(view =>
        view.classList.add('hidden')
      );
  
      const viewToShow = document.getElementById(`view-${target}`);
      if (viewToShow) {
        viewToShow.classList.remove('hidden');
      }
    });
  });
  