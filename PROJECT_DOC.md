
# Maria's Decorações - Documentação do Projeto

## Banco de Dados

O sistema utiliza PostgreSQL para armazenamento de dados. As tabelas principais incluem:

- `users`: Usuários do sistema
- `roles`: Funções/papéis e permissões
- `user_sessions`: Sessões de usuários
- `inventory_items`: Itens do inventário
- `shopping_list`: Lista de compras
- `inventory_counts`: Contagens de inventário
- `tasks`: Tarefas
- `feedback`: Feedback dos usuários
- `messages`: Mensagens para chat
- `channels`: Canais de chat
- `notifications`: Notificações
- `system_config`: Configurações do sistema
- `config_history`: Histórico de configurações
- `modules`: Registro de módulos

## Estrutura da Aplicação

A aplicação segue uma arquitetura modular com:

- **Frontend**: React com TypeScript no diretório `/client`
- **Backend**: Node.js com Express no diretório `/server`
- **API RESTful**: Endpoints implementados em `/server/routes.ts`
- **Websockets**: Suporte para comunicação em tempo real
- **Banco de Dados**: PostgreSQL com schemas definidos em `/shared/schema.ts`

## Módulos Principais

- Dashboard
- Gerenciamento de Inventário
- Lista de Compras
- Gerenciamento de Tarefas
- Sistema de Feedback
- Chat em Tempo Real
- Notificações
- Configuração do Sistema
- Gerenciamento de Usuários
- Registro de Módulos

## Implantação

A aplicação pode ser implantada usando o menu "Deployments" no Replit, escolhendo "Always On" para manter a aplicação em execução constante.

## Rotas da API

Todas as rotas da API começam com `/api`:

- `/api/auth`: Autenticação e gerenciamento de sessão
- `/api/users`: Gerenciamento de usuários
- `/api/roles`: Gerenciamento de funções/papéis
- `/api/inventory`: Gerenciamento de inventário
- `/api/shopping`: Lista de compras
- `/api/tasks`: Gerenciamento de tarefas
- `/api/feedback`: Sistema de feedback
- `/api/channels`: Canais de chat
- `/api/notifications`: Notificações
- `/api/config`: Configurações do sistema
- `/api/modules`: Registro de módulos
- `/api/dashboard`: Dados agregados para o dashboard

## Executando o Projeto

Para executar o projeto, use o botão "Run" no Replit, que inicia o workflow "Start application".
