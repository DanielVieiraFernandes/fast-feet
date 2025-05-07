# FastFeet API

API para controle de encomendas da transportadora fictícia **FastFeet**. A aplicação foi construída utilizando NestJS e segue a arquitetura **MVC**.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js para construção da API.
- **Prisma**: ORM para manipulação de banco de dados relacional (PostgreSQL).
- **JWT**: Autenticação e autorização baseada em tokens.
- **RBAC (Role-Based Access Control)**: Controle de acesso baseado em papéis de usuário (**admin** e **entregador**).
- **Envio de notificações**: Notificar os usuários por e-mail após alterações no status da encomenda.
- **R2 CLOUDFLARE (com api da AWS)**: upload de arquivos por meio do cloudflare, para a confirmação da entrega da encomenda.
- **Testes E2E (end-to-end)**: Testes de ponta a ponta para garantir que todas as rotas da aplicação estejam funcionando adequadamente e cumprindo com o seu propósito.
- **Docker**: Para configuração e gerenciamento do banco de dados.
- **Swagger**: Documentação interativa da API.

## Padrões de Projeto

- **Arquitetura MVC**: Separação clara entre Model, Controller, e Service.
- **Programação funcional**: Uso do padrão Either para garantir um fluxo controlado e previsível em falhas da aplicação.
- **Separação de responsabilidades**: Cada camada da aplicação possui uma responsabilidade única, facilitando testes e manutenção.

## Funcionalidades Principais

- **Autenticação**: Login via CPF e Senha.
- **Gestão de Encomendas**: CRUD de encomendas (admin) e alterações de status (aguardando, retirada, entregue, devolvida).
- **Gestão de Usuários**: CRUD de entregadores e destinatários (admin).
- **Entrega de Encomendas**: Listagem de encomendas próximas ao entregador e notificação ao destinatário a cada alteração no status.
- **Alteração de Senha**: Somente o **admin** pode alterar a senha de usuários.
