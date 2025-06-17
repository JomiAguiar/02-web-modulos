import { carregar } from "../../../carregar.js";
import { criarUsuario, imprimeObjetoJson } from "../../../../api/crud.js";

function lerDadosFormulario() {
  const nome = document.getElementById("nome").value.trim();
  const nascimento = document.getElementById("nascimento").value.trim();
  const email = document.getElementById("email").value.trim();

  return { nome, nascimento, email };
}

function limparDadosFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("nascimento").value = "";
  document.getElementById("email").value = "";
  
  // Remove classes de erro
  document.getElementById("nome").classList.remove('invalido');
  document.getElementById("nascimento").classList.remove('invalido');
  document.getElementById("email").classList.remove('invalido');
  
  // Limpa mensagens de erro
  const mensagemErro = document.getElementById("mensagemErroNome");
  if (mensagemErro) {
    mensagemErro.innerHTML = "";
  }
}

function validarFormularioCompleto() {
  const nome = document.getElementById("nome");
  const nascimento = document.getElementById("nascimento");
  const email = document.getElementById("email");
  
  let isValid = true;
  let errors = [];
  
  // Validar nome
  if (!nome.validar || !nome.validar()) {
    errors.push("Nome inválido");
    isValid = false;
  }
  
  // Validar nascimento
  if (!nascimento.validar || !nascimento.validar()) {
    errors.push("Data de nascimento inválida");
    isValid = false;
  }
  
  // Validar email
  if (!email.validar || !email.validar()) {
    errors.push("E-mail inválido");
    isValid = false;
  }
  
  // Verificar se todos os campos estão preenchidos
  if (!nome.value.trim() || !nascimento.value.trim() || !email.value.trim()) {
    errors.push("Todos os campos são obrigatórios");
    isValid = false;
  }
  
  return { isValid, errors };
}

function mostrarErros(errors) {
  const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
  corpoPainelDeSaida.innerHTML = `
    <div class="alert alert-error fade-in">
      <strong>Erro na validação:</strong>
      <ul style="margin: 0.5rem 0 0 1rem;">
        ${errors.map(error => `<li>${error}</li>`).join('')}
      </ul>
    </div>
  `;
}

function mostrarSucesso(dados) {
  const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
  corpoPainelDeSaida.innerHTML = `
    <div class="alert alert-success fade-in">
      <strong>Usuário criado com sucesso!</strong>
    </div>
    <div class="card fade-in" style="margin-top: 1rem;">
      <div class="card-body">
        ${imprimeObjetoJson(dados)}
      </div>
    </div>
  `;
}

function mostrarErroServidor(error) {
  const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
  corpoPainelDeSaida.innerHTML = `
    <div class="alert alert-error fade-in">
      <strong>Erro no servidor:</strong><br>
      ${error.message || 'Erro desconhecido'}
    </div>
  `;
}

export async function componenteBotao() {
  try {
    const formulario = document.querySelector('#formulario');
    await carregar('./js/componentes/corpo/formulario/botao/botao.html', formulario);

    const botao = formulario.querySelector('button');
    
    botao.addEventListener('click', async (event) => {
      event.preventDefault();

      // Validar formulário
      const validacao = validarFormularioCompleto();
      
      if (!validacao.isValid) {
        mostrarErros(validacao.errors);
        return;
      }

      // Desabilitar botão durante envio
      botao.disabled = true;
      botao.innerHTML = '<span class="spinner"></span> Enviando...';

      try {
        const dados = lerDadosFormulario();
        const resultado = await criarUsuario(dados);
        
        mostrarSucesso(resultado);
        limparDadosFormulario();
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
        mostrarErroServidor(error);
      } finally {
        // Reabilitar botão
        botao.disabled = false;
        botao.innerHTML = '<i class="fas fa-paper-plane"></i> Cadastrar';
      }
    });
  } catch (error) {
    console.error('Erro ao carregar componente botão:', error);
    throw error;
  }
}
