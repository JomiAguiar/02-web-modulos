// Configuração da API
const API_BASE_URL = 'https://01c72ea2-dc83-4f76-b4e6-f998346028e2-00-1fmk7t8gu8uk4.picard.replit.dev';
const USUARIOS_ENDPOINT = `${API_BASE_URL}/usuarios`;

// Função auxiliar para fazer requisições
async function fazerRequisicao(url, opcoes = {}) {
    const opcoesDefault = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };
    
    const opcoesFinais = {
        ...opcoesDefault,
        ...opcoes,
        headers: {
            ...opcoesDefault.headers,
            ...opcoes.headers
        }
    };
    
    try {
        const resposta = await fetch(url, opcoesFinais);
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status} - ${resposta.statusText}`);
        }
        
        return await resposta.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// CREATE - Criar usuário
export async function criarUsuario(dados) {
    return await fazerRequisicao(USUARIOS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(dados)
    });
}

// READ - Listar todos os usuários
export async function listarUsuarios() {
    return await fazerRequisicao(USUARIOS_ENDPOINT);
}

// READ - Buscar usuário por ID
export async function buscarUsuarioPorId(id) {
    return await fazerRequisicao(`${USUARIOS_ENDPOINT}/${id}`);
}

// UPDATE - Atualizar usuário
export async function atualizarUsuario(id, dados) {
    return await fazerRequisicao(`${USUARIOS_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados)
    });
}

// DELETE - Deletar usuário
export async function deletarUsuario(id) {
    return await fazerRequisicao(`${USUARIOS_ENDPOINT}/${id}`, {
        method: 'DELETE'
    });
}

// Função para imprimir objeto JSON (mantida para compatibilidade)
export function imprimeObjetoJson(objetoJson) {
    return `
        <div class="usuario-info">
            <div><strong>ID:</strong> ${objetoJson.id}</div>
            <div><strong>Nome:</strong> ${objetoJson.nome}</div>
            <div><strong>Nascimento:</strong> ${objetoJson.nascimento}</div>
            <div><strong>E-mail:</strong> ${objetoJson.email}</div>
        </div>
    `;
}

// Função para imprimir lista de usuários
export function imprimeListaUsuarios(usuarios) {
    return usuarios.map(usuario => `
        <div class="usuario-item fade-in">
            <div class="usuario-header">
                <span class="usuario-id">ID: ${usuario.id}</span>
                <div class="usuario-actions">
                    <button class="btn btn-sm btn-secondary btn-edit" data-id="${usuario.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete" data-id="${usuario.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${imprimeObjetoJson(usuario)}
        </div>
    `).join('');
}
