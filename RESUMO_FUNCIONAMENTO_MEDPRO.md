# Resumo do Funcionamento - MedPro

## 1. Visão Geral

O **MedPro** é uma plataforma completa de gestão médica que oferece prontuário eletrônico, agendamento de consultas, comunicação com pacientes e ferramentas de análise para profissionais de saúde.

### Principais Usuários:
- **Profissionais de Saúde** (médicos, enfermeiros, etc.)
- **Assistentes** (secretários, auxiliares)
- **Pacientes** (portal próprio para consultas)
- **Administradores** (gestão de organizações)

### Propósito:
Digitalizar e otimizar o fluxo de trabalho em clínicas e consultórios médicos, oferecendo uma solução integrada para gestão de pacientes, agendamentos, prontuário eletrônico e comunicação.

## 2. Arquitetura Geral

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    MySQL    ┌─────────────────┐
│   @medprofront  │ ◄─────────────► │   @medproback   │ ◄─────────► │   Database      │
│   (Frontend)    │                 │   (Backend)     │             │   (medpro)      │
└─────────────────┘                 └─────────────────┘             └─────────────────┘
```

### **Frontend** (@medprofront)
- **Tecnologia**: HTML5, CSS3, JavaScript (ES6+), Bootstrap
- **Arquitetura**: SPA (Single Page Application) modular
- **Comunicação**: APIs REST via `authenticatedFetch()`

### **Backend** (@medproback)
- **Tecnologia**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Estrutura**: Rotas + Services + Helpers

### **Banco de Dados**
- **Sistema**: MySQL
- **Estrutura**: Organizacional (Organization → Groups → Users)
- **Principais tabelas**: users, practitioners, patients, appointments, encounters

## 3. Módulos Principais do Frontend

### 3.1 Dashboard Principal (`@medprofront/practitioner/dashboard/`)
- **Finalidade**: Painel principal do profissional
- **Funcionalidades**: 
  - Estatísticas em tempo real (pacientes, consultas, receita)
  - Próximos agendamentos
  - Aniversariantes da semana
  - Notificações e alertas
- **Arquivos principais**: `pract-dashboard.html`, `pract-dashboard.js`

### 3.2 Gestão de Pacientes (`@medprofront/patient/`)
- **Finalidade**: Cadastro e gestão completa de pacientes
- **Módulos**:
  - **Registration**: Cadastro de novos pacientes
  - **Dashboard**: Prontuário completo do paciente
  - **List**: Listagem e busca de pacientes
  - **Satisfaction**: Pesquisas de satisfação
- **Funcionalidades**: Upload de fotos, QR codes, histórico médico

### 3.3 Sistema de Agendamentos (`@medprofront/appointment/`)
- **Finalidade**: Gestão completa de consultas
- **Módulos**:
  - **Create**: Criação de novos agendamentos
  - **List**: Listagem de consultas
  - **FullAgenda**: Visualização em calendário
  - **Open**: Abertura de consultas específicas

### 3.4 Encontros Médicos (`@medprofront/encounter/`)
- **Finalidade**: Prontuário eletrônico e documentação médica
- **Funcionalidades**:
  - **Start**: Início de consulta
  - **Recording**: Gravação de áudio
  - **Summary**: Resumos gerados por IA
  - **Attachments**: Anexos e imagens
  - **Medications**: Prescrições
  - **Diagnostics**: Exames e diagnósticos

### 3.5 Comunicação (`@medprofront/communication/`)
- **Finalidade**: Comunicação externa (WhatsApp/Email)
- **Funcionalidades**: 
  - Configuração de templates
  - Envio automatizado de mensagens
  - Dashboard de comunicação

### 3.6 Portal do Assistente (`@medprofront/assistant/`)
- **Finalidade**: Interface simplificada para assistentes
- **Funcionalidades**: Agendamentos, checkin de pacientes, suporte básico

## 4. APIs do Backend

### 4.1 Autenticação e Usuários (`@medproback/routes/login.js`)
```javascript
POST /login                    // Login de usuários
POST /logout                   // Logout
GET  /verify-token             // Verificação de token JWT
```

### 4.2 Profissionais (`@medproback/routes/practitioner.js`)
```javascript
GET    /pract/getmydata        // Dados do profissional
POST   /pract/savemydata       // Salvar dados
GET    /pract/getmyphoto       // Foto do profissional
POST   /pract/savemyphoto      // Upload de foto
GET    /pract/getservicetypes  // Tipos de serviço
```

### 4.3 Pacientes (`@medproback/routes/patient.js`)
```javascript
GET    /patient/:id            // Dados do paciente
POST   /patient/save           // Cadastrar/atualizar paciente
GET    /patient/search         // Buscar pacientes
POST   /patient/upload-photo   // Upload de foto
GET    /patient/getbirthdayscurrentweek  // Aniversariantes
```

### 4.4 Agendamentos (`@medproback/routes/appointment.js`)
```javascript
GET    /appointment/getnextappointments     // Próximos agendamentos
POST   /appointment/create                  // Criar agendamento
PUT    /appointment/update/:id              // Atualizar
DELETE /appointment/cancel/:id              // Cancelar
```

### 4.5 Consultas (`@medproback/routes/encounter.js`)
```javascript
POST   /encounter/start        // Iniciar consulta
PUT    /encounter/update/:id   // Atualizar consulta
POST   /encounter/finish       // Finalizar consulta
GET    /encounter/getLastEncounters  // Últimas consultas
```

### 4.6 Estatísticas (`@medproback/routes/dashboard-stats.js`)
```javascript
GET /api/dashboard/stats/appointments/:practId  // Estatísticas de agendamentos
GET /api/dashboard/stats/patients/:practId      // Estatísticas de pacientes
GET /api/dashboard/stats/revenue/:practId       // Estatísticas de receita
GET /api/dashboard/stats/satisfaction/:practId  // Pesquisas de satisfação
```

### 4.7 Anexos e Arquivos (`@medproback/routes/attachments.js`)
```javascript
POST /attachments/uploadToAzure    // Upload para Azure Blob Storage
GET  /attachments/getinfo/:id      // Informações do arquivo
POST /attachments/getblob          // Download de arquivo
```

## 5. Fluxo de Dados e Autenticação

### 5.1 Sistema de Autenticação
```javascript
// 1. Login do usuário
POST /login { email, password }
→ Retorna: { token, user_data, permissions }

