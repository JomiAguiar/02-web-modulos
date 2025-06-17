import { carregar } from "../carregar.js";

export async function componenteRodape() {
  try {
    const rodape = document.querySelector('#rodape');
    await carregar('./js/componentes/rodape/rodape.html', rodape);
  } catch (error) {
    console.error('Erro ao carregar rodapé:', error);
    throw error;
  }
}
