const form = document.querySelector('.form');
const url = 'https://go-wash-api.onrender.com/api/login';
const userData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : null;

if (userData) {
  window.location.href = 'perfil.html';
}

function manipularButton(active) {
  const buttonLogin = document.querySelector('.btnLogin');
  if (active) {
    buttonLogin.classList.add('loading');
    buttonLogin.innerText = 'Entrando...';
    buttonLogin.setAttribute('disabled', '');
  } else {
    buttonLogin.classList.remove('loading');
    buttonLogin.innerText = 'Entrar';
    buttonLogin.removeAttribute('disabled', '');
  }
}

function mostrarInformacoes(json, error, loading) {
  const errorSpan = document.querySelector('.error');
  if (loading) {
    manipularButton(true);
    errorSpan.innerText = '';
    errorSpan.classList.remove('active');
  } else if (error) {
    manipularButton(false);
    errorSpan.innerText = json.data.errors;
    errorSpan.classList.add('active');
  } else if (json) {
    manipularButton(false);
    window.localStorage.setItem('userData', JSON.stringify(json));
    errorSpan.innerText = '';
    errorSpan.classList.remove('active');
    window.location.href = 'perfil.html';
  }
}

async function fetchLogin(url, email, senha) {
  let response;
  let loading = false;
  let error = false;
  let json = null;
  const dados = {
    email: email,
    password: senha,
    user_type_id: 1,
  };
  try {
    loading = true;
    error = false;
    mostrarInformacoes(json, error, loading);
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'gowash_session=0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj',
      },
      body: JSON.stringify(dados),
    });
    json = await response.json();
    if (!response.ok) throw new Error(true);
  } catch (e) {
    error = e;
  } finally {
    loading = false;
    mostrarInformacoes(json, error, loading);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('nome');
  const senha = document.getElementById('senha');

  const verificarEmail = email.value.split(' ').some((item) => item === '');
  const verificaSenha = senha.value.split(' ').some((item) => item === '');

  const errorSpan = document.querySelector('.error');
  if (verificarEmail) {
    errorSpan.innerText = 'Preecha o email sem espaço!';
    errorSpan.classList.add('active');
  } else if (verificaSenha) {
    errorSpan.innerText = 'Preecha a senha sem espaço!';
    errorSpan.classList.add('active');
  } else {
    errorSpan.innerText = '';
    errorSpan.classList.remove('active');
    fetchLogin(url, email.value, senha.value);
  }
}

form.addEventListener('submit', handleSubmit);
