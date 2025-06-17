import { carregar } from "../../../carregar.js";

function validarCampoNome(nome) {
    let mensagem = document.querySelector('#mensagemErroNome');

    if (nome.value.trim().length < 2) {
        nome.classList.add('invalido');
        mensagem.innerHTML = "Nome deve ter pelo menos 2 caracteres.";
        return false;
    } else {
        nome.classList.remove('invalido');
        mensagem.innerHTML = "";
        return true;
    }
}

export async function componenteNome() {
    try {
        const formulario = document.querySelector('#formulario');
        await carregar('./js/componentes/corpo/formulario/nome/nome.html', formulario);

        const nome = formulario.querySelector('#nome');
        nome.addEventListener('blur', (event) => validarCampoNome(event.target));
        
        // Expor função de validação para uso externo
        nome.validar = () => validarCampoNome(nome);
    } catch (error) {
        console.error('Erro ao carregar componente nome:', error);
        throw error;
    }
}
