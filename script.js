const form = document.getElementById('serviceForm');
const cardsContainer = document.getElementById('cardsContainer');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

// Carrega dados do JSON e exibe os cards ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(service => {
        createCard(service.name, service.contact, service.type, service.description);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar data.json:', err);
    });
});

// Lida com envio do formulário
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    alert("Por favor, confirme o reCAPTCHA.");
    return;
  }

  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value.trim();

  createCard(name, contact, type, description);

  form.reset();
  grecaptcha.reset();
});

// Cria e exibe um card com os dados passados
function createCard(name, contact, type, description) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>${name}</h3>
    <p><strong>Serviço:</strong> ${type}</p>
    <p><strong>Contato:</strong> ${contact}</p>
  `;

  card.addEventListener('click', () => {
    modalContent.innerHTML = `
      <h2>${name}</h2>
      <p><strong>Contato:</strong> ${contact}</p>
      <p><strong>Serviço:</strong> ${type}</p>
      <p><strong>Descrição:</strong><br>${description}</p>
    `;
    modal.style.display = 'flex';
  });

  cardsContainer.appendChild(card);
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function (event) {
  if (event.target === modal) {
    closeModal();
  }
}
