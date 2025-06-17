import { carregar } from "../../carregar.js";

export async function componenteSaida() {
    try {
        const painelDireito = document.querySelector('#painelDireito');
        await carregar('./js/componentes/corpo/saida/saida.html', painelDireito);
    } catch (error) {
        console.error('Erro ao carregar componente saída:', error);
        throw error;
    }
}
