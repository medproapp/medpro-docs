# Sistema de Comunicação Automática - MedPro

## Visão Geral

O Sistema de Comunicação Automática do MedPro permite que profissionais de saúde configurem e gerenciem comunicações automáticas com pacientes através de múltiplos canais (email, WhatsApp, SMS).

## ✅ Status Geral de Implementação

### 🔧 Backend (100% Completo)
- [x] **API REST** (`/routes/communication.js`)
  - [x] GET `/config` - Configurações do practitioner
  - [x] POST `/config` - Salvar configurações  
  - [x] GET `/templates` - Templates disponíveis
  - [x] POST `/templates` - Criar template customizado
  - [x] GET `/events` - Histórico de eventos
  - [x] GET `/stats` - Estatísticas e métricas
  - [x] POST `/test` - Testar mensagem

- [x] **Helper System** (`/helpers/communication/communication.js`)
  - [x] Geração automática de eventos de aniversário
  - [x] Geração automática de follow-ups
  - [x] Geração automática de wellness checks
  - [x] Sistema de templates com variáveis
  - [x] Validações e sanitização

- [x] **Worker de Processamento** (`/workers/communication-worker.js`)
  - [x] Processamento assíncrono de fila
  - [x] Integração com SendGrid (email)
  - [x] Integração com Twilio (SMS/WhatsApp)
  - [x] Retry logic para falhas
  - [x] Status tracking completo

- [x] **Banco de Dados** (4 tabelas)
  - [x] `communication_config` - Configurações por practitioner
  - [x] `communication_events` - Histórico de eventos
  - [x] `communication_templates` - Templates personalizados
  - [x] `patient_communication_preferences` - Preferências dos pacientes

### 🎨 Frontend Config (100% Completo)
- [x] **Interface de Configuração** (`communication-config.html`)
  - [x] Página principal responsiva
  - [x] Cards para 6 tipos de eventos
  - [x] Modais de configuração detalhada
  - [x] Modal de teste de mensagens
  - [x] Modal de criação de templates

- [x] **Estilos** (`communication-config.css`)
  - [x] Design responsivo
  - [x] Tema consistente com MedPro
  - [x] Animações e transições
  - [x] Estados visuais (ativo/inativo)

- [x] **Lógica JavaScript** (`communication-config-main.js`)
  - [x] Integração com APIs backend
  - [x] Validação de formulários
  - [x] Sistema de notificações
  - [x] Gerenciamento de estado

### ✅ Frontend Dashboard (100% Implementado)
- [x] **Interface de Dashboard** (`communication-dashboard.html`)
  - [x] Layout principal com métricas
  - [x] Área de gráficos
  - [x] Tabela de histórico
  - [x] Filtros e controles
  - [x] Modal de detalhes de eventos
  - [x] Sistema de paginação
  - [x] Funcionalidade de exportação

- [x] **Estilos** (`communication-dashboard.css`)
  - [x] Design responsivo para gráficos
  - [x] Tema consistente com MedPro
  - [x] Classes específicas para dashboard
  - [x] Estados visuais para status
  - [x] Animações e transições
  - [x] Suporte mobile completo

- [x] **Lógica JavaScript** (`communication-dashboard.js`)
  - [x] Integração com API `/stats`
  - [x] Integração com API `/events`
  - [x] Geração de gráficos (Chart.js)
  - [x] Sistema de filtros avançado
  - [x] Busca em tempo real
  - [x] Paginação dinâmica
  - [x] Exportação para CSV
  - [x] Modais interativos

### 🔧 Tipos de Eventos (100% Backend, 100% Frontend Config)
- [x] **Birthday** (Aniversário)
  - [x] Trigger automático por data de nascimento
  - [x] Template padrão configurado
  - [x] Interface de configuração
  
- [x] **Follow Up** (Retorno)
  - [x] Trigger após X dias da última consulta
  - [x] Template padrão configurado
  - [x] Interface de configuração
  
- [x] **Wellness Check** (Check-up)
  - [x] Trigger após X dias sem consulta
  - [x] Template padrão configurado
  - [x] Interface de configuração
  
- [x] **Appointment Reminder** (Lembrete)
  - [x] Trigger antes de consultas agendadas
  - [x] Template padrão configurado
  - [x] Interface de configuração
  
- [x] **No Show Follow Up** (Follow-up de Falta)
  - [x] Trigger após faltas em consultas
  - [x] Template padrão configurado
  - [x] Interface de configuração
  
- [x] **Welcome Message** (Boas-vindas)
  - [x] Trigger após cadastro de paciente
  - [x] Template padrão configurado
  - [x] Interface de configuração