// 2. Armazenamento no Frontend
sessionStorage.setItem('token', jwt_token)
sessionStorage.setItem('email', user_email)

// 3. Requests autenticados
authenticatedFetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 5.2 Estrutura Organizacional
```
Organization (ORG-000006)
├── EntityGroup (ETG-000043)
├── GroupMembers
│   ├── Admin (role: owner)
│   ├── Practitioners (role: pract)
│   └── Assistants (role: member)
└── Patients (managingOrganization)
```

### 5.3 Fluxo de Dados Típico
```
1. Usuário acessa dashboard
   ↓
2. Frontend chama APIs de estatísticas
   ↓
3. Backend valida JWT token
   ↓
4. Backend consulta MySQL por organização
   ↓
5. Dados retornados e exibidos na tela
```

## 6. Principais Funcionalidades

### 6.1 Dashboard Estatístico
- **Compromissos Hoje**: Contagem de consultas do dia
- **Pacientes**: Total e estatísticas de crescimento
- **Receita**: Faturamento mensal e tendências
- **Satisfação**: Médias das pesquisas de pacientes

### 6.2 Prontuário Eletrônico
- **Histórico do Paciente**: Consultas anteriores
- **Prescrições**: Medicamentos prescritos
- **Exames**: Upload e visualização de resultados
- **Anexos**: Imagens, PDFs, documentos
- **IA Integration**: Resumos automáticos via OpenAI

### 6.3 Sistema de Agendamentos
- **Calendário Visual**: Visualização mensal/semanal
- **Tipos de Consulta**: Rotina, primeira consulta, retorno
- **Status**: Agendado, confirmado, em andamento, concluído
- **Notificações**: WhatsApp e Email automáticos

### 6.4 Comunicação com Pacientes
- **Templates**: Mensagens pré-configuradas
- **Canais**: WhatsApp, Email, SMS
- **Automação**: Lembretes de consulta, follow-ups
- **Pesquisas**: Satisfação pós-consulta

### 6.5 Gestão de Usuários
- **Tipos**: Admin, Practitioner, Assistant
- **Permissões**: Baseadas em organização e função
- **Multi-tenancy**: Isolamento por organização

## 7. Tecnologias e Dependências

### Frontend:
- **Framework**: Vanilla JavaScript + Bootstrap 5
- **UI Components**: Font Awesome, OwlCarousel
- **Charts**: Chart.js (para gráficos)
- **PDF**: PDF.js (visualização)
- **Audio**: Howler.js (gravações)

### Backend:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL + mysql2
- **Authentication**: jsonwebtoken
- **File Upload**: multer + Azure Blob Storage
- **External APIs**: OpenAI, Twilio (WhatsApp)

### Infraestrutura:
- **Servidor**: Linux (WSL2 para desenvolvimento)
- **Proxy**: Nginx
- **Process Manager**: PM2
- **SSL**: Let's Encrypt

## 8. Estrutura de Arquivos

```
medpro/
├── @medprofront/           # Frontend web application
│   ├── practitioner/       # Módulo dos profissionais
│   ├── patient/            # Gestão de pacientes
│   ├── appointment/        # Sistema de agendamentos
│   ├── encounter/          # Consultas médicas
│   ├── communication/      # Comunicação externa
│   ├── assistant/          # Portal do assistente
│   ├── js/                 # Scripts compartilhados
│   └── css/                # Estilos globais
│
└── @medproback/            # Backend API server
    ├── routes/             # Definições de rotas
    ├── src/services/       # Lógica de negócio
    ├── middleware/         # Middlewares Express
    └── mysql/              # Scripts de banco
```

## 9. Próximos Desenvolvimentos

### Em Planejamento:
- **Comunicação Interna**: Sistema de mensagens entre usuários
- **Telemedicina**: Consultas por vídeo
- **Mobile App**: Aplicativo nativo
- **BI/Analytics**: Dashboard avançado de análises
- **API Gateway**: Centralização de APIs

---

*Este documento fornece uma visão geral do funcionamento do MedPro. Para detalhes técnicos específicos, consulte a documentação individual de cada módulo.*