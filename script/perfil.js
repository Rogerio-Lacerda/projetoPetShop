const userData = localStorage.getItem('userData')
? JSON.parse(localStorage.getItem('userData'))
: null;

if (userData) {
  
  const urlGetEndereco = "https://api-go-wash-efc9c9582687.herokuapp.com/api/auth/address";
  const urlDeleteEndereco = "https://api-go-wash-efc9c9582687.herokuapp.com/api/auth/address/";

  const retornoEndereco = [];
  window.addEventListener('load', async function() {
    let token = userData.access_token;
    let dadosUser = userData.user;
      await getEndereco(token);
      mostrarInfoUser(dadosUser);
    });

  async function getEndereco(token){
    let resposta;
    let data = null;
    try {
      resposta = await fetch(urlGetEndereco, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " +  token,
        },
      });
      data = await resposta.json();
      if (!resposta.ok) {
        if(data.data.statusCode != 200){
          console.log(data);
        }
        throw new Error(true);
      }
      for (const i in data.data){
        retornoEndereco.push(data.data[i])
      }
    }
    catch (e) {
      error = e;
    } finally {
      loading = false;
      //console.log(retornoEndereco);
      mostrarInfoEndereco(retornoEndereco, token);
    }
  }

  function deletarEndereco(botao, token){ 
    botao.addEventListener('click', async function(event) {
      let resposta;
      let data = null;

        event.preventDefault();
        const id = botao.value;
        console.log('ID do botão clicado:', id);
        const confirmacao = window.confirm('Tem certeza que deseja deletar este endereço?');
        if (confirmacao) {
          try {
            let url = urlDeleteEndereco+id;
            resposta = await fetch(url,{
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " +  token,
              },
            });
            data = await resposta.json();
            if (!resposta.ok) {
              if(data.data.statusCode != 200){
                console.log(data);
              }
              throw new Error(true);
            }
          }
          catch (e) {
            console.log(e);
          } finally {
            //console.log(data);
            window.alert('Endereço deletado!');
            window.location.reload()
          }
        }
    });
  }

  function mostrarInfoEndereco(retorno, token){
      const content = document.querySelector(".endereco");
      retorno.map((item)=>{
      const form = document.createElement("form");
      form.classList.add("form");
      //console.log(item)
      form.innerHTML = `
      
        <button value="${item.id}" id="alteraEndereco" class="idEndereco btn-alterar">
          <i class="bi bi-pencil"></i>
        </button>
        <button value="${item.id}" id="deletaEndereco" class="idEndereco btn-deletar">
          <i class="bi bi-trash"></i>
        </button>
      
      <div>
          <h3> Titulo </h3>
          <input readonly value="${item.title}" name="Titulo">
      </div>
  
      <div>
          <h3> CEP </h3>
          <input readonly value="${item.cep}" name="CEP">
      </div>
      
      <div>
          <h3> Endereço </h3>
          <input readonly value="${item.address}" name="Endereco">
      </div>
      
      <div>
          <h3> Número </h3>
          <input readonly value="${item.number}" name="Numero">
      </div>
  
      <div>
          <h3> Complemento </h3>
          <input readonly value="${item.complement}" name="Complemento">
      </div>
      <div class="ponto">.</div>`;
      content.appendChild(form);

      const botoesDeletar = form.querySelectorAll('.btn-deletar');
      botoesDeletar.forEach(function(botao) {
        deletarEndereco(botao, token);
        });
    });
  }

  function mostrarInfoUser(dadosUser){
    let name = dadosUser.name;
    let email = dadosUser.email;
    let user_id = dadosUser.id;
    let cpf_cnpj = dadosUser.cpf_cnpj;
    let nasc = dadosUser.birthday;
    const content = document.querySelector(".informacoes");
    const div = document.createElement("div");
    div.classList.add("dados_user");
    div.innerHTML = `
    <div class="informacoes_user">
      <div>
          <h3>Email</h3>
          <p>${email}</p>
      </div>
      <div>
          <h3>User id</h3>
          <p>${user_id}</p>
      </div>
      <div>
          <h3>Senha</h3>
          <p>********</p>
      </div>
    </div>
    <span class="linhaDivisao"></span>
    <div class="informacoes_user">
        <div>
            <h3>Cpf/Cnpj</h3>
            <p>${cpf_cnpj}</p>
        </div>
        <div>
            <h3>Termo</h3>
            <p>Aceito</p>
        </div>
        <div>
            <h3>Data de Nascimento</h3>
            <p>${nasc}</p>
        </div>
    </div>`;
    content.appendChild(div);

    const main = document.querySelector(".nome");
    const p = document.createElement("p");
    p.innerHTML = `<p>${name}</p>`;
    main.appendChild(p);
  }

  function sairUser(){
    window.localStorage.removeItem("userData");
  }

  
  const btnSair = document.querySelector(".btnSair");
  btnSair.addEventListener("click", sairUser);
} else {
  window.location.href = 'login.html';
  alert("Você precisa estar logado!");
  //console.log(userData);
}
