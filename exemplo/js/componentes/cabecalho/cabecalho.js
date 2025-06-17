import { carregar } from "../carregar.js";

export async function componenteCabecalho() {
  try {
    const cabecalho = document.querySelector('#cabecalho');
    await carregar('./js/componentes/cabecalho/cabecalho.html', cabecalho);
  } catch (error) {
    console.error('Erro ao carregar cabeçalho:', error);
    throw error;
  }
}
