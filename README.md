# Projeto-Bug-t

**Aplicativo de gestão de projetos e aprendizado para desenvolvedores**

Bug-t é uma aplicação completa que combina gerenciamento de tarefas, técnica Pomodoro e diário técnico, criada especificamente para desenvolvedores organizarem seus projetos e documentarem seu aprendizado.

## Sobre o Projeto

### Funcionalidades Principais
- **Checklist de Tarefas**: Gerencie suas tarefas de desenvolvimento com prioridades
- **Pomodoro Timer**: Timer circular com temas de programação para sessões focadas
- **Diário Técnico**: Documente seu aprendizado diário com tags e humor
- **Dashboard**: Visão geral das suas estatísticas e progresso

### Tecnologias Utilizadas

#### Frontend (Mobile)
- **React Native** com Expo
- **React Navigation** para navegação
- **React Native Paper** para componentes UI
- **React Native Circular Progress** para timer
- **AsyncStorage** para armazenamento local
- **Axios** para comunicação com API

#### Backend (API)
- **Node.js** com Express
- **Sistema de arquivos JSON** como banco de dados
- **CORS** para comunicação entre frontend e backend
- **Morgan** para logging
- **Helmet** para segurança

## Design

### Paleta de Cores
- **Vermelho Escuro**: `#982829` - Elementos principais e alertas
- **Dourado**: `#d6993c` - Destaques e botões secundários  
- **Verde Escuro**: `#325862` - Elementos de sucesso e navegação
- **Amarelo Claro**: `#f4eaa8` - Fundos e elementos suaves

### Interface
- Design moderno com bordas arredondadas
- Cards dinâmicos com informações em tempo real
- Timer circular interativo
- Temas voltados para programadores

## Estrutura do Projeto

```
Projeto-Bug-t/
├── README.md
├── mobile/                 # Frontend React Native
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── screens/       # Telas da aplicação
│   │   ├── navigation/    # Configuração de navegação
│   │   ├── services/      # Serviços (API, Storage)
│   │   └── utils/         # Utilitários (cores, helpers)
│   ├── assets/           # Imagens e recursos
│   └── README.md         # Documentação do frontend
└── api/                  # Backend Node.js
    ├── routes/          # Rotas da API
    ├── utils/           # Utilitários do backend
    ├── data/            # Arquivos JSON (banco de dados)
    ├── server.js        # Servidor principal
    └── README.md        # Documentação do backend
```

## Como Executar

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI
- Dispositivo móvel ou emulador

### 1. Clone o Repositório
```bash
git clone https://github.com/amand4priscil4/Projeto-Bug-t.git
cd Projeto-Bug-t
```

### 2. Configure o Backend
```bash
cd api
npm install
npm run dev
```
O servidor estará rodando em `http://localhost:3000`

### 3. Configure o Frontend
```bash
cd mobile
npm install
npx expo start
```

### 4. Execute no Dispositivo
- Baixe o app **Expo Go** no seu celular
- Escaneie o QR code que aparece no terminal
- Ou execute no emulador de sua preferência

## Deploy

### Backend
A API está deployada no **Render**:
- URL: `https://bug-t-api.onrender.com`
- Endpoints disponíveis: `/api/tasks`, `/api/diary`, `/api/pomodoro`

### Frontend
O aplicativo React Native pode ser testado via:
- **Expo Go** (desenvolvimento)
- **APK/IPA** (build de produção)
- **Web** (expo web)

## Funcionalidades Detalhadas

### Home Dashboard
- Logo do projeto no topo
- Cards informativos com estatísticas em tempo real
- Dados sincronizados com todas as funcionalidades
- Design responsivo e moderno

### Gerenciamento de Tarefas
- Criação, edição e exclusão de tarefas
- Sistema de prioridades (Alta, Média, Baixa)
- Marcação de conclusão com contador
- Persistência na API

### Timer Pomodoro
- Timer circular visual com progresso
- Sessões de trabalho (25min) e pausa (5min)
- Contador de sessões diárias e totais
- Temas de programação ("Coding Time", "Debug Mode")
- Estatísticas salvas na API

### Diário Técnico
- Entradas com título, conteúdo e tags
- Sistema de humor/mood com emojis
- Edição completa via modal
- Organização cronológica
- Tags categorizadas por cor

## API Endpoints

### Tasks
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Diary
- `GET /api/diary` - Listar entradas
- `POST /api/diary` - Criar entrada
- `PUT /api/diary/:id` - Atualizar entrada
- `DELETE /api/diary/:id` - Deletar entrada

### Pomodoro
- `GET /api/pomodoro/stats` - Estatísticas gerais
- `GET /api/pomodoro/today` - Estatísticas do dia
- `POST /api/pomodoro/sessions` - Criar sessão
- `GET /api/pomodoro/sessions` - Listar sessões

## Para Desenvolvedores

### Contribuindo
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Próximas Funcionalidades
- [ ] Sistema de autenticação
- [ ] Sincronização entre dispositivos
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Exportação de dados
- [ ] Integração com GitHub
- [ ] Relatórios semanais/mensais

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contato

Amanda Priscila - [@amand4priscil4](https://github.com/amand4priscil4)

Link do Projeto: [https://github.com/amand4priscil4/Projeto-Bug-t](https://github.com/amand4priscil4/Projeto-Bug-t)

---
