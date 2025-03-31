
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

/**
 * Utilitário para exportar todo o código-fonte em um único arquivo
 * para facilitar a análise da arquitetura da aplicação
 */
export async function generateSourceCodeFile(): Promise<string> {
  let result = `# Código-fonte Consolidado - Marias Decorações
  
Este documento contém o código-fonte consolidado da aplicação Marias Decorações.
Seu objetivo é oferecer uma visão geral da arquitetura e estrutura do projeto.

Data de geração: ${new Date().toLocaleString('pt-BR')}

## Sumário de Conteúdo

`;

  // Diretórios a serem incluídos
  const directories = ['server', 'client/src', 'shared'];
  
  // Extensões de arquivos a serem incluídos
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'];
  
  // Arquivos a serem ignorados
  const ignoredFiles = ['node_modules', '.git', 'dist', '.vite'];
  
  let fileIndex = 1;
  
  // Para cada diretório, adicionar um sumário
  for (const dir of directories) {
    result += `### ${dir.toUpperCase()}\n\n`;
    
    // Obter arquivos de forma recursiva
    const files = await getFilesRecursively(dir, extensions, ignoredFiles);
    
    // Adicionar entradas do sumário
    for (const filePath of files) {
      const relativePath = filePath.replace(/\\/g, '/');
      result += `${fileIndex}. [${relativePath}](#${fileIndex})\n`;
      fileIndex++;
    }
    
    result += '\n';
  }
  
  result += `\n\n## Conteúdo dos Arquivos\n\n`;
  
  // Reiniciar índice para os arquivos
  fileIndex = 1;
  
  // Para cada diretório, adicionar o conteúdo de cada arquivo
  for (const dir of directories) {
    // Obter arquivos de forma recursiva
    const files = await getFilesRecursively(dir, extensions, ignoredFiles);
    
    // Processar cada arquivo
    for (const filePath of files) {
      const relativePath = filePath.replace(/\\/g, '/');
      const fileContent = await readFile(filePath, 'utf8');
      const fileExtension = path.extname(filePath).slice(1);
      
      result += `<a id="${fileIndex}"></a>\n`;
      result += `### ${fileIndex}. ${relativePath}\n\n`;
      
      // Adicionar comentário descritivo baseado no tipo de arquivo
      result += getFileDescription(relativePath);
      
      result += `\`\`\`${fileExtension}\n${fileContent}\n\`\`\`\n\n`;
      
      result += `---\n\n`;
      fileIndex++;
    }
  }
  
  // Adicionar seção de análise arquitetural
  result += `
## Análise Arquitetural

### Visão Geral da Arquitetura

A aplicação Marias Decorações segue uma arquitetura de três camadas:

1. **Frontend (client/src)**: Interface de usuário construída com React, utilizando componentes UI modernos e padrões de design responsivo.
2. **Backend (server)**: API RESTful construída com Express.js que gerencia a lógica de negócios e autenticação.
3. **Dados (shared)**: Schemas e interfaces compartilhadas entre frontend e backend.

### Padrões de Design Utilizados

1. **Component-Based Architecture**: A interface é construída com componentes reutilizáveis.
2. **State Management**: Gerenciamento de estado centralizado com contextos do React.
3. **RESTful API**: Endpoints organizados por recursos.
4. **Middleware Pattern**: Middleware para autenticação e validação.

### Fluxo de Dados

1. O usuário interage com a interface React.
2. As ações do usuário disparam chamadas à API.
3. O servidor processa requisições, aplica regras de negócio e acessa dados.
4. Respostas são devolvidas para atualizar a interface.
5. WebSockets são usados para notificações em tempo real.

### Considerações de Segurança

1. Autenticação baseada em tokens.
2. Validação de input com Zod.
3. Middleware de autorização para proteger rotas.
4. Controle de acesso baseado em papéis (RBAC).
`;
  
  return result;
}

/**
 * Obtém recursivamente todos os arquivos em um diretório que 
 * correspondem às extensões especificadas
 */
async function getFilesRecursively(
  directory: string, 
  extensions: string[], 
  ignoredFiles: string[]
): Promise<string[]> {
  const dirents = await readdir(directory, { withFileTypes: true });
  
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(directory, dirent.name);
      
      // Verificar se o arquivo deve ser ignorado
      if (ignoredFiles.some(ignored => res.includes(ignored))) {
        return [];
      }
      
      if (dirent.isDirectory()) {
        return getFilesRecursively(res, extensions, ignoredFiles);
      } else {
        // Verificar a extensão do arquivo
        const ext = path.extname(res);
        if (extensions.includes(ext)) {
          return res;
        }
        return [];
      }
    })
  );
  
  return files.flat();
}

/**
 * Gera uma descrição para cada arquivo baseado em seu caminho/nome
 */
function getFileDescription(filePath: string): string {
  // Componentes de UI
  if (filePath.includes('components/ui/')) {
    return `/**
 * Componente de UI reutilizável.
 * Este componente faz parte da biblioteca de UI da aplicação e é usado para
 * construir interfaces consistentes.
 */\n\n`;
  }
  
  // Componentes de layout
  if (filePath.includes('components/layouts/')) {
    return `/**
 * Componente de layout que estrutura a disposição dos elementos na página.
 * Define a organização visual geral das seções da aplicação.
 */\n\n`;
  }
  
  // Páginas
  if (filePath.includes('pages/')) {
    return `/**
 * Página da aplicação que representa uma rota completa.
 * Compõe componentes menores para formar uma interface funcional para o usuário.
 */\n\n`;
  }
  
  // Armazenamento/Store
  if (filePath.includes('store/')) {
    return `/**
 * Gerenciamento de estado global da aplicação.
 * Controla o estado compartilhado entre componentes e mantém a consistência dos dados.
 */\n\n`;
  }
  
  // Rotas da API
  if (filePath === 'server/routes.ts') {
    return `/**
 * Configuração das rotas da API do servidor.
 * Define os endpoints disponíveis, middleware de autenticação e lógica de controle.
 */\n\n`;
  }
  
  // Utilitários
  if (filePath.includes('lib/') || filePath.includes('utils')) {
    return `/**
 * Funções utilitárias reutilizáveis na aplicação.
 * Fornecem funcionalidades comuns que são usadas em diversos lugares do código.
 */\n\n`;
  }
  
  // Schemas
  if (filePath.includes('schema')) {
    return `/**
 * Definições de schemas e tipos compartilhados.
 * Estabelece a estrutura dos dados e validações usadas tanto no cliente quanto no servidor.
 */\n\n`;
  }
  
  // Valor padrão para outros arquivos
  return `/**
 * ${path.basename(filePath)}
 * Parte da arquitetura da aplicação Marias Decorações.
 */\n\n`;
}
