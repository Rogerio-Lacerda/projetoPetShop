const form = document.querySelector('.form');
const url = 'https://api-go-wash-efc9c9582687.herokuapp.com/api/login';

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

    errorSpan.innerText = '';
    errorSpan.classList.remove('active');
    console.log(json);
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
  if (event instanceof Event) {
    event.preventDefault();
  }
  const email = document.getElementById('nome');
  const senha = document.getElementById('senha');

  if (email instanceof HTMLInputElement && senha instanceof HTMLInputElement) {
    const verificarEmail = email.value.split(' ').some((item) => item === '');
    const verificaSenha = senha.value.split(' ').some((item) => item === '');

    if (verificarEmail) {
      console.log('Preecha o email corretamente!');
    } else if (verificaSenha) {
      console.log('Preecha a senha corretamente!');
    } else {
      fetchLogin(url, email.value, senha.value);
    }
  }
}

form.addEventListener('submit', handleSubmit);
