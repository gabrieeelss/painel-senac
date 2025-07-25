// Utilitários para Local Storage
function getMural() {
    return JSON.parse(localStorage.getItem('mural')) || [];
}

function setMural(mural) {
    localStorage.setItem('mural', JSON.stringify(mural));
}

// Exibe todos os cards
function mostrarCards() {
    const mural = getMural();
    exibirCards(mural);
}

// Exibe cards filtrados
function exibirCards(mural, categoriaSelecionada = "") {
    const cardsContainer = document.querySelector(".cards");
    cardsContainer.innerHTML = "";

    if (mural.length === 0) {
        // Verifica se o usuário filtrou por categoria
        if (categoriaSelecionada && getMural().length > 0) {
            cardsContainer.innerHTML = `
                <div class="text-center mt-5">
                    <img src="img/empty.png" alt="Nenhum anúncio" style="max-width:150px;opacity:0.7;">
                    <p class="mt-3 fs-5">Nenhum anúncio encontrado para a categoria selecionada.</p>
                </div>
            `;
        } else {
            cardsContainer.innerHTML = `
                <div class="text-center mt-5">
                    <img src="img/empty.png" alt="Nenhum anúncio" style="max-width:150px;opacity:0.7;">
                    <p class="mt-3 fs-5">Nenhum anúncio cadastrado ainda.</p>
                </div>
            `;
        }
        return;
    }

    mural.forEach((item, idx) => {
        const numeroLimpo = (item.telefone || '').replace(/\D/g, '');
        const tipoClasseBtn = item.categoria === 'V' ? 'btn-vendo' : 'btn-ofereco';

        const card = `
            <div class="card m-2 d-flex flex-column justify-content-between" style="width: 18rem; height: 30rem;">
                <span class="categoria ${item.categoria === 'V' ? 'vendo' : 'ofereco'}">
                    ${item.categoria === 'V' ? 'Vendo' : 'Ofereço'}
                </span>
                <h3 class="card-title mt-2 text-center">${item.titulo}</h3>
                <p class="descricao-limitada">${item.descricao}</p>
                <p><strong>Nome:</strong> ${item.nome}</p>
                <p><strong>Email:</strong> ${item.email}</p>
                <p><strong>Telefone:</strong> ${item.telefone}</p>
                <div class="mt-auto">
                    <button class="btn btn-outline-primary w-100" onclick="abrirVisualizar(${idx})">Ver mais</button>
                </div>
            </div>
        `;
        cardsContainer.innerHTML += card;
    });
}

// Inserir novo anúncio
document.getElementById('formInserir').addEventListener('submit', function(e) {
    e.preventDefault();
    const mural = getMural();

    const novo = {
        categoria: document.getElementById('categoria').value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value
    };

    mural.push(novo);
    setMural(mural);

    exibirAlerta("Anúncio inserido com sucesso!", "sucesso");
    this.reset();
    mostrarCards();

    // Fechar modal Bootstrap se estiver usando
    if (typeof bootstrap !== "undefined") {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalInserir'));
        if (modal) modal.hide();
    }
});

// Filtrar anúncios
document.getElementById("formFiltrar").addEventListener("submit", function (e) {
    e.preventDefault();

    const categoria = document.getElementById("filtroCategoria").value;
    let mural = getMural();

    if (categoria) {
        mural = mural.filter(item => item.categoria === categoria);
    }

    exibirCards(mural, categoria);

    // Fecha o modal de filtro (Bootstrap)
    if (typeof bootstrap !== "undefined") {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalFiltrar'));
        if (modal) modal.hide();
    }

    document.getElementById("alertaFiltro").style.display = "block";
    setTimeout(() => {
        document.getElementById("alertaFiltro").style.display = "none";
    }, 2000);
});

// Visualizar anúncio
async function abrirVisualizar(idx) {
    const mural = getMural();
    const item = mural[idx];
    if (!item) return;

    document.getElementById("visualizarTitulo").textContent = item.titulo;
    document.getElementById("visualizarDescricao").textContent = item.descricao;
    document.getElementById("visualizarNome").textContent = item.nome;
    document.getElementById("visualizarEmail").textContent = item.email;
    document.getElementById("visualizarTelefone").textContent = item.telefone;

    const numeroLimpo = (item.telefone ?? '').replace(/\D/g, '');   

    document.getElementById("modalVisualizar").style.display = "block";

    if (typeof bootstrap !== "undefined") {
        const modal = new bootstrap.Modal(document.getElementById('modalVisualizar'));
        modal.show();
    }
}

function fecharVisualizar() {
    document.getElementById("modalVisualizar").style.display = "none";

    if (typeof bootstrap !== "undefined") {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalVisualizar'));
        if (modal) modal.hide();
    }
}

// Utilitário de alerta
function exibirAlerta(mensagem, tipo = 'sucesso') {
    const alerta = document.getElementById("alerta");
    alerta.className = `alerta ${tipo}`;
    alerta.textContent = mensagem;
    alerta.style.display = 'block';
    setTimeout(() => {
        alerta.style.display = 'none';
    }, 3000);
}

// Máscara telefone
function aplicarMascaraTelefone(input) {
    input.addEventListener("input", function () {
        let valor = input.value.replace(/\D/g, "");
        if (valor.length > 11) valor = valor.slice(0, 11);
        if (valor.length > 0) {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
        }
        input.value = valor.trim();
    });
}

// Inicialização
window.onload = function () {
    exibirCards(getMural());
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) aplicarMascaraTelefone(telefoneInput);
};
