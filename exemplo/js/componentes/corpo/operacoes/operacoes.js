import { carregar } from "../../carregar.js";
import { listarUsuarios, buscarUsuarioPorId, atualizarUsuario, deletarUsuario, imprimeObjetoJson, imprimeListaUsuarios } from "../../../api/crud.js";

function criarModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modal-title">Título</h3>
            </div>
            <div class="modal-body" id="modal-body">
                Conteúdo
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="modal-cancel">Cancelar</button>
                <button type="button" class="btn btn-primary" id="modal-confirm">Confirmar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });
    
    // Botão cancelar
    modal.querySelector('#modal-cancel').addEventListener('click', fecharModal);
    
    return modal;
}

function mostrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function fecharModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function mostrarResultado(conteudo, tipo = 'info') {
    const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
    const alertClass = tipo === 'error' ? 'alert-error' : tipo === 'success' ? 'alert-success' : 'alert-info';
    
    corpoPainelDeSaida.innerHTML = `
        <div class="alert ${alertClass} fade-in">
            ${conteudo}
        </div>
    `;
}

function mostrarLoading() {
    const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
    corpoPainelDeSaida.innerHTML = `
        <div class="alert alert-info fade-in">
            <span class="spinner"></span> Carregando...
        </div>
    `;
}

async function handleListarUsuarios() {
    try {
        mostrarLoading();
        const usuarios = await listarUsuarios();
        
        const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
        
        if (usuarios.length === 0) {
            corpoPainelDeSaida.innerHTML = `
                <div class="alert alert-info fade-in">
                    <i class="fas fa-info-circle"></i>
                    Nenhum usuário encontrado.
                </div>
            `;
        } else {
            corpoPainelDeSaida.innerHTML = `
                <div class="alert alert-success fade-in">
                    <i class="fas fa-check-circle"></i>
                    ${usuarios.length} usuário(s) encontrado(s)
                </div>
                ${imprimeListaUsuarios(usuarios)}
            `;
            
            // Adicionar event listeners para botões de ação
            adicionarEventListenersUsuarios();
        }
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        mostrarResultado(`<i class="fas fa-exclamation-triangle"></i> Erro ao listar usuários: ${error.message}`, 'error');
    }
}

