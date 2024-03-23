const url = 'https://api-go-wash-efc9c9582687.herokuapp.com/api/user';

const btnCadastrar = document.querySelector('.btnCadastrar');
btnCadastrar.addEventListener('click', cadastroUsuario);

async function cadastroUsuario(e) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  var dataNasc = document.getElementById('dataNasc').value;
  var cpfCnpj = document.getElementById('cpf_cnpj').value;
  var email = document.getElementById('email').value;
  var senha = document.getElementById('senha').value;
  var confSenha = document.getElementById('confSenha').value;
  var termo = document.getElementById('user_type').value;

  if (senha == confSenha) {
    let resposta;
    let data;
    let error;
    try {
      resposta = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: email,
          user_type_id: 1,
          password: senha,
          cpf_cnpj: cpfCnpj,
          terms: termo,
          birthday: dataNasc,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      data = await resposta.json();

      // if (data.data.statusCode != 200) {
      //   alert(data.data.errors?.cpf_cnpj[0]);
      //   return;
      // }
      // alert('Cadastro feito com sucesso');
      if (!resposta.ok) throw new Error(e);
    } catch (e) {
      error = e;
    } finally {
      console.log(resposta);
      console.log(data);
      console.log(error);
      // window.location.href = 'login.html';
    }
  } else {
    alert('Senhas não conferem');
  }
}