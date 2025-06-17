import { carregar } from "../carregar.js";
import { componenteFormulario } from "./formulario/formulario.js";
import { componenteSaida } from "./saida/saida.js";
import { componenteOperacoes } from "./operacoes/operacoes.js";

export async function componenteCorpo() {
  try {
    const corpo = document.querySelector('#corpo');
    await carregar('./js/componentes/corpo/corpo.html', corpo);

    await componenteFormulario();
    await componenteOperacoes();
    await componenteSaida();
  } catch (error) {
    console.error('Erro ao carregar corpo:', error);
    throw error;
  }
}