async function handleBuscarPorId() {
    const modal = criarModal();
    
    modal.querySelector('#modal-title').textContent = 'Buscar Usuário por ID';
    modal.querySelector('#modal-body').innerHTML = `
        <div class="form-group">
            <label for="buscar-id" class="form-label">ID do Usuário:</label>
            <input type="number" id="buscar-id" class="form-input" placeholder="Digite o ID" min="1" />
        </div>
    `;
    
    const confirmBtn = modal.querySelector('#modal-confirm');
    confirmBtn.textContent = 'Buscar';
    
    confirmBtn.addEventListener('click', async () => {
        const id = modal.querySelector('#buscar-id').value;
        
        if (!id) {
            modal.querySelector('#buscar-id').classList.add('invalid');
            return;
        }
        
        try {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<span class="spinner"></span> Buscando...';
            
            fecharModal();
            mostrarLoading();
            
            const usuario = await buscarUsuarioPorId(id);
            
            const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
            corpoPainelDeSaida.innerHTML = `
                <div class="alert alert-success fade-in">
                    <i class="fas fa-check-circle"></i>
                    Usuário encontrado
                </div>
                <div class="card fade-in" style="margin-top: 1rem;">
                    <div class="card-body">
                        ${imprimeObjetoJson(usuario)}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            mostrarResultado(`<i class="fas fa-exclamation-triangle"></i> Usuário não encontrado ou erro no servidor`, 'error');
        }
    });
    
    mostrarModal();
    modal.querySelector('#buscar-id').focus();
}

async function handleAtualizarUsuario(id) {
    try {
        // Primeiro buscar os dados atuais
        const usuarioAtual = await buscarUsuarioPorId(id);
        
        const modal = criarModal();
        
        modal.querySelector('#modal-title').textContent = `Atualizar Usuário #${id}`;
        modal.querySelector('#modal-body').innerHTML = `
            <div class="form-group">
                <label for="update-nome" class="form-label">Nome:</label>
                <input type="text" id="update-nome" class="form-input" value="${usuarioAtual.nome}" />
            </div>
            <div class="form-group">
                <label for="update-nascimento" class="form-label">Data de Nascimento:</label>
                <input type="text" id="update-nascimento" class="form-input" value="${usuarioAtual.nascimento}" maxlength="10" />
            </div>
            <div class="form-group">
                <label for="update-email" class="form-label">E-mail:</label>
                <input type="email" id="update-email" class="form-input" value="${usuarioAtual.email}" />
            </div>
        `;
        
        const confirmBtn = modal.querySelector('#modal-confirm');
        confirmBtn.textContent = 'Atualizar';
        confirmBtn.classList.remove('btn-primary');
        confirmBtn.classList.add('btn-success');
        
        // Adicionar máscara de data
        const inputNascimento = modal.querySelector('#update-nascimento');
        inputNascimento.addEventListener('keydown', (evento) => {
            const input = evento.target;
            if (evento.key === 'Backspace' || evento.key === 'Delete') return;
            if (input.value.length === 10) evento.preventDefault();
            if (evento.key < '0' || evento.key > '9') evento.preventDefault();
            if ((input.value.length === 2) || (input.value.length === 5)) {
                input.value += '/';
            }
        });
        
        confirmBtn.addEventListener('click', async () => {
            const dadosAtualizados = {
                nome: modal.querySelector('#update-nome').value.trim(),
                nascimento: modal.querySelector('#update-nascimento').value.trim(),
                email: modal.querySelector('#update-email').value.trim()
            };
            
            // Validação básica
            if (!dadosAtualizados.nome || !dadosAtualizados.nascimento || !dadosAtualizados.email) {
                mostrarResultado('<i class="fas fa-exclamation-triangle"></i> Todos os campos são obrigatórios', 'error');
                return;
            }
            
            try {
                confirmBtn.disabled = true;
                confirmBtn.innerHTML = '<span class="spinner"></span> Atualizando...';
                
                const usuarioAtualizado = await atualizarUsuario(id, dadosAtualizados);
                
                fecharModal();
                
                const corpoPainelDeSaida = document.getElementById("corpoPainelDeSaida");
                corpoPainelDeSaida.innerHTML = `
                    <div class="alert alert-success fade-in">
                        <i class="fas fa-check-circle"></i>
                        Usuário atualizado com sucesso!
                    </div>
                    <div class="card fade-in" style="margin-top: 1rem;">
                        <div class="card-body">
                            ${imprimeObjetoJson(usuarioAtualizado)}
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                mostrarResultado(`<i class="fas fa-exclamation-triangle"></i> Erro ao atualizar usuário: ${error.message}`, 'error');
            }
        });
        
        mostrarModal();
        modal.querySelector('#update-nome').focus();
        
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        mostrarResultado(`<i class="fas fa-exclamation-triangle"></i> Erro ao carregar dados do usuário`, 'error');
    }
}

async function handleDeletarUsuario(id) {
    try {
        // Primeiro buscar os dados do usuário
        const usuario = await buscarUsuarioPorId(id);
        
        const modal = criarModal();
        
        modal.querySelector('#modal-title').textContent = 'Confirmar Exclusão';
        modal.querySelector('#modal-body').innerHTML = `
            <p>Tem certeza que deseja excluir o usuário:</p>
            <div class="card" style="margin: 1rem 0;">
                <div class="card-body">
                    <strong>${usuario.nome}</strong><br>
                    ${usuario.email}<br>
                    Nascimento: ${usuario.nascimento}
                </div>
            </div>
            <p style="color: var(--error-color); font-weight: 500;">
                <i class="fas fa-exclamation-triangle"></i>
                Esta ação não pode ser desfeita!
            </p>
        `;
        
        const confirmBtn = modal.querySelector('#modal-confirm');
        confirmBtn.textContent = 'Excluir';
        confirmBtn.classList.remove('btn-primary');
        confirmBtn.classList.add('btn-danger');
        
        confirmBtn.addEventListener('click', async () => {
            try {
                confirmBtn.disabled = true;
                confirmBtn.innerHTML = '<span class="spinner"></span> Excluindo...';
                
                await deletarUsuario(id);
                
                fecharModal();
                
                mostrarResultado(`<i class="fas fa-check-circle"></i> Usuário #${id} excluído com sucesso!`, 'success');
            } catch (error) {
                console.error('Erro ao deletar usuário:', error);
                mostrarResultado(`<i class="fas fa-exclamation-triangle"></i> Erro ao excluir usuário: ${error.message}`, 'error');
            }
        });
        
        mostrarModal();
        
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        mostrarResultado(`<i class="fas fa-exclamation-triangle"></i> Usuário não encontrado`, 'error');
    }
}

function adicionarEventListenersUsuarios() {
    // Botões de editar
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-edit').dataset.id;
            handleAtualizarUsuario(id);
        });
    });
    
    // Botões de deletar
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-delete').dataset.id;
            handleDeletarUsuario(id);
        });
    });
}

export async function componenteOperacoes() {
    try {
        const painelDireito = document.querySelector('#painelDireito');
        await carregar('./js/componentes/corpo/operacoes/operacoes.html', painelDireito);
        
        // Adicionar event listeners
        document.getElementById('btn-listar').addEventListener('click', handleListarUsuarios);
        document.getElementById('btn-buscar').addEventListener('click', handleBuscarPorId);
    } catch (error) {
        console.error('Erro ao carregar componente operações:', error);
        throw error;
    }
}
