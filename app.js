document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const servico = document.getElementById('servico').value.trim();
      const detalhamento = document.getElementById('detalhamento').value.trim();
      const categoria = document.getElementById('categoria').value.trim();
      const anunciante = document.getElementById('anunciante').value.trim();
      const telefone = document.getElementById('telefone').value.trim();

      const novoServico = {
        servico,
        detalhamento,
        categoria,
        anunciante,
        telefone
      };

      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      servicos.push(novoServico);
      localStorage.setItem('servicos', JSON.stringify(servicos));

      alert("Serviço cadastrado com sucesso!");
      form.reset();
    });
  }

  const cardsContainer = document.getElementById('cardsContainer');
  const emptyMessage = document.getElementById('emptyMessage');
  const filtroSelect = document.getElementById('filtroCategoria');

  if (cardsContainer && filtroSelect) {
    const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');

    if (servicos.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    const categoriasUnicas = [...new Set(servicos.map(s => s.categoria))];
    categoriasUnicas.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      filtroSelect.appendChild(option);
    });

    function renderizarCards(categoriaSelecionada = 'todos') {
      cardsContainer.innerHTML = '';
      const filtrados = categoriaSelecionada === 'todos'
        ? servicos
        : servicos.filter(s => s.categoria === categoriaSelecionada);

      if (filtrados.length === 0) {
        emptyMessage.style.display = 'block';
        return;
      }

      emptyMessage.style.display = 'none';

      filtrados.forEach(servico => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <h3>${servico.servico}</h3>
          <p><strong>Detalhes:</strong> ${servico.detalhamento}</p>
          <p><strong>Categoria:</strong> ${servico.categoria}</p>
          <p><strong>Anunciante:</strong> ${servico.anunciante}</p>
          <p><strong>Telefone:</strong> ${servico.telefone}</p>
        `;

        cardsContainer.appendChild(card);
      });
    }

    filtroSelect.addEventListener('change', () => {
      renderizarCards(filtroSelect.value);
    });

    renderizarCards(); // Exibe todos ao carregar
  }
});
