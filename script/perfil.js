const userData = JSON.parse(localStorage.getItem('userData'));

if (userData) {
  console.log(userData);
} else {
  console.log('ir para login');
}
