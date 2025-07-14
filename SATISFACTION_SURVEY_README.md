# Sistema de Pesquisa de Satisfação - Medpro.app

## Visão Geral

Este documento descreve a funcionalidade de pesquisa de satisfação implementada no sistema Medpro.app. O sistema permite:

1. **Criação automática** de pesquisas quando encontros médicos são finalizados
2. **Envio assíncrono** de pesquisas por email ou SMS
3. **Dashboard de monitoramento** para acompanhar estatísticas e respostas
4. **Interface pública** para pacientes responderem às pesquisas

## Arquitetura

### Backend Components

- **`helpers/satisfaction/satisfaction.js`** - Lógica principal para manipulação de pesquisas
- **`routes/satisfaction.js`** - API endpoints para pesquisas de satisfação
- **`workers/satisfaction-worker.js`** - Worker assíncrono para envio de pesquisas
- **`mysql/v2/tables/satisfaction_surveys.sql`** - Esquema da tabela de pesquisas

### Frontend Components

- **`patient/satisfaction/satisfaction-dashboard.html`** - Dashboard principal
- **`patient/satisfaction/satisfaction-dashboard.js`** - Lógica do dashboard
- **`patient/satisfaction/satisfaction-dashboard.css`** - Estilos do dashboard
- **`public/survey/satisfaction-form.html`** - Formulário público de pesquisa
- **`public/survey/satisfaction-form.js`** - Lógica do formulário público
- **`public/survey/satisfaction-form.css`** - Estilos do formulário público

## Banco de Dados

### Tabela: `satisfaction_surveys`

```sql
CREATE TABLE `satisfaction_surveys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `encounter_id` varchar(10) NOT NULL,
  `patient_cpf` varchar(14) NOT NULL,
  `practitioner_id` varchar(100) NOT NULL,
  `status` enum('pending','sent','completed','expired') DEFAULT 'pending',
  `survey_token` varchar(100) NOT NULL,
  `survey_url` varchar(500) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `responses` json DEFAULT NULL,
  `overall_rating` int DEFAULT NULL,
  `communication_rating` int DEFAULT NULL,
  `waiting_time_rating` int DEFAULT NULL,
  `facility_rating` int DEFAULT NULL,
  `recommendation_rating` int DEFAULT NULL,
  `comments` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `survey_token_UNIQUE` (`survey_token`),
  UNIQUE KEY `encounter_id_UNIQUE` (`encounter_id`),
  CONSTRAINT `fk_satisfaction_surveys_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`Identifier`) ON DELETE CASCADE,
  CONSTRAINT `fk_satisfaction_surveys_patient` FOREIGN KEY (`patient_cpf`) REFERENCES `patients` (`cpf`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Fluxo de Funcionamento

### 1. Criação Automática de Pesquisas

Quando um encontro médico é marcado como **"completed"**, o sistema automaticamente:

1. Cria uma nova pesquisa na tabela `satisfaction_surveys`
2. Gera um token único para a pesquisa
3. Define data de expiração (7 dias por padrão)
4. Define status como "pending"

### 2. Envio Assíncrono

O worker de satisfação (`satisfaction-worker.js`) executa periodicamente e:

1. Busca pesquisas com status "pending"
2. Tenta enviar por email (preferencial)
3. Se email falhar ou não disponível, tenta SMS
4. Marca pesquisa como "sent" se bem-sucedida
5. Marca pesquisas expiradas automaticamente

### 3. Resposta do Paciente

O paciente recebe um link único que:

1. Carrega o formulário público de pesquisa
2. Valida se a pesquisa não expirou
3. Permite avaliação em 5 categorias (1-5 estrelas)
4. Aceita comentários opcionais
5. Submete resposta e marca como "completed"

### 4. Dashboard de Monitoramento

Os profissionais podem acessar:

1. **Estatísticas gerais**: total, respondidas, pendentes, expiradas
2. **Gráficos**: médias por categoria, distribuição de notas
3. **Lista detalhada**: todas as pesquisas com filtros
4. **Taxa de resposta**: percentual de pesquisas respondidas

## Instalação e Configuração

### 1. Banco de Dados

Execute o script SQL para criar a tabela:

```bash
mysql -u [username] -p [database] < medproback/mysql/v2/tables/satisfaction_surveys.sql
```

### 2. Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# URL base para links de pesquisa
BASE_URL=http://localhost:3000

# Configurações do worker
SATISFACTION_WORKER_INTERVAL=60000  # Intervalo em ms (padrão: 1 minuto)
SATISFACTION_BATCH_SIZE=10          # Pesquisas processadas por vez

# Configurações de email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key

# Configurações de SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### 3. Iniciar o Worker

Execute o worker em processo separado:

```bash
# Usando o script fornecido
cd medproback/scripts
chmod +x start-satisfaction-worker.sh
./start-satisfaction-worker.sh

