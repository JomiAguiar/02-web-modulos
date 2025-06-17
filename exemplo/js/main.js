import { componenteCabecalho } from "./cabecalho/cabecalho.js";
import { componenteCorpo } from "./corpo/corpo.js";
import { componenteRodape } from "./rodape/rodape.js";

export async function carregarComponentes() {
    try {
        await componenteCabecalho();
        await componenteCorpo();
        await componenteRodape();
    } catch (error) {
        console.error('Erro ao carregar componentes:', error);
        throw error;
    }
}
