// BOTÕES (UNIFICADOS)
const botoesAdicionar = document.querySelectorAll(".button-adicionar, .button-promo");

// ELEMENTOS (PODEM NÃO EXISTIR EM TODAS AS PÁGINAS)
const listaCarrinho = document.querySelector("#lista-carrinho");
const totalCarrinho = document.querySelector("#total-carrinho");
const quantidadeItens = document.querySelector("#quantidade-itens");
const botaoLimpar = document.querySelector("#limpar-carrinho");

// TOAST
function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.innerText = mensagem;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// RECUPERA O CARRINHO
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// LIMPAR CARRINHO
if (botaoLimpar) {
  botaoLimpar.addEventListener("click", () => {
    carrinho = [];
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
  });
}

// REMOVER ITEM
function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
}

// RENDERIZAR
function renderizarCarrinho() {
  if (!listaCarrinho || !totalCarrinho || !quantidadeItens) return;

  listaCarrinho.innerHTML = "";

  let total = 0;
  let totalItens = 0;

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
    totalItens += quantidade;
  });

  totalCarrinho.innerText = `Total: R$ ${total.toFixed(2)}`;
  quantidadeItens.innerText = `Itens: ${totalItens}`;
}

// ADICIONAR PRODUTO
botoesAdicionar.forEach(botao => {
  botao.addEventListener("click", (evento) => {

    const produto = evento.target.closest(".card");

    const nomeProduto = produto.querySelector(".nome-produto").innerText;

    // IDENTIFICA PREÇO (PROMO OU NORMAL)
    let precoTexto;

    const precoPromo = produto.querySelector(".preco-promo");
    const precoNormal = produto.querySelector(".valor");

    if (precoPromo) {
      precoTexto = precoPromo.innerText;
    } else if (precoNormal) {
      precoTexto = precoNormal.innerText;
    }

    const precoNumero = parseFloat(
      precoTexto.replace("R$", "").replace(",", ".")
    );

    // VERIFICA SE JÁ EXISTE
    const itemExistente = carrinho.find(p => p.nome === nomeProduto);

    if (itemExistente) {
      itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
    } else {
      carrinho.push({
        nome: nomeProduto,
        preco: precoNumero,
        quantidade: 1
      });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    renderizarCarrinho();

    mostrarToast("Produto adicionado ao carrinho!");
  });
});

// EXECUTA AO CARREGAR
renderizarCarrinho();