### 📱 Canais de Comunicação (100% Implementado)
- [x] **Email** (SendGrid)
  - [x] Templates HTML
  - [x] Tracking de entrega
  - [x] Configuração via ENV
  
- [x] **WhatsApp** (Twilio)
  - [x] WhatsApp Business API
  - [x] Status de entrega
  - [x] Configuração via ENV
  
- [x] **SMS** (Twilio)
  - [x] SMS básico
  - [x] Status de entrega
  - [x] Configuração via ENV

### 🔐 Autenticação e Segurança (100% Corrigido)
- [x] **JWT Integration**
  - [x] Middleware `verifyJWT` padronizado
  - [x] Correção de JWT secret mismatch
  - [x] Mapping correto `req.user.username`
  
- [x] **Frontend Authentication**
  - [x] Uso correto de `authenticatedFetch`
  - [x] Headers de autorização automáticos
  - [x] Tratamento de erro 401

## Arquitetura do Sistema

### 🏗️ Componentes da Arquitetura

```
Frontend (React/HTML)
├── communication-config.html     ✅ Implementado
├── communication-dashboard.html  ❌ Faltando
└── communication-config.css      ✅ Implementado

Backend (Node.js/Express)
├── /routes/communication.js      ✅ Implementado
├── /helpers/communication/       ✅ Implementado
├── /workers/communication-worker ✅ Implementado
└── /services/                    ✅ Implementado (Twilio, SendGrid)

Database (MySQL)
├── communication_config          ✅ Implementado
├── communication_events          ✅ Implementado
├── communication_templates       ✅ Implementado
└── patient_communication_prefs   ✅ Implementado
```

## 📊 Estrutura do Banco de Dados

