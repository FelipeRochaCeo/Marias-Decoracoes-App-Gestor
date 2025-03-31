
# Documentação Completa do Sistema Marias Decorações

## Visão Geral

Este documento fornece uma documentação detalhada do Sistema de Gerenciamento, uma aplicação web desenvolvida para gerenciar recursos internos de uma organização, incluindo inventário, tarefas, feedback e configurações do sistema.

## Índice

1. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Modelos de Dados](#modelos-de-dados)
5. [Componentes Principais](#componentes-principais)
6. [Fluxos de Trabalho](#fluxos-de-trabalho)
7. [APIs e Integração](#apis-e-integração)
8. [Autenticação e Autorização](#autenticação-e-autorização)
9. [Configuração do Sistema](#configuração-do-sistema)
10. [Guia de Manutenção](#guia-de-manutenção)
11. [Guia de Extensão](#guia-de-extensão)
12. [Solução de Problemas](#solução-de-problemas)

## Arquitetura da Aplicação

A aplicação segue uma arquitetura cliente-servidor com as seguintes camadas:

### Cliente (Frontend)
- Desenvolvido em React com TypeScript
- Interface de usuário construída com componentes Shadcn/UI
- Estado gerenciado através de Hooks do React e React Query
- Roteamento implementado com Wouter

### Servidor (Backend)
- Node.js com Express
- API RESTful para comunicação com o cliente
- Integração com banco de dados PostgreSQL através do Drizzle ORM
- WebSockets para funcionalidades em tempo real

### Banco de Dados
- PostgreSQL para armazenamento persistente
- Esquema gerenciado via Drizzle ORM

### Diagrama de Arquitetura

```
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│             │           │             │           │             │
│   Cliente   │◄─────────►│   Servidor  │◄─────────►│ Banco de    │
│   (React)   │   HTTP/   │  (Express)  │  Drizzle  │   Dados     │
│             │    WS     │             │    ORM    │ (PostgreSQL)│
└─────────────┘           └─────────────┘           └─────────────┘
```

## Tecnologias Utilizadas

### Frontend
- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Superset de JavaScript com tipagem estática
- **Vite**: Ferramenta de build e desenvolvimento
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/UI**: Biblioteca de componentes UI
- **React Query**: Gerenciamento de estado do servidor
- **Wouter**: Biblioteca de roteamento leve
- **Lucide React**: Ícones
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de esquemas

### Backend
- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **TypeScript**: Tipagem estática para JavaScript
- **Drizzle ORM**: ORM para bancos de dados SQL
- **WebSocket**: Comunicação em tempo real
- **Express Session**: Gerenciamento de sessões
- **Passport**: Autenticação

### Banco de Dados
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional
- **Neon Database**: Serviço de banco de dados PostgreSQL serverless

### Ferramentas de Desenvolvimento
- **ESBuild**: Bundler JavaScript
- **TSX**: Executor de TypeScript
- **Drizzle Kit**: Utilitários para Drizzle ORM

## Estrutura do Projeto

```
├── client/                # Código do frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── core/      # Componentes base do sistema
│   │   │   ├── layouts/   # Layouts da aplicação
│   │   │   ├── modules/   # Componentes específicos de módulos
│   │   │   └── ui/        # Componentes de interface do usuário
│   │   ├── hooks/         # React hooks customizados
│   │   ├── lib/           # Utilidades e funções auxiliares
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── store/         # Estado global da aplicação
│   │   ├── types/         # Definições de tipos TypeScript
│   │   ├── main.tsx       # Ponto de entrada da aplicação React
│   │   └── App.tsx        # Componente principal da aplicação
│   └── index.html         # Arquivo HTML base
├── server/                # Código do backend
│   ├── controllers/       # Controladores da API
│   ├── middleware/        # Middleware do Express
│   ├── models/            # Modelos de dados
│   ├── routes/            # Rotas da API
│   ├── services/          # Serviços de negócio
│   ├── utils/             # Utilidades do servidor
│   ├── index.ts           # Ponto de entrada do servidor
│   ├── routes.ts          # Registro de rotas da API
│   ├── storage.ts         # Configuração de armazenamento
│   └── vite.ts            # Configuração do Vite para desenvolvimento
├── shared/                # Código compartilhado entre cliente e servidor
│   └── schema.ts          # Esquemas de dados compartilhados
├── package.json           # Dependências e scripts
└── tsconfig.json          # Configuração do TypeScript
```

## Modelos de Dados

A aplicação utiliza os seguintes modelos de dados principais:

### Usuários (Users)
Gerencia as contas de usuário no sistema.

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("Funcionário"),
  status: text("status").notNull().default("ativo"),
});
```

### Funções (Roles)
Define as funções e permissões dos usuários.

```typescript
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  permissions: text("permissions").array().notNull(),
});
```

### Itens de Inventário (Inventory Items)
Rastreia os itens no inventário da organização.

```typescript
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(5),
  maxQuantity: integer("max_quantity").notNull(),
  unit: text("unit").notNull(),
});
```

### Lista de Compras (Shopping List)
Gerencia itens que precisam ser comprados.

```typescript
export const shoppingList = pgTable("shopping_list", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unit: text("unit").notNull(),
  status: text("status").notNull().default("pending"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### Tarefas (Tasks)
Gerencia as tarefas e atividades da equipe.

```typescript
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("a fazer"),
  priority: text("priority").notNull().default("média"),
  assignee: integer("assignee"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
});
```

### Feedback
Coleta feedback dos usuários.

```typescript
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  visibility: text("visibility").notNull().default("all"),
  status: text("status").notNull().default("aberto"),
  submittedBy: integer("submitted_by").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});
```

### Módulos (Modules)
Registra os módulos disponíveis no sistema.

```typescript
export const modules = pgTable("modules", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  dependencies: text("dependencies").array(),
  permissions: text("permissions").array().notNull(),
  active: boolean("active").notNull().default(true),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  registeredBy: integer("registered_by").notNull(),
});
```

## Componentes Principais

### Layout e Interface de Usuário

#### AppShell
O componente principal que envolve toda a aplicação, gerenciando o layout responsivo.

#### Sidebar
Menu lateral de navegação que exibe os links para as diferentes seções da aplicação.

#### Componentes UI
- **Button**: Botões com diferentes variantes e estados
- **Card**: Contêineres para conteúdo
- **Dialog**: Diálogos modais
- **Tabs**: Navegação por abas
- **Table**: Visualização de dados tabulares
- **Form**: Componentes de formulário

### Módulos Funcionais

#### Inventário
Gerencia o controle de estoque, com recursos para:
- Visualizar itens em estoque
- Adicionar/editar/remover itens
- Realizar contagens de inventário
- Gerenciar lista de compras

#### Tarefas
Sistema de gerenciamento de tarefas com:
- Criação e atribuição de tarefas
- Acompanhamento de status e prioridade
- Filtros e visualizações personalizadas
- Notificações de prazos

#### Equipe
Gerenciamento de equipes e usuários:
- Visualização de membros da equipe
- Atribuição de funções e permissões
- Status de atividade dos usuários

#### Configuração
Painel de configuração do sistema:
- Gerenciamento de módulos
- Configurações do sistema
- Controle de versão de configurações

## Fluxos de Trabalho

### Autenticação e Autorização
1. Usuário acessa a aplicação
2. Sistema verifica se existe uma sessão ativa
3. Se não houver sessão, redireciona para a tela de login
4. Após login bem-sucedido, carrega as permissões do usuário
5. Interface é adaptada com base nas permissões do usuário

### Gerenciamento de Inventário
1. Usuário acessa a seção de inventário
2. Visualiza a lista de itens em estoque
3. Pode filtrar e ordenar a lista
4. Pode adicionar novos itens ou editar existentes
5. Itens abaixo do nível mínimo são destacados
6. Itens podem ser adicionados à lista de compras

### Ciclo de Vida de Tarefas
1. Criação da tarefa com título, descrição, prioridade e data de vencimento
2. Atribuição a um membro da equipe
3. Acompanhamento de progresso com atualizações de status
4. Notificações para tarefas próximas do vencimento
5. Conclusão ou cancelamento da tarefa

### Processamento de Feedback
1. Usuário submete feedback via formulário
2. Feedback é armazenado com metadados (tipo, visibilidade)
3. Administradores podem revisar e atualizar o status
4. Feedback pode ser convertido em tarefas

## APIs e Integração

### API REST
A aplicação expõe uma API REST para operações CRUD em todos os recursos principais:

- **Usuários**: `/api/users`
- **Inventário**: `/api/inventory`
- **Tarefas**: `/api/tasks`
- **Feedback**: `/api/feedback`
- **Configuração**: `/api/config`

### WebSockets
Utilizados para comunicação em tempo real:

- Notificações em tempo real
- Atualizações de status de tarefas
- Chat e mensagens

## Autenticação e Autorização

### Autenticação
A aplicação utiliza Passport.js com estratégia local (username/password) para autenticação:

- Credenciais armazenadas no banco de dados
- Senhas hash com bcrypt
- Sessões gerenciadas com express-session

### Autorização
Baseada em funções (roles) e permissões:

- Cada usuário tem uma função associada
- Funções definem conjuntos de permissões
- Componentes e rotas verificam permissões antes de renderizar ou processar requisições

## Configuração do Sistema

### Módulos
O sistema possui uma arquitetura modular:

- Módulos podem ser ativados/desativados
- Cada módulo define suas próprias permissões
- Módulos podem depender de outros módulos

### Versionamento de Configuração
Todas as alterações de configuração são versionadas:

- Histórico completo de alterações
- Possibilidade de reverter para versões anteriores
- Auditoria de quem realizou cada alteração

## Guia de Manutenção

### Atualização de Dependências
Para atualizar as dependências do projeto:

```bash
npm update
```

Para uma atualização mais controlada, verifique as versões disponíveis:

```bash
npm outdated
```

E então atualize pacotes específicos:

```bash
npm install pacote@versão
```

### Manutenção do Banco de Dados
Para aplicar alterações no esquema do banco de dados:

```bash
npm run db:push
```

### Logs e Monitoramento
Os logs do servidor são exibidos no console durante a execução e podem ser capturados para análise.

O arquivo `server/index.ts` contém a lógica de logging que registra todas as requisições à API, respostas e tempos de execução.

## Guia de Extensão

### Adicionando um Novo Módulo

1. **Defina o esquema de dados**: Adicione as tabelas necessárias em `shared/schema.ts`

2. **Crie componentes de interface**: Adicione os componentes necessários em `client/src/components/modules/`

3. **Implemente as rotas da API**: Adicione os endpoints da API em `server/routes.ts`

4. **Atualize o registro de módulos**: Registre o novo módulo no sistema

### Adicionando Novos Componentes UI

1. Crie o componente em `client/src/components/ui/`
2. Siga o padrão de componentes existentes, utilizando as mesmas convenções
3. Utilize as utilidades de classe do Tailwind CSS para estilização

### Expandindo o Esquema de Dados

1. Adicione novas tabelas ou campos em `shared/schema.ts`
2. Crie os esquemas de validação correspondentes usando `createInsertSchema`
3. Execute `npm run db:push` para aplicar as alterações no banco de dados

## Solução de Problemas

### Problemas Comuns e Soluções

#### Erros de Conexão com o Banco de Dados
- Verifique as credenciais de conexão
- Confirme se o serviço de banco de dados está em execução
- Verifique restrições de firewall ou rede

#### Problemas de Autenticação
- Limpe os cookies e sessões do navegador
- Verifique se as credenciais estão corretas
- Confirme se o usuário tem o status "ativo"

#### Problemas de Renderização UI
- Verifique o console do navegador para erros
- Confirme se os componentes estão recebendo as props corretas
- Verifique problemas de compatibilidade de versões de bibliotecas

### Canais de Suporte
Para obter suporte adicional:
- Consulte a documentação das bibliotecas utilizadas
- Contate o time de desenvolvimento interno
- Utilize sistemas de rastreamento de bugs internos

## Iniciando o Desenvolvimento

Para iniciar o desenvolvimento:

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente necessárias
4. Inicie o servidor de desenvolvimento: `npm run dev`

A aplicação estará disponível em http://localhost:5000
