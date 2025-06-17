export async function carregar(caminhoDoComponente, elementoPai) {
  try {
    const resposta = await fetch(caminhoDoComponente);
    
    if (!resposta.ok) {
      throw new Error(`Erro ao carregar ${caminhoDoComponente}: ${resposta.status}`);
    }
    
    const htmlDoComponente = await resposta.text();
    elementoPai.insertAdjacentHTML('beforeend', htmlDoComponente);
  } catch (error) {
    console.error('Erro ao carregar componente:', error);
    throw error;
  }
}

/*
=> insertAdjacentHTML(posicao, html):
   * Insere html no DOM na posição informada, sem substituir o conteúdo original.

=> As 4 posições possíveis:
   * "beforebegin": antes do próprio elemento.
   * "afterbegin": logo após a abertura da tag do elemento (como primeiro filho).
   * "beforeend": logo antes do fechamento da tag do elemento (como último filho).
   * "afterend": depois do próprio elemento.
*/
