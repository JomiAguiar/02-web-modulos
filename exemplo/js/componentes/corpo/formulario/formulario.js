import { carregar } from "../../carregar.js";
import { componenteNome } from "./nome/nome.js";
import { componenteNascimento } from "./nascimento/nascimento.js";
import { componenteEmail } from "./email/email.js";
import { componenteBotao } from "./botao/botao.js";

async function carregarCampos() {
    try {
        await componenteNome();
        await componenteNascimento();
        await componenteEmail();
        await componenteBotao();
    } catch (error) {
        console.error('Erro ao carregar campos do formulário:', error);
        throw error;
    }
}

export async function componenteFormulario() {
    try {
        const painelEsquerdo = document.querySelector('#painelEsquerdo');
        await carregar('./js/componentes/corpo/formulario/formulario.html', painelEsquerdo);
        await carregarCampos();
    } catch (error) {
        console.error('Erro ao carregar formulário:', error);
        throw error;
    }
}
