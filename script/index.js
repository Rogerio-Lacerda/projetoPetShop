const userData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : null;

if (userData) {
  window.location.href = './view/perfil.html';
}
