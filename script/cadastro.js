const url = 'https://go-wash-api.onrender.com/api/user';
const userData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : null;

const form = document.querySelector('.form');

if (!userData) {
  function manipularButton(active) {
    const btnCadastrar = document.querySelector('.btnCadastrar');
    if (active) {
      btnCadastrar.classList.add('loading');
      btnCadastrar.innerText = 'Cadastrando...';
      btnCadastrar.setAttribute('disabled', '');
    } else {
      btnCadastrar.classList.remove('loading');
      btnCadastrar.innerText = 'Cadastrar';
      btnCadastrar.removeAttribute('disabled', '');
    }
  }

  function mostrarInformacoes(data, error, loading) {
    const errorSpan = document.querySelector('.error');
    if (loading) {
      manipularButton(true);
      errorSpan.innerText = '';
      errorSpan.classList.remove('active');
    } else if (error) {
      manipularButton(false);
      errorSpan.innerText = data;
      errorSpan.classList.add('active');
    } else if (data) {
      manipularButton(false);

      errorSpan.innerText = '';
      errorSpan.classList.remove('active');
      alert('Cadastro efetuado com sucesso!');
      window.location.href = 'login.html';
    }
  }

  async function enviarCadastro(dadosValidados) {
    let resposta;
    let loading = false;
    let error = false;
    let data = null;

    try {
      loading = true;
      error = false;
      mostrarInformacoes(data, error, loading);
      resposta = await fetch(url, {
        method: 'POST',
        body: dadosValidados,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      data = await resposta.json();

      if (!resposta.ok) {
        if (data.data.errors == 'cpf_cnpj invalid') {
          data = 'CPF/CNPJ inválido!';
        }
        if (data.data.statusCode == 422) {
          if (data.data.errors.email == 'The email has already been taken.') {
            data = 'Email já cadastrado';
          }
          if (
            data.data.errors.cpf_cnpj == 'The cpf cnpj has already been taken.'
          ) {
            data = 'CPF/CNPJ já cadastrado';
          }
        }
        throw new Error(true);
      }
    } catch (e) {
      error = e;
    } finally {
      loading = false;
      mostrarInformacoes(data, error, loading);
    }
  }

  function convertIdade(dataNasc) {
    var dataNascimento = new Date(dataNasc);
    var dataAtual = new Date();
    var diferenca = dataAtual - dataNascimento;
    var diferencaEmAnos = diferenca / (1000 * 60 * 60 * 24 * 365.25);

    return diferencaEmAnos;
  }

  async function validarDados(e) {
    if (e instanceof Event) {
      e.preventDefault();
    }

    var name = document.getElementById('name').value;
    var dataNasc = document.getElementById('dataNasc').value;
    var cpfCnpj = document.getElementById('cpf_cnpj').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    var confSenha = document.getElementById('confSenha').value;
    var termo = document.getElementById('user_type').value;
    var regexCpf = /^[^0-9]*$/;

    let idade = convertIdade(dataNasc);
    const errorSpan = document.querySelector('.error');

    if (idade < 18) {
      errorSpan.innerText = 'É necessário ser maior de idade!';
      errorSpan.classList.add('active');
    } else if (senha.length < 6 && confSenha.length < 6) {
      errorSpan.innerText = 'Senha precisa no mínimo de 6 caracteres!';
      errorSpan.classList.add('active');
    } else if (senha != confSenha) {
      errorSpan.innerText = 'As senhas não conferem!';
      errorSpan.classList.add('active');
    } else if (termo != 1) {
      errorSpan.innerText = 'É necessário aceitar os termos!';
      errorSpan.classList.add('active');
    } else if (regexCpf.test(cpfCnpj)) {
      errorSpan.innerText = 'CPF/CNPJ inválido!';
      errorSpan.classList.add('active');
    } else {
      errorSpan.innerText = '';
      errorSpan.classList.remove('active');

      const dados = {
        name: name,
        email: email,
        user_type_id: 1,
        password: senha,
        cpf_cnpj: cpfCnpj.replace(/[^0-9]/g, ''),
        terms: termo,
        birthday: dataNasc,
      };

      await enviarCadastro(JSON.stringify(dados));
    }
  }
  form.addEventListener('submit', validarDados);
} else {
  window.location.href = 'perfil.html';
}
