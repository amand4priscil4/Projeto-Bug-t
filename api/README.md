# Bug-t API

**Backend RESTful para o aplicativo Bug-t**

API Node.js com Express que gerencia dados de tarefas, diário técnico e sessões Pomodoro para desenvolvedores.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **File System (JSON)** - Sistema de armazenamento
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger
- **Dotenv** - Gerenciamento de variáveis de ambiente

## Estrutura do Projeto

```
api/
├── server.js              # Servidor principal
├── package.json           # Dependências e scripts
├── routes/                # Rotas da API
│   ├── tasks.js          # Rotas de tarefas
│   ├── diary.js          # Rotas do diário
│   └── pomodoro.js       # Rotas do pomodoro
├── utils/                 # Utilitários
│   └── fileManager.js    # Gerenciador de arquivos JSON
└── data/                  # Banco de dados JSON
    ├── tasks.json        # Dados das tarefas
    ├── diary.json        # Dados do diário
    └── pomodoro.json     # Dados do pomodoro
```

## Instalação e Execução

### Pré-requisitos
- Node.js (v16 ou superior)
- npm

### Instalação
```bash
cd api
npm install
```

### Scripts Disponíveis
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz da pasta `api`:
```env
PORT=3000
NODE_ENV=development
```

## Endpoints da API

### Base URL
- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://bug-t-api.onrender.com`

### Health Check
```http
GET /api/health
```
**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-06-04T15:30:00.000Z"
}
```

---

## Tasks (Tarefas)

### Listar Todas as Tarefas
```http
GET /api/tasks
```
**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Setup React Native project",
      "completed": true,
      "priority": "high",
      "createdAt": "2025-06-04T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Obter Tarefa Específica
```http
GET /api/tasks/:id
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Setup React Native project",
    "completed": true,
    "priority": "high",
    "createdAt": "2025-06-04T10:00:00.000Z"
  }
}
```

### Criar Nova Tarefa
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Implementar autenticação",
  "priority": "high"
}
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "title": "Implementar autenticação",
    "completed": false,
    "priority": "high",
    "createdAt": "2025-06-04T15:30:00.000Z"
  }
}
```

### Atualizar Tarefa
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Implementar autenticação JWT",
  "completed": true,
  "priority": "medium"
}
```

### Deletar Tarefa
```http
DELETE /api/tasks/:id
```
**Resposta:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Diary (Diário)

### Listar Todas as Entradas
```http
GET /api/diary
```
**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "date": "2025-06-04",
      "title": "React Native Development Setup",
      "content": "Hoje configurei um projeto React Native...",
      "tags": ["React Native", "Expo"],
      "mood": "productive",
      "createdAt": "2025-06-04T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Criar Nova Entrada
```http
POST /api/diary
Content-Type: application/json

{
  "title": "Aprendendo Node.js",
  "content": "Hoje estudei sobre APIs RESTful...",
  "tags": ["Node.js", "API", "Backend"],
  "mood": "focused"
}
```

### Atualizar Entrada
```http
PUT /api/diary/:id
Content-Type: application/json

{
  "title": "Aprendendo Node.js e Express",
  "content": "Conteúdo atualizado...",
  "tags": ["Node.js", "Express", "API"],
  "mood": "productive"
}
```

### Deletar Entrada
```http
DELETE /api/diary/:id
```

---

## Pomodoro

### Obter Estatísticas Gerais
```http
GET /api/pomodoro/stats
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 15,
    "totalTime": 375,
    "sessionsToday": 3,
    "timeToday": 75,
    "lastDate": "2025-06-04"
  }
}
```

### Obter Estatísticas de Hoje
```http
GET /api/pomodoro/today
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "date": "2025-06-04",
    "sessions": 3,
    "totalTime": 75,
    "workSessions": 3,
    "breakSessions": 0
  }
}
```

### Listar Sessões
```http
GET /api/pomodoro/sessions
```
**Parâmetros opcionais:**
- `date`: Filtrar por data (YYYY-MM-DD)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "date": "2025-06-04",
      "duration": 25,
      "type": "work",
      "completed": true,
      "createdAt": "2025-06-04T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Criar Nova Sessão
```http
POST /api/pomodoro/sessions
Content-Type: application/json

{
  "duration": 25,
  "type": "work"
}
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "date": "2025-06-04",
    "duration": 25,
    "type": "work",
    "completed": true,
    "createdAt": "2025-06-04T15:30:00.000Z"
  },
  "stats": {
    "totalSessions": 16,
    "totalTime": 400,
    "sessionsToday": 4,
    "timeToday": 100,
    "lastDate": "2025-06-04"
  }
}
```

### Atualizar Estatísticas
```http
PUT /api/pomodoro/stats
Content-Type: application/json

{
  "totalSessions": 20,
  "totalTime": 500
}
```

---

## Estrutura dos Dados

### Task Schema
```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
}
```

### Diary Entry Schema
```typescript
interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  mood: 'productive' | 'focused' | 'creative' | 'curious';
  createdAt: string;
  updatedAt?: string;
}
```

### Pomodoro Session Schema
```typescript
interface PomodoroSession {
  id: string;
  date: string;
  duration: number;
  type: 'work' | 'break';
  completed: boolean;
  createdAt: string;
}

interface PomodoroStats {
  totalSessions: number;
  totalTime: number;
  sessionsToday: number;
  timeToday: number;
  lastDate: string;
}
```

## Tratamento de Erros

### Códigos de Status HTTP
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

### Formato de Erro
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos (apenas em desenvolvimento)"
}
```

## Deploy

### Render.com
1. Conecte seu repositório GitHub
2. Configure:
   - **Root Directory**: `api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Deploy automático a cada push

### Variáveis de Ambiente (Produção)
```env
NODE_ENV=production
PORT=3000
```

## Logs

O sistema utiliza **Morgan** para logging de requisições HTTP:

```
::1 - - [04/Jun/2025:15:30:00 +0000] "GET /api/tasks HTTP/1.1" 200 234
::1 - - [04/Jun/2025:15:30:05 +0000] "POST /api/tasks HTTP/1.1" 201 156
```

## Desenvolvimento

### Estrutura do Código
- **server.js**: Configuração principal do Express
- **routes/**: Definição de rotas e controladores
- **utils/fileManager.js**: Utilitário para manipulação de arquivos JSON
- **data/**: Arquivos JSON que servem como banco de dados

### Adicionando Novas Rotas
1. Crie o arquivo na pasta `routes/`
2. Implemente os endpoints RESTful
3. Importe e use no `server.js`

### Sistema de Arquivos JSON
- Cada recurso tem seu próprio arquivo JSON
- FileManager abstrai operações de leitura/escrita
- Dados persistem entre restarts do servidor

## Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---