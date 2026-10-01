<div align="center">

# Front-Carros

**Sistema de gerenciamento de veículos e marcas com autenticação JWT**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![MUI](https://img.shields.io/badge/MUI-7-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

</div>

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura e Estrutura](#arquitetura-e-estrutura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Integração com a API](#integração-com-a-api)
- [Decisões de Design](#decisões-de-design)

---

## Visão Geral

Front-Carros é uma Single Page Application (SPA) desenvolvida em React que fornece uma interface completa para gerenciamento de um catálogo de veículos e marcas. O sistema consome uma API REST externa e implementa autenticação baseada em JWT, com proteção de rotas para garantir que apenas usuários autenticados acessem as telas protegidas.

A aplicação foi construída com foco em **experiência do usuário** (feedback de loading e erros em todas as operações), **qualidade de código** (tratamento de erros consistente, sem `console.log` em produção) e **acessibilidade** (conformidade com critérios WAI-ARIA e regras SonarLint).

---

## Funcionalidades

### Autenticação
- Login com email e senha via API REST
- Armazenamento seguro do token JWT no `localStorage`
- Logout com limpeza total da sessão
- Mensagens de erro diferenciadas por tipo de falha (credenciais incorretas vs. falha de rede)

### Cadastro de Usuários
- Registro de novos usuários com nome, email e senha
- Listagem de todos os usuários cadastrados
- Exclusão de usuários com confirmação visual
- Feedback de carregamento (`Carregando usuários...`) e estado vazio (`Nenhum usuário cadastrado.`)
- Erros de formulário e de lista exibidos de forma independente

### Gerenciamento de Veículos (`/carros`)
- Listagem completa de veículos com dados de marca, modelo, ano e placa
- **Busca por ID** com limpeza inteligente (o botão "Limpar" zera também o campo de texto)
- **Cadastro** de novo veículo via modal com validação nativa do HTML5
- **Edição** de veículo existente com pré-preenchimento dos campos no modal
- **Exclusão** individual com atualização imediata da lista
- Exibição de erros em linha dentro dos modais, sem interromper o fluxo do usuário

### Gerenciamento de Marcas (`/carros/marcas`)
- Listagem, cadastro, edição e exclusão de marcas (mesmo padrão de UX dos Veículos)
- Busca por ID com os mesmos comportamentos
- Navegação integrada entre as telas de Veículos e Marcas pelo menu lateral/header

---

## Arquitetura e Estrutura

```
front-carros/
├── public/
├── src/
│   ├── assets/                  # Imagens estáticas (car.png, car2.jpg, car3.svg)
│   ├── components/
│   │   └── privateRoute.jsx     # Guard de rota baseado em token JWT
│   ├── pages/
│   │   ├── CadastroUsuario/
│   │   │   ├── index.jsx        # Tela de cadastro e listagem de usuários
│   │   │   └── style.module.css
│   │   ├── HomeCarros/
│   │   │   ├── index.jsx        # Tela principal de veículos (CRUD completo)
│   │   │   └── style.module.css
│   │   ├── HomeMarcas/
│   │   │   ├── index.jsx        # Tela de marcas (CRUD completo)
│   │   │   └── style.module.css
│   │   └── Login/
│   │       ├── index.jsx        # Tela de autenticação
│   │       └── style.module.css
│   ├── services/
│   │   └── api.js               # Instância do Axios com interceptor JWT
│   ├── index.css                # Reset global e estilos compartilhados
│   └── main.jsx                 # Ponto de entrada — roteamento e renderização
├── .env.example                 # Modelo de variáveis de ambiente
├── eslint.config.js
├── vite.config.js
└── package.json
```

### Fluxo de dados

```
Usuário → Página → api.js (Axios + JWT interceptor) → API REST
                                                          │
                                              ┌───────────┘
                                              │
                                    Resposta / Erro
                                              │
                              ┌───────────────┴───────────────┐
                              │                               │
                         setEstado()                    setError() / setModalError()
                              │                               │
                         Re-render                     Mensagem em linha
```

---

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca de UI com hooks |
| [Vite](https://vite.dev/) | 7 | Build tool e dev server com HMR |
| [React Router DOM](https://reactrouter.com/) | 7 | Roteamento SPA com proteção de rotas |
| [Axios](https://axios-http.com/) | 1.x | Cliente HTTP com interceptor de autenticação |
| [MUI Icons Material](https://mui.com/material-ui/material-icons/) | 7 | Ícones (Search, Add, Edit, Delete, etc.) |
| [MUI Material](https://mui.com/) | 7 | Biblioteca de componentes (base de estilos) |
| [Emotion](https://emotion.sh/) | 11 | Engine CSS-in-JS usada pelo MUI |
| CSS Modules | — | Escopo local de estilos por componente |

---

## Pré-requisitos

Antes de iniciar, verifique se você tem instalado:

- **Node.js** `>= 18.x` — [Download](https://nodejs.org/)
- **npm** `>= 9.x` (incluído com o Node.js)
- A **API backend** em execução e acessível (padrão: `http://localhost:3333`)

> A aplicação **não funciona standalone** — ela depende de uma API REST que fornece os endpoints de autenticação (`/auth/login`), usuários (`/usuarios`), veículos (`/carros`) e marcas (`/marcas`).

---

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/WesleyTaveira/front-carros.git
cd front-carros
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme sua configuração:

```bash
cp .env.example .env
```

Edite o `.env` com a URL da sua API:

```env
API_URL=http://localhost:3333
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `API_URL` | `http://localhost:3333` | URL base da API REST backend |

> Se a variável `API_URL` não for definida, a aplicação usa `http://localhost:3333` como fallback (definido em `src/services/api.js`).

**Importante:** no Vite, variáveis de ambiente expostas ao cliente devem ter o prefixo `VITE_`. Se necessário migrar para o padrão Vite, renomeie para `VITE_API_URL` e ajuste a leitura para `import.meta.env.VITE_API_URL`.

---

## Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR)
npm run dev

# Gera o build de produção na pasta /dist
npm run build

# Pré-visualiza o build de produção localmente
npm run preview

# Executa o linter ESLint em todos os arquivos
npm run lint
```

---

## Rotas da Aplicação

| Rota | Componente | Proteção | Descrição |
|---|---|---|---|
| `/` | `Login` | Pública | Tela de autenticação |
| `/cadastro` | `CadastroUsuario` | Pública | Cadastro e listagem de usuários |
| `/carros` | `HomeCarros` | Privada (JWT) | CRUD de veículos |
| `/carros/marcas` | `HomeMarcas` | Privada (JWT) | CRUD de marcas |

Rotas privadas são protegidas pelo componente `PrivateRoute`, que verifica a presença do token JWT no `localStorage`. Usuários não autenticados são redirecionados para `/` automaticamente.

---

## Autenticação e Segurança

### Fluxo de Login

1. O usuário submete email e senha via formulário na rota `/`
2. A aplicação faz `POST /auth/login` com as credenciais
3. Em caso de sucesso, o token JWT e os dados do usuário são salvos no `localStorage`
4. O usuário é redirecionado para `/carros`
5. Todas as requisições subsequentes incluem o token no header `Authorization: Bearer <token>`

### Proteção de Rotas

```jsx
// src/components/privateRoute.jsx
export function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
}
```

### Interceptor HTTP

O Axios está configurado com um interceptor que injeta automaticamente o token em cada requisição:

```js
// src/services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Logout

O logout limpa o `localStorage` (token e dados do usuário) e redireciona o usuário para a tela de login, invalidando o acesso às rotas privadas.

---

## Integração com a API

A aplicação espera uma API REST com os seguintes contratos:

### Autenticação

```
POST /auth/login
Body: { "email": string, "senha": string }
Response: { "access_token": string, "usuario": object }
```

### Usuários

```
GET    /usuarios           → Lista todos os usuários
POST   /usuarios           → Cria um novo usuário
DELETE /usuarios/:id       → Remove um usuário pelo ID
```

### Veículos

```
GET    /carros             → Lista todos os veículos
GET    /carros/:id         → Busca um veículo pelo ID
POST   /carros             → Cadastra um veículo { marca, modelo, ano, placa }
PATCH  /carros/:id         → Atualiza um veículo pelo ID
DELETE /carros/:id         → Remove um veículo pelo ID
```

### Marcas

```
GET    /marcas             → Lista todas as marcas
GET    /marcas/:id         → Busca uma marca pelo ID
POST   /marcas             → Cadastra uma marca { nome }
PATCH  /marcas/:id         → Atualiza uma marca pelo ID
DELETE /marcas/:id         → Remove uma marca pelo ID
```

> A estrutura de resposta esperada segue o padrão `{ data: <payload> }` ou `{ data: { data: <payload> } }`.

---

## Decisões de Design

### CSS Modules para escopo local
Cada página tem seu próprio arquivo `.module.css`, evitando conflitos de classe entre componentes. Variáveis CSS globais (custom properties) centralizam cores, bordas e sombras no `:root`.

### Modais com semântica HTML5 nativa
Os modais utilizam o elemento `<dialog>` nativo em vez de `<div role="dialog">`, garantindo conformidade com as especificações WAI-ARIA e eliminando advertências do SonarLint (regras `S6819` e `S6847`). A estrutura de três camadas separa responsabilidades:

- `<div class="modal-overlay">` — posicionamento e centralização
- `<button class="modal-backdrop">` — clique fora para fechar (elemento interativo nativo)
- `<dialog class="modal-content" open>` — conteúdo semântico com `aria-labelledby`

### Tratamento de erros em todos os níveis
Toda operação assíncrona está envolvida em `try/catch`. Erros da lista principal aparecem na tela principal; erros dos formulários dos modais aparecem dentro do modal, sem interromper o restante da interface. Mensagens são extraídas de `err.response?.data?.message` com fallback para mensagem genérica.

### Estado `isLoading` explícito
O estado de carregamento é controlado programaticamente com `setIsLoading(true/false)` dentro de blocos `try/finally`, garantindo que o indicador de carregamento sempre seja removido, mesmo em caso de erro.

---

## Autor

**Wesley Taveira** — [@WesleyTaveira](https://github.com/WesleyTaveira)
