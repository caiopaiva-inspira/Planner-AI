# Planner AI - Plano de Desenvolvimento (Roadmap) e Documentação

Este documento centraliza o progresso do projeto **Planner AI** — um sistema inteligente e minimalista de agendamento e gerenciamento de tarefas. O objetivo é rastrear a evolução desde o primeiro MVP até uma aplicação Full-Stack de nível de produção (production-ready).

---

## 🟢 O Que Já Foi Concluído (Status Atual)

### Fase 1: Interface e MVP Inicial (Frontend)
- [x] Estrutura do projeto em **Next.js 14** com App Router.
- [x] Design System minimalista ("Uber/Apple style") focado em usabilidade limpa.
- [x] Componentes Core construídos: `Header`, `CalendarWidget`, `AgendaSection`, `TaskItem`, `EventCard`, `AddModal`.
- [x] **Dark/Light Mode** 100% integrado utilizando a nova feature de theming em conjunto com Tailwind classes explícitas (persistência via `ThemeContext`).
- [x] Responsividade para mobile e desktop.
- [x] Interfaces de navegação intuitiva: Clique duplo e Hover actions.

### Fase 2: Banco de Dados e API (Backend Rápido)
- [x] Integração com provedor de Banco de Dados Serverless: **Supabase** (Postgres).
- [x] Implementação do ORM **Prisma** para gerenciar os Schemas de forma tipada (`User`, `Event`, `Task`).
- [x] Criação de roteamento via **Server Actions** do Next.js (dispensando a necessidade de pastas de API separadas na maioria das chamadas simples).
- [x] **Relacionamento de Dados Finalizado**: CRUD completo (Criar, Ler, Atualizar via Double Click, Deletar via Hover) salvo dinamicamente no Postgres e distribuído por Mês/Ano.

### Fase 3: Autenticação Segura
- [x] Configuração via **Supabase Auth** (E-mail e Senha).
- [x] Tela de Login customizada e minimalista (`LoginPage.tsx`).
- [x] Roteamento de proteção com Middleware (`middleware.ts`). O aplicativo exige sessão ativa e protege o Dashboard e operações de Server Actions.

### Fase 4: Otimização de Estado e Experiência do Usuário (UX)
- [x] Sincronização Server/Client: O app não requer F5 o tempo todo. `useState` atualizando as visualizações junto da base.
- [x] Updates locais instantâneos (*Optimistic UI*) para conclusão/exclusão/edições, conferindo a sensação nativa e instantânea da interface.
- [x] Adição visual de Tarefas Atrasadas/Concluídas: Verificação baseada na hora (`timeEnd`), tornando cartões passados verdes e com badges.

---

## 🟡 Próximos Passos (Pronto Para Início)

### Fase 5: A "Mente" da Inteligência Artificial (Core AI Feature)
*Atualmente a barra inferior ('AIInputBar') simula o funcionamento. O objetivo aqui é dar vida à IA capaz de criar, sugerir ou reagendar itens utilizando linguagem natural pura.*

- [ ] Escolher e configurar o Provedor de LLM (ex: **OpenAI GPT-4o** ou **Google Gemini**).
- [ ] Instalar o ecosistema do **Vercel AI SDK**.
- [ ] Construir o *System Prompt* mestre que force a IA a devolver estruturas tipadas JSON (`Zod` schemas).
  - Exemplo de comportamento: Input -> "Lembrete: amanhã tenho dentista as 14h". O LLM processa, retorna um payload estruturado e chama as *Server Actions* diretamente, preenchendo o dia correto.
- [ ] (Opcional) Funcionalidade "Resumo do Dia": a IA compila as tarefas que o usuário não fez e sugere passar pro próximo dia.

### Fase 6: Mobile e PWA (Progressive Web App)
*Transformar o site web numa experiência real de App instalável em iOS e Android diretamente pelo navegador.*

- [ ] Ajustes finais de Touch e Hitboxes para celulares.
- [ ] Criar o `manifest.json` com cores de tema e definições Standalone.
- [ ] Gerar os ícones de SplashScreen (`app-icons`).
- [ ] Adicionar um **Service Worker** simples para gerenciar caching offline inicial e velocidade de abertura rápida, permitindo adicionar atalho na tela inicial ("Add to Homescreen") com comportamento nativo.

### Fase 7: Futuras Possibilidades (Escala)
- Integração de exportação para **Google Calendar / Apple Calendar**.
- Notificações Web Push (Avisar 10 min antes de um Evento ou lembrar meta de tarefas não feitas).
- Compartilhamento de Agenda e Tarefas com outros usuários da base.
