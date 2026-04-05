// ELEMENTOS DA TELA
const listaCarrinho = document.querySelector("#lista-carrinho");
const totalCarrinho = document.querySelector("#total-carrinho");

// COMO SEU BOTÃO NÃO TEM ID, PEGUEI ASSIM:
const botaoFinalizar = document.getElementById("finalizar-pedido");

// PUXA O CARRINHO DO LOCALSTORAGE
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// FUNÇÃO PARA REMOVER ITEM
function removerItem(index) {
  const item = carrinho[index];

  if (item.quantidade > 1) {
    item.quantidade--;
  } else {
    carrinho.splice(index, 1);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
}

// RENDERIZA O CARRINHO
function renderizarCarrinho() {
  listaCarrinho.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");

    const quantidade = item.quantidade || 1;

    li.innerText = `${item.nome} - ${quantidade} Und - R$ ${(item.preco * quantidade).toFixed(2)}`;

    const botaoRemover = document.createElement("button");
    botaoRemover.innerText = "Remover";

    botaoRemover.addEventListener("click", () => {
      removerItem(index);
    });

    li.appendChild(botaoRemover);
    listaCarrinho.appendChild(li);

    total += item.preco * quantidade;
  });

  totalCarrinho.innerText = `Total: R$ ${total.toFixed(2)}`;
}

// EXECUTA AO ABRIR
renderizarCarrinho();

// FINALIZAR PEDIDO
if (botaoFinalizar) {
  botaoFinalizar.addEventListener("click", () => {

    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const pagamento = document.getElementById("pagamento").value;

    // VALIDAÇÃO
    if (!nome || !endereco || !telefone || !pagamento) {
      alert("Preencha todos os campos!");
      return;
    }

    if (carrinho.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    // ITENS
    const itens = carrinho.map(item => {
      const quantidade = item.quantidade || 1;
      return `• ${item.nome} - ${quantidade} Und - R$ ${(item.preco * quantidade).toFixed(2)}`;
    }).join("\n");

    // TOTAL
    const total = carrinho.reduce((acc, item) => {
      const quantidade = item.quantidade || 1;
      return acc + item.preco * quantidade;
    }, 0);

    // MENSAGEM
    const mensagem = `
*Pedido - Hortifruti Web*

Cliente: ${nome}
Endereço: ${endereco}
Telefone: ${telefone}
Pagamento: ${pagamento}

*Itens do Pedido:*
${itens}

*Total:* R$ ${total.toFixed(2)}

Obrigado pela preferência!
`;

    const numero = "5582998361860";

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    // LIMPA CARRINHO
    carrinho = [];
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
  });
}