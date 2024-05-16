const userData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : null;

if (userData) {
  function sairUser() {
    window.localStorage.removeItem('userData');
  }
  const btnSair = document.querySelector('.btnSair');
  btnSair.addEventListener('click', sairUser);

  function cadastrarEndereco() {
    const formCadastrar = document.querySelector('.formCadastrar');
    const url = 'https://go-wash-api.onrender.com/api/auth/address';
    const token = userData['access_token'];

    function manipularButton(ativo) {
      const buttonCadastrar = document.querySelector('.btnCadastrar');
      if (ativo) {
        buttonCadastrar.classList.add('loading');
        buttonCadastrar.innerText = 'Cadastrando...';
        buttonCadastrar.setAttribute('disabled', '');
      } else {
        buttonCadastrar.classList.remove('loading');
        buttonCadastrar.innerText = 'Cadastrar';
        buttonCadastrar.removeAttribute('disabled', '');
      }
    }

    function mostrarEndereco(json, error, loading) {
      const errorSpan = document.querySelector('.error');
      const enderecoCadastrado = document.querySelector('.cadastrado');
      if (loading) {
        manipularButton(true);
        errorSpan.classList.remove('ativo');
        enderecoCadastrado.classList.remove('ativo');
      } else if (error) {
        manipularButton(false);
        errorSpan.classList.add('ativo');
        enderecoCadastrado.classList.remove('ativo');
        setTimeout(() => {
          errorSpan.classList.remove('ativo');
        }, 5000);
      } else if (json) {
        manipularButton(false);
        errorSpan.classList.remove('ativo');
        enderecoCadastrado.classList.add('ativo');
        setTimeout(() => {
          enderecoCadastrado.classList.remove('ativo');
          window.location.href = 'perfil.html';
        }, 2000);
      }
    }

    async function fetchCadastrar(dados) {
      let response = null;
      let json = null;
      let error = false;
      let loading = false;
      try {
        loading = true;
        mostrarEndereco(json, error, loading);
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(dados),
        });
        json = await response.json();
        if (!response.ok) throw new Error(`Error: ${response.status}`);
      } catch (e) {
        error = `Error: ${e.message}`;
      } finally {
        loading = false;
        mostrarEndereco(json, error, loading);
      }
    }

    function handleSubmit(e) {
      e.preventDefault();
      const titulo = document.getElementById('titulo').value;
      const cep = document.getElementById('cep').value;
      const endereco = document.getElementById('endereco').value;
      const numero = document.getElementById('numero').value;
      const complemento = document.getElementById('complemento').value;

      if (cep && cep.replace(/[^0-9]/g, '').length !== 8) {
        alert('preecha o CEP com 8 números');
      } else if (titulo && cep && endereco && numero && complemento) {
        const dados = {
          title: titulo,
          cep: cep.replace(/[^0-9]/g, ''),
          address: endereco,
          number: numero,
          complement: complemento,
        };
        fetchCadastrar(dados);
      }
    }

    formCadastrar.addEventListener('submit', handleSubmit);
  }
  cadastrarEndereco();
} else {
  window.location.href = 'login.html';
}
