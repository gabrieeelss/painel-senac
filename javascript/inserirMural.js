
function abrirInserir() {
    document.getElementById("modalInserir").style.display = "block";
}

function fecharInserir() {
    document.getElementById("modalInserir").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formInserir");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const mensagem = document.getElementById('alerta'); 

            console.log(formData)

            fetch('controller/inserirMural.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    mensagem.innerText = data.message;
                    mensagem.classList.remove('alerta-sucesso', 'alerta-erro');
                    mensagem.classList.add(data.success ? 'alerta-sucesso' : 'alerta-erro');
                    mensagem.style.display = 'block';

                    setTimeout(() => {
                        mensagem.style.display = 'none';
                        if (data.success) {
                            fecharInserir(); 
                            location.reload(); 
                        }
                    }, 3000);
                })
                .catch(error => {
                    mensagem.innerText = 'Erro ao inserir.';
                    mensagem.classList.remove('alerta-sucesso', 'alerta-erro');
                    mensagem.classList.add('alerta-erro');
                    mensagem.style.display = 'block';

                    setTimeout(() => mensagem.style.display = 'none', 3000);
                    console.error('Erro:', error);
                });
        });
    }
});
