# Sistema de Transferências

Bem-vindo ao projeto **Garupa pay**! Este projeto é uma aplicação fullstack desenvolvida em React 18 e Node 20 que permite aos usuários criar transferências bancarias entre contas.

## Índice
- [Introdução](#introdução)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Ferramentas de Qualidade de Código](#ferramentas-de-qualidade-de-código)
- [O que foi feito](#o-que-foi-feito)
- [O que não foi feito](#o-que-não-foi-feito)
- [O que poderia ser melhorado](#o-que-poderia-ser-melhorado)

## Introdução

O objetivo deste projeto é fornecer uma interface amigável para transferências bancarias entre contas. A aplicação permite que os usuários visualizem, adicionem transferências, garantindo um processo eficiente para gerenciar contas.

## Funcionalidades

- **Visualizar Transaferecias por conta**: Listar todas as transferencias por conta com possibilidade de identificar visualmente as transferencias DEPOSIT e WITHDRAW da account com alguns detalhes da transferencia, como nome de quem enviou e de quem recebeu.
- **Visualizar detalhes da transferência**: Clique em "Details" para abrir um modal com detalhes da transferência.
- **Adicionar uma nova transferência**: Clique em + na coluna de Accounts para abrir um modal com um formulário para uma nova transferência.
- **Validação de Formulário**: Campos de entrada, quantidade e dados da conta com validação para garantir a entrada correta dos dados.
- **Feedback de Sucesso**: Notificação de feedback para usuario em caso de sucesso ou erro.

## Instalação

Para começar com este projeto, certifique-se de ter o [Node.js](https://nodejs.org/en/) e o [npm](https://www.npmjs.com/) instalados em sua máquina. Siga os passos abaixo:

1. Clone o repositório:

```bash
  git clone https://github.com/Zezinhojun/garupa-pay.git
  cd garupa-pay
```
2. Configure variáveis de ambiente:

```bash
  cp .env.example .env && cd backend && cp .env.example .env
```
3. Execute o Docker Compose:

```bash
  docker-compose up -d
```
4. Entre e instale as dependencias do backend para executar a migration e seed:

```bash
  npm install
```

5. Rode a migration e o seed:

```bash
  npm run db:fresh
```

## Uso

Para visualizar o frontend:

1. Abra seu navegador e navegue até `http://localhost:3000` para visualizar a aplicação.:

## Endpoints da API

A aplicação interage com os seguintes endpoints da API:

### Accounts
- Atualizar Status da Conta: PUT `http://localhost:3000/accounts/:accountId/status`
- Criar Nova Conta: POST `http://localhost:3000/accounts`
- Obter Conta por ID: GET `http://localhost:3000/accounts/:id`
- Obter Todas as Contas: GET `http://localhost:3000/accounts`
- Atualizar Conta: PUT `http://localhost:3000/accounts/:id`
- Deletar Conta: DELETE `http://localhost:3000/accounts/:id`

### Transactions
- Criar Nova Transação: POST `http://localhost:3000/transactions`
- Obter Transação por ID: GET `http://localhost:3000/transactions/:id`
- Obter Todas as Transações: GET `http://localhost:3000/transactions`
- Atualizar Transação: PUT `http://localhost:3000/transactions/:id`
- Deletar Transação: DELETE `http://localhost:3000/transactions/:id`

## Ferramentas de Qualidade de Código

Para garantir a qualidade do código e um fluxo de trabalho eficiente, o projeto utiliza as seguintes ferramentas:

- ESLint: Usado para detectar e corrigir problemas no código JavaScript/TypeScript, garantindo a consistência do código.
- Prettier: Formata o código automaticamente para garantir um estilo de código consistente.

## O que foi feito

Durante o desenvolvimento do projeto **Garupa**, as seguintes funcionalidades e melhorias foram implementadas:

### Backend

- **Estruturação e Modularização do Projeto**: 
  - O backend foi desenvolvido com Node.js utilizando a Clean Architecture, priorizando a modularização e a manutenção de um código escalável e de fácil compreensão. A arquitetura foi organizada em camadas bem definidas, com separação clara entre domínios, aplicações e infraestrutura, garantindo que cada componente do sistema tenha uma responsabilidade única e que o projeto seja facilmente expansível.
- **Design Pattern Adapter**:
  - A aplicação do Design Pattern Adapter permitiu a integração de diferentes bibliotecas e serviços no sistema de maneira flexível. Com isso, qualquer nova biblioteca ou serviço pode ser facilmente adaptado às interfaces e abstrações da arquitetura, sem comprometer a estrutura principal do projeto. Isso facilita a substituição ou atualização de componentes sem afetar o funcionamento de outros.
- **Banco de Dados e Migrações**:
  - A estrutura do banco de dados foi cuidadosamente planejada para garantir escalabilidade e integridade dos dados ao longo do tempo. Foi implementado um sistema de migrações e seeds, permitindo que a base de dados evolua automaticamente conforme mudanças no modelo de dados, sem causar interrupções. Isso facilita o gerenciamento de versões do banco de dados e a manutenção de dados consistentes durante o ciclo de vida do projeto.
- **Padrões de Código e Testes**:
  - Para garantir a consistência e qualidade do código, foram implementadas ferramentas de qualidade de código como ESLint e Prettier, o que assegura um código bem estruturado e em conformidade com as boas práticas de desenvolvimento. Além disso, uma base robusta de testes unitários e de integração foi criada, permitindo validar o comportamento do sistema e detectar problemas antecipadamente, garantindo maior confiabilidade e estabilidade.
- **Tratamento de Erros**:
  - Foi implementado um sistema de tratamento de erros genérico, que captura e trata falhas de maneira eficiente. Esse sistema melhora a experiência do usuário, proporcionando respostas mais claras e informativas quando ocorrem erros, além de permitir uma fácil rastreabilidade para os desenvolvedores, facilitando a identificação e correção de problemas.

- **Paginação**:
  - A funcionalidade de paginação foi implementada para permitir a busca e recuperação eficiente de grandes volumes de dados. Essa abordagem otimiza a performance da aplicação, retornando apenas um subconjunto de resultados de cada vez, o que melhora a experiência do usuário e reduz a carga nos servidores e banco de dados.


### Frontend

- **Arquitetura MVVM**:
  - No frontend, a aplicação foi projetada utilizando a arquitetura MVVM (Model-View-ViewModel), que proporciona uma separação clara entre a lógica de apresentação e a lógica de negócios. Isso facilita a manutenção e a escalabilidade do sistema, permitindo que mudanças na interface do usuário ou na lógica de negócios possam ser feitas de forma independente, sem impactar diretamente outras partes da aplicação.
- **Padrão de Código e Estruturação**:
  - A padronização de código foi implementada utilizando ESLint, garantindo que as boas práticas de desenvolvimento sejam seguidas consistentemente ao longo de todo o projeto. A estruturação da aplicação foi pensada para ser escalável, permitindo que novas funcionalidades sejam adicionadas de forma modular e eficiente, mantendo o código organizado, legível e fácil de manter.

## O que não foi feito

Embora várias funcionalidades tenham sido implementadas, algumas características não foram incluídas devido a restrições de tempo:

- **Exaustão de Testes**:
  - Não foi possível realizar uma bateria completa de testes unitários e de integração para todas as funcionalidades implementadas. Testes exaustivos são essenciais para garantir a robustez do sistema.

## O que poderia ser melhorado

Existem várias áreas que poderiam ser aprimoradas para tornar o projeto mais robusto e funcional:

- **Implementação de Testes Automatizados**:

  - Realizar testes unitários e E2E para garantir a qualidade do código e a estabilidade da aplicação. Isso ajudaria a identificar e corrigir bugs de forma mais eficiente.

- **Design**:
  - Poderia haver um design mais focado no cliente e com mais responsidade.

- **Adicionar todas as funcionalidades da API**:
  - Uma possível melhoria seria adicionar todas as funcionalidades da API necessárias para suportar operações adicionais, como filtros de busca, paginação e novos endpoints específicos, permitindo maior flexibilidade e controle sobre os dados no backend. Isso também incluiria validações mais robustas e manuseio de erros mais detalhados.

- **Melhorias na Experiência do Usuário**:
  - Refinar a interface do usuário com feedback visual mais claro.

- **Uma atualização do feedback da transaction após processada**:
  - Para melhorar o feedback das transações processadas, a utilização de websockets ou mensageria (como RabbitMQ) poderia garantir que as atualizações em tempo real sobre o status da transação cheguem ao frontend, sem a necessidade de atualização manual. Com isso, o usuário seria informado imediatamente sobre o resultado da operação, proporcionando uma experiência mais interativa e responsiva.

---
