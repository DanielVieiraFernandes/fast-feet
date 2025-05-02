# FastFeet API

API para controle de encomendas da transportadora fictícia **FastFeet**. A aplicação foi construída utilizando NestJS e segue a arquitetura **MVC**.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js para construção da API.
- **Prisma**: ORM para manipulação de banco de dados relacional (PostgreSQL).
- **JWT**: Autenticação e autorização baseada em tokens.
- **RBAC (Role-Based Access Control)**: Controle de acesso baseado em papéis de usuário (**admin** e **entregador**).
- **Docker**: Para configuração e gerenciamento do banco de dados.
- **Swagger**: Documentação interativa da API.

## Funcionalidades Principais

- **Autenticação**: Login via CPF e Senha.
- **Gestão de Encomendas**: CRUD de encomendas (admin) e alterações de status (aguardando, retirada, entregue, devolvida).
- **Gestão de Usuários**: CRUD de entregadores e destinatários (admin).
- **Entrega de Encomendas**: Listagem de encomendas próximas ao entregador e notificação ao destinatário a cada alteração no status.
- **Alteração de Senha**: Somente o **admin** pode alterar a senha de usuários.