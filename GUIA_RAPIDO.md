
# Guia Rápido do Sistema de Gerenciamento

Este guia fornece uma referência rápida para as principais funcionalidades e instruções do sistema.

## Iniciando a Aplicação

```bash
# Instalação de dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar em produção
npm run start
```

## Estrutura do Projeto

- **client/**: Frontend React
- **server/**: Backend Express
- **shared/**: Código compartilhado

## Principais Tecnologias

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: PostgreSQL, Drizzle ORM

## Módulos Principais

1. **Inventário**: Gerenciamento de estoque e lista de compras
2. **Tarefas**: Gerenciamento de atividades e atribuições
3. **Equipe**: Gerenciamento de usuários e permissões
4. **Configuração**: Configurações do sistema e módulos

## Fluxos Importantes

### Autenticação
- Login via username/password
- Sessões gerenciadas com express-session
- Controle de acesso baseado em funções

### Inventário
- Adicionar/editar/remover itens
- Monitorar níveis de estoque
- Gerenciar lista de compras

### Tarefas
- Criar e atribuir tarefas
- Acompanhar status e prioridades
- Definir prazos e notificações

## Extensão do Sistema

### Adicionar Novo Modelo de Dados
1. Defina a tabela em `shared/schema.ts`
2. Crie os esquemas de validação
3. Execute `npm run db:push`

### Adicionar Nova Página
1. Crie o arquivo em `client/src/pages/`
2. Adicione a rota na navegação
3. Implemente os componentes necessários

### Adicionar Nova API
1. Crie o endpoint em `server/routes.ts`
2. Implemente os controladores e serviços
3. Adicione validação de entrada

## Solução de Problemas Rápida

- **Erros de UI**: Verifique o console do navegador
- **Erros de API**: Verifique os logs do servidor
- **Problemas de banco**: Verifique conexão e esquema

## Referências Rápidas

- **Documentação completa**: Ver DOCUMENTACAO.md
- **Bibliotecas React**: https://react.dev/
- **Componentes UI**: https://ui.shadcn.com/
- **Drizzle ORM**: https://orm.drizzle.team/