# Ou diretamente
cd medproback
node workers/satisfaction-worker.js
```

### 4. Verificação

1. Acesse o dashboard em: `/patient/satisfaction/satisfaction-dashboard.html`
2. Complete um encontro médico para testar o trigger automático
3. Verifique logs do worker para confirmar processamento
4. Teste o formulário público usando um link gerado

## API Endpoints

### Dashboard e Estatísticas

- **GET** `/satisfaction/dashboard?practitioner_id=X` - Estatísticas do dashboard
- **GET** `/satisfaction/surveys?practitioner_id=X` - Lista de pesquisas (com paginação)

### Formulário Público

- **GET** `/satisfaction/survey/:token` - Dados da pesquisa para formulário
- **POST** `/satisfaction/submit` - Submeter resposta da pesquisa

### Worker e Administração

- **POST** `/satisfaction/trigger` - Criar pesquisa manualmente
- **GET** `/satisfaction/pending` - Buscar pesquisas pendentes
- **PUT** `/satisfaction/mark-sent/:id` - Marcar como enviada
- **POST** `/satisfaction/mark-expired` - Marcar pesquisas expiradas

## Estrutura de Dados

### Resposta da Pesquisa

```json
{
  "overall_rating": 5,
  "communication_rating": 4,
  "waiting_time_rating": 3,
  "facility_rating": 5,
  "recommendation_rating": 5,
  "comments": "Excelente atendimento, muito satisfeito!"
}
```

### Estatísticas do Dashboard

```json
{
  "stats": {
    "total_surveys": 150,
    "completed_surveys": 120,
    "pending_surveys": 20,
    "sent_surveys": 25,
    "expired_surveys": 5,
    "avg_overall_rating": 4.2,
    "avg_communication_rating": 4.5,
    // ...
  },
  "ratingDistribution": [
    {"overall_rating": 1, "count": 2},
    {"overall_rating": 2, "count": 5},
    {"overall_rating": 3, "count": 15},
    {"overall_rating": 4, "count": 45},
    {"overall_rating": 5, "count": 53}
  ]
}
```

## Monitoramento e Logs

### Logs do Worker

O worker gera logs detalhados:

```
[SATISFACTION-WORKER] Starting satisfaction survey worker...
[SATISFACTION-WORKER] Processing 5 pending surveys
[SATISFACTION-WORKER] Email sent to patient@email.com for survey 123
[SATISFACTION-WORKER] Survey processing completed: 5 successful, 0 failed
```

### Logs dos Encontros

```
[DEBUG-HELPER: Encounter] Satisfaction survey triggered for encounter ENC-12345678
```

## Troubleshooting

### Problemas Comuns

1. **Pesquisas não sendo criadas**
   - Verificar se encontros estão sendo marcados como "completed"
   - Confirmar que tabela foi criada corretamente
   - Verificar logs de erro nos encontros

2. **Emails/SMS não sendo enviados**
   - Verificar configuração de SendGrid/Twilio
   - Confirmar que worker está executando
   - Verificar logs do worker

3. **Formulário não carregando**
   - Confirmar que rota estática está configurada
   - Verificar se token na URL é válido
   - Confirmar que pesquisa não expirou

### Verificações de Saúde

```sql
-- Verificar pesquisas por status
SELECT status, COUNT(*) FROM satisfaction_surveys GROUP BY status;

-- Verificar pesquisas recentes
SELECT * FROM satisfaction_surveys ORDER BY created_at DESC LIMIT 10;

-- Verificar taxa de resposta
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  ROUND(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as response_rate
FROM satisfaction_surveys;
```

## Próximos Passos

### Melhorias Futuras

1. **Lembretes automáticos** para pesquisas não respondidas
2. **Templates personalizáveis** para emails
3. **Relatórios avançados** com insights de IA
4. **Integração com WhatsApp** para envio de pesquisas
5. **Pesquisas segmentadas** por especialidade médica
6. **Gamificação** para aumentar taxa de resposta

### Escalabilidade

Para ambientes de alta escala, considere:

1. **Redis** para cache de pesquisas
2. **Queue system** mais robusto (Redis Queue, Amazon SQS)
3. **Múltiplos workers** para processamento paralelo
4. **CDN** para servir formulários públicos
5. **Database sharding** para pesquisas antigas

## Suporte

Para dúvidas ou problemas:

1. Verificar logs do sistema
2. Consultar este README
3. Revisar código nos arquivos mencionados
4. Contatar equipe de desenvolvimento

---

**Desenvolvido para Medpro.app - Sistema de Gestão Médica**