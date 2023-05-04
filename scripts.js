
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/processos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.processos.forEach(item => insertList(item.registro, item.processo, item.uf))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const getFaseList = async (registro) => {
  let url = 'http://127.0.0.1:5000/fase?registro=' + registro.replace(/[/]/g, '%2F');
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.fases.forEach(item => insertListFase(item.registro, item.fase))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (registro, processo, uf) => {
  const formData = new FormData();
  formData.append('registro', registro);
  formData.append('processo', processo);
  formData.append('uf', uf);

  let url = 'http://127.0.0.1:5000/processo';
  fetch(url, {
    method: 'post',
    body: formData
  })
  .then((response) => {
    insertList(registro, processo, uf);
    return response.json();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

const postFaseItem = async (registro, fase) => {
  const formData = new FormData();
  formData.append('registro', registro);
  formData.append('fase', fase);

  let url = 'http://127.0.0.1:5000/fase';
  fetch(url, {
    method: 'post',
    body: formData
  })
  .then((response) => {
    insertListFase(registro, fase);
    return response.json();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

const insertFaseButton = (parent, registro) => {
  let button = document.createElement("button");
  button.setAttribute('class', 'btn btn-link fases');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#novaFase');
  button.setAttribute('data-bs-registro', registro);
  button.innerHTML = registro;

  button.onclick = function () {
    const novaFaseModal = document.getElementById('novaFase');
    if (novaFaseModal) {
      const modalBodyInput = novaFaseModal.querySelector('.modal-body input#registro');

      modalBodyInput.value = registro;

      getFaseList(registro);
    }
  }

  parent.appendChild(button);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const registro = div.getElementsByTagName('td')[0].getElementsByTagName('button')[0].innerHTML;
      if (confirm("Você tem certeza?")) {
        div.remove();
        deleteItem(registro);
        alert("Removido!");
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/processo?registro=' + item;
  fetch(url, {
    method: 'delete'
  })
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const salvarProcesso = () => {
  var modal = document.getElementById('novoProcesso');
  let inputRegistro = modal.querySelector("#registro").value;
  let inputProcesso = modal.querySelector("#processo").value;
  let inputUf = modal.querySelector("#uf").value;

  if (inputRegistro === '') {
    alert("Escreva o registro de um item!");
  } else if (inputProcesso === '' || inputUf === '') {
    alert("Proceso e UF não podem ser vazios!");
  }else {
    postItem(inputRegistro, inputProcesso, inputUf)
    inputRegistro.value  = '';
    inputProcesso.value  = '';
    inputUf.value  = '';
    alert("Item adicionado!");
    $('#novoProcesso').modal('hide');
  }
}

const salvarFase = () => {
  var modal = document.getElementById('novaFase');
  let inputRegistro = modal.querySelector("#registro").value;
  let inputFase = modal.querySelector("#fase").value;

  if (inputFase === '' ) {
    alert("Fase não pode ser vazio!");
  }else {
    postFaseItem(inputRegistro, inputFase)
    inputRegistro.value = '';
    inputFase.value  = '';
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (registro, processo, uf) => {
  var item = [registro, processo, uf]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  insertFaseButton(row.insertCell(0), registro);
  for (var i = 1; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))

  removeElement()
}

const insertListFase = (registro, fase) => {
  var item = [registro, fase]
  var table = document.getElementById('tableFases').getElementsByTagName('tbody')[0];
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
}

$('#novaFase').on('hide.bs.modal', function(){
  $("#novaFase tbody tr").remove();
  $("#novaFase input").val("");
  $("#novaFase textarea").val("");
  $("#novoProcesso input").val("");
});