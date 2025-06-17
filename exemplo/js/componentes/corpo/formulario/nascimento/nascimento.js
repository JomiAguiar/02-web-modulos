import { carregar } from "../../../carregar.js";

function comportamentoDataNascimento(evento) {
  const input = evento.target;

  // Permitir apagar com as teclas Backspace e Delete.
  if (evento.key === 'Backspace' || evento.key === 'Delete') {
    return; // deixa seguir normalmente.
  }

  // Impedir que sejam digitados mais de 10 caracteres (dd/mm/yyyy).
  if (input.value.length === 10) {
    evento.preventDefault(); // BLOQUEIA as teclas.
    return;
  }

  /* Verificar se a tecla pressionada está entre '0' e '9'.
     Bloquear se não for número.
  */
  if (evento.key < '0' || evento.key > '9') {
    evento.preventDefault(); // BLOQUEIA as teclas.
    return;
  }

  /* Quando o usuário digitar dois dígitos (dd), ou 
     dois mais dois (dd/mm), o código insere automaticamente
     a barra. Isso constrói a máscara da data conforme a 
     pessoa digita. Adiciona a barra automaticamente em dd/mm/yyyy.
  */
  if ((input.value.length === 2) || (input.value.length === 5)) {
    input.value += '/';
  }
}

function validarDataNascimento(input) {
  const valor = input.value;
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  
  if (!regex.test(valor)) {
    return false;
  }
  
  const [, dia, mes, ano] = valor.match(regex);
  const data = new Date(ano, mes - 1, dia);
  
  // Verificar se a data é válida e não é futura
  const hoje = new Date();
  return data.getDate() == dia && 
         data.getMonth() == mes - 1 && 
         data.getFullYear() == ano &&
         data <= hoje;
}

export async function componenteNascimento() {
  try {
    const formulario = document.querySelector('#formulario');
    await carregar('./js/componentes/corpo/formulario/nascimento/nascimento.html', formulario);

    const nascimento = formulario.querySelector('#nascimento');

    nascimento.addEventListener('keydown', (event) => comportamentoDataNascimento(event));
    
    // Expor função de validação para uso externo
    nascimento.validar = () => {
      const isValid = validarDataNascimento(nascimento);
      if (!isValid) {
        nascimento.classList.add('invalido');
      } else {
        nascimento.classList.remove('invalido');
      }
      return isValid;
    };
  } catch (error) {
    console.error('Erro ao carregar componente nascimento:', error);
    throw error;
  }
}
