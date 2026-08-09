window.addEventListener('online', () => window.location.reload());
window.addEventListener('offline', () => {
  document.body.classList.add('offline');
});