### Tabela: `communication_config`
```sql
CREATE TABLE communication_config (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    practitioner_id varchar(255) NOT NULL,
    organization_id varchar(255),
    event_type enum('birthday','follow_up','wellness_check','appointment_reminder','no_show_follow_up','welcome_message') NOT NULL,
    enabled tinyint(1) DEFAULT 1,
    channel enum('email','whatsapp','sms','all') DEFAULT 'all',
    trigger_days int DEFAULT 0,
    send_time time DEFAULT '09:00:00',
    template_id varchar(100),
    custom_message text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: `communication_events`
```sql
CREATE TABLE communication_events (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    practitioner_id varchar(255) NOT NULL,
    patient_id varchar(255) NOT NULL,
    event_type enum('birthday','follow_up','wellness_check','appointment_reminder','no_show_follow_up','welcome_message') NOT NULL,
    trigger_date date NOT NULL,
    scheduled_datetime datetime NOT NULL,
    sent_datetime datetime,
    channel enum('email','whatsapp','sms') NOT NULL,
    recipient_contact varchar(255) NOT NULL,
    message_content text NOT NULL,
    template_id varchar(100),
    status enum('scheduled','sent','failed','cancelled') DEFAULT 'scheduled',
    error_message text,
    delivery_status enum('pending','delivered','read','failed'),
    external_message_id varchar(255),
    metadata json,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: `communication_templates`
```sql
CREATE TABLE communication_templates (
    template_id varchar(100) NOT NULL PRIMARY KEY,
    practitioner_id varchar(255),
    event_type enum('birthday','follow_up','wellness_check','appointment_reminder','no_show_follow_up','welcome_message') NOT NULL,
    channel enum('email','whatsapp','sms') NOT NULL,
    template_name varchar(255) NOT NULL,
    subject_template varchar(500),
    message_template text NOT NULL,
    is_active tinyint(1) DEFAULT 1,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔌 APIs REST Implementadas

### Base URL: `/api/communication`

#### 1. Configurações
- **GET** `/config` - Obter configurações do practitioner
- **POST** `/config` - Salvar configurações

#### 2. Templates
- **GET** `/templates` - Obter templates disponíveis
- **POST** `/templates` - Criar template customizado

#### 3. Eventos
- **GET** `/events` - Obter histórico de eventos (paginado)
- **POST** `/test` - Testar envio de mensagem

#### 4. Estatísticas
- **GET** `/stats` - Obter estatísticas e métricas

### Exemplo de Resposta da API `/stats`:
```json
{
    "success": true,
    "data": {
        "general": {
            "total_events": 245,
            "sent_events": 198,
            "failed_events": 12,
            "scheduled_events": 35,
            "cancelled_events": 0
        },
        "by_event_type": [
            {"event_type": "birthday", "total": 45, "sent": 40},
            {"event_type": "follow_up", "total": 120, "sent": 98}
        ],
        "by_channel": [
            {"channel": "email", "total": 180, "sent": 150},
            {"channel": "whatsapp", "total": 65, "sent": 48}
        ]
    }
}
```

## 🎯 Tipos de Eventos Automáticos

### 1. **Birthday** (Aniversário)
- **Trigger**: Data de aniversário do paciente
- **Configuração**: trigger_days = 0 (no dia)
- **Template padrão**: Mensagem de felicitações

### 2. **Follow Up** (Retorno)
- **Trigger**: X dias após última consulta
- **Configuração**: trigger_days = 30-90 (configurável)
- **Template padrão**: Convite para retorno

### 3. **Wellness Check** (Check-up)
- **Trigger**: X dias sem consulta
- **Configuração**: trigger_days = 90-365 (configurável)
- **Template padrão**: Lembrete de check-up

### 4. **Appointment Reminder** (Lembrete de Consulta)
- **Trigger**: X dias antes da consulta
- **Configuração**: trigger_days = 1-7 (configurável)
- **Template padrão**: Lembrete da consulta

### 5. **No Show Follow Up** (Follow-up de Falta)
- **Trigger**: X dias após falta em consulta
- **Configuração**: trigger_days = 1-3 (configurável)
- **Template padrão**: Reagendamento

### 6. **Welcome Message** (Mensagem de Boas-vindas)
- **Trigger**: Após cadastro do paciente
- **Configuração**: trigger_days = 0 (imediato)
- **Template padrão**: Mensagem de boas-vindas

## 🚀 Worker de Processamento

### `/workers/communication-worker.js`

**Responsabilidades:**
- Gerar eventos automáticos baseados nas configurações
- Processar fila de mensagens agendadas
- Integração com serviços de envio (Twilio, SendGrid)
- Atualizar status de entrega

**Configuração:**
```javascript
processInterval: 300000 // 5 minutos (configurável via ENV)
batchSize: 20 // mensagens por batch (configurável via ENV)
```

**Fluxo de Processamento:**
1. Verificar configurações ativas
2. Gerar novos eventos baseados em triggers
3. Processar eventos agendados para envio
4. Enviar mensagens via serviços externos
5. Atualizar status na base de dados

## 🎨 Interface de Usuário

### ✅ Communication Config (`communication-config.html`)

**Funcionalidades Implementadas:**
- [x] ✅ Configuração de tipos de eventos
- [x] ✅ Seleção de canais (email, WhatsApp, SMS)
- [x] ✅ Configuração de triggers e horários
- [x] ✅ Gerenciamento de templates
- [x] ✅ Teste de mensagens
- [x] ✅ Templates customizáveis com variáveis

**Variáveis de Template Disponíveis:**
- `{{patient_name}}` - Nome do paciente
- `{{doctor_name}}` - Nome do médico
- `{{clinic_name}}` - Nome da clínica
- `{{days_since_last_visit}}` - Dias desde última consulta
- `{{patient_age}}` - Idade do paciente

### ✅ Communication Dashboard (`communication-dashboard.html`)

**Status**: **✅ IMPLEMENTADO**

**Funcionalidades Implementadas:**
- [x] ✅ Dashboard com métricas gerais (4 cards principais)
- [x] ✅ Gráficos por tipo de evento (gráfico pizza) e canal (gráfico barras)
- [x] ✅ Histórico detalhado de eventos com paginação
- [x] ✅ Filtros por período, tipo, canal e busca em tempo real
- [x] ✅ Modal de detalhes para cada evento
- [x] ✅ Visualização responsiva para mobile e desktop
- [x] ✅ Exportação de dados para CSV
- [x] ✅ Atualização automática de métricas

**Link no Menu:**
```html
<!-- Em components/header.js linha 38 -->
<a class="dropdown-item" href="/communication/communication-dashboard.html?navsrc=NAVMENU">
    <i class="fa-solid fa-chart-line me-2"></i>Dashboard de Comunicação
</a>
```

## 🔧 Integrações Externas

### 1. SendGrid (Email)
- **Serviço**: `/services/sendgrid.js`
- **Configuração**: Via ENV variables
- **Features**: Templates HTML, tracking de entrega

### 2. Twilio (SMS/WhatsApp)
- **Serviço**: `/services/twilio.js`
- **Configuração**: Via ENV variables
- **Features**: SMS e WhatsApp Business API

## 🔐 Autenticação

### Middleware: `verifyJWT`
- **Arquivo**: `/auth.js`
- **Token Source**: `req.user.username` (email do practitioner)
- **Headers**: Authorization: Bearer {token}

**Correções Recentes:**
- [x] ✅ Corrigido inconsistência de JWT secret
- [x] ✅ Migrado de custom `authenticateToken` para `verifyJWT` padrão
- [x] ✅ Corrigido mapping de `practitioner_id` para usar email

## 📋 Status de Implementação

### ✅ Componentes Implementados (100%)

#### Backend
- [x] API REST completa (`/routes/communication.js`)
- [x] Helper de comunicação (`/helpers/communication/communication.js`)
- [x] Worker de processamento (`/workers/communication-worker.js`)
- [x] Estrutura de banco de dados (4 tabelas)
- [x] Autenticação JWT integrada

#### Frontend Config
- [x] Interface de configuração (`communication-config.html`)
- [x] Estilos CSS (`communication-config.css`)
- [x] Lógica JavaScript (`communication-config-main.js`)
- [x] Modais para configuração de eventos
- [x] Sistema de templates
- [x] Teste de mensagens

#### Funcionalidades Core
- [x] 6 tipos de eventos automáticos
- [x] 3 canais de comunicação
- [x] Sistema de templates com variáveis
- [x] Processamento assíncrono via worker
- [x] Integração com SendGrid e Twilio
- [x] APIs de estatísticas e histórico

### ❌ Componentes Faltando (Pendentes)

#### Frontend Dashboard
- [ ] Interface de dashboard (`communication-dashboard.html`)
- [ ] Estilos específicos (`communication-dashboard.css`)
- [ ] Lógica JavaScript (`communication-dashboard.js`)
- [ ] Gráficos e visualizações (Chart.js)
- [ ] Filtros e pesquisa avançada

## 🚀 Próximos Passos

### 1. ✅ Dashboard Implementado (Concluído)
```
Arquivos criados:
├── communication-dashboard.html ✅
├── communication-dashboard.css ✅
└── communication-dashboard.js ✅
```

### 2. ✅ Funcionalidades do Dashboard (Concluídas)
- [x] ✅ Métricas em tempo real
- [x] ✅ Gráficos interativos (Chart.js)
- [x] ✅ Tabela de histórico com paginação
- [x] ✅ Filtros por data, tipo, canal, status
- [x] ✅ Exportação de relatórios (CSV)
- [x] ✅ Busca em tempo real
- [x] ✅ Modal de detalhes

### 3. Melhorias Futuras
- [ ] Push notifications para admins
- [ ] Scheduler mais avançado
- [ ] Templates HTML para emails
- [ ] Analytics de engajamento
- [ ] A/B testing de mensagens

## 🐛 Problemas Conhecidos

### ✅ Resolvidos
- [x] **JWT Secret Mismatch**: Routes usavam `JWT_SECRET` diferente do auth principal
- [x] **Authentication Mapping**: `req.user.userId` não existia, corrigido para `req.user.username`
- [x] **403 Forbidden Errors**: Corrigido com standardização do middleware

### ⚠️ Pendentes
- [x] ✅ **404 Dashboard**: ~~Link no menu aponta para arquivo inexistente~~ - RESOLVIDO
- [ ] ⚠️ **Error Handling**: Melhorar tratamento de erros nos workers
- [ ] ⚠️ **Rate Limiting**: Implementar rate limiting para APIs

## 📞 Suporte e Manutenção

### Logs e Debugging
```javascript
// Worker logs
console.log("[COMMUNICATION-WORKER]", message);

// Helper logs  
console.log("[COMMUNICATION-HELPER]", message);

// API logs via Express middleware
```

### Monitoramento
- Status do worker via health check endpoint
- Métricas de performance via `/stats` API
- Logs de erro em tabela `communication_events.error_message`

---

**Última Atualização**: 2025-07-08  
**Status**: ✅ Sistema Completo - Backend + Frontend Config + Frontend Dashboard  
**Progresso**: 100% Implementado  
**Próxima Milestone**: Melhorias e otimizações opcionais

## 🎯 Status Final

### ✅ **COMPLETO - Sistema de Comunicação 100% Funcional**

**Backend (100%)**
- [x] API REST completa com 7 endpoints
- [x] Worker de processamento automático
- [x] Helper system com 6 tipos de eventos
- [x] 4 tabelas de banco implementadas
- [x] Integração com SendGrid e Twilio
- [x] Autenticação JWT corrigida

**Frontend (100%)**
- [x] **Config Interface**: Configuração completa de eventos
- [x] **Dashboard Interface**: Analytics e visualização
- [x] **Mobile Responsive**: Suporte completo
- [x] **Real-time Features**: Atualização automática
- [x] **Export Features**: CSV download

**Problemas Resolvidos (100%)**
- [x] 403 JWT secret mismatch - CORRIGIDO
- [x] Authentication mapping - CORRIGIDO  
- [x] 404 Dashboard file missing - RESOLVIDO
- [x] Menu navigation - FUNCIONAL