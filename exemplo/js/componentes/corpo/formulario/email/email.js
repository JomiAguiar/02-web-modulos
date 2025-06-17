import { carregar } from "../../../carregar.js";

function validarEmail(input) {
  const valor = input.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(valor);
}

export async function componenteEmail() {
  try {
    const formulario = document.querySelector('#formulario');
    await carregar('./js/componentes/corpo/formulario/email/email.html', formulario);
    
    const email = formulario.querySelector('#email');
    
    // Expor função de validação para uso externo
    email.validar = () => {
      const isValid = validarEmail(email);
      if (!isValid) {
        email.classList.add('invalido');
      } else {
        email.classList.remove('invalido');
      }
      return isValid;
    };
  } catch (error) {
    console.error('Erro ao carregar componente email:', error);
    throw error;
  }
}
