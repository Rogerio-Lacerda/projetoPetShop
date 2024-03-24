const userData = JSON.parse(localStorage.getItem('userData'));

if (userData) {
  console.log(userData);
} else {
  console.log('ir para login');
}

const urlGetEndereco = "https://api-go-wash-efc9c9582687.herokuapp.com/api/auth/address";
const urlDeleteEndereco = "https://api-go-wash-efc9c9582687.herokuapp.com/api/auth/address/";
const form = document.querySelector('.formEndereco');

const retornoEndereco = [];
const retornoDadosUser = [];
window.addEventListener('load', async function() {
  let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLWdvLXdhc2gtZWZjOWM5NTgyNjg3Lmhlcm9rdWFwcC5jb20vYXBpL2xvZ2luIiwiaWF0IjoxNzExMTQyMTQyLCJuYmYiOjE3MTExNDIxNDIsImp0aSI6Ijl0SUt3UU9qWXc2UmU3alYiLCJzdWIiOiIyNzgiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.GfYSJh-61RgF2ADRt6APi8-T3jXZyYriOfsuWoO0Mlg"
    await getEndereco(token);
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

async function getDadosUser(token){
  
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
          console.log(data);
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
        console.log(item)
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
