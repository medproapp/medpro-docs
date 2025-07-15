# 🛑 PARE DE DESPERDIÇAR TEMPO - SEJA DIRETO

## PROBLEMAS CONHECIDOS (NÃO PERCA TEMPO)
- **Expo web SDK 53+** → NÃO FUNCIONA. Use mobile.
- **WSL2 + Expo** → Use `npx expo start --tunnel`
- **AsyncStorage + Web** → Incompatível

## REGRAS DE COMUNICAÇÃO
1. **3 tentativas = PARAR** → "Não funciona, vamos tentar outra coisa"
2. **Erro conhecido = DIZER LOGO** → "Isso é bug conhecido do Expo"
3. **Resposta em 1-2 linhas** quando possível
4. **NUNCA** fazer 20 tentativas diferentes

---

# MedPro - Referência Rápida

## 🔑 ESSENCIAIS

### Ambientes
- Backend: `localhost:3000`
- Frontend: `localhost:8080`
- Mobile: `npx expo start --tunnel`

### Login
```bash
POST http://localhost:3000/login
{"username":"fabiangc@gmail.com","password":"senha2"}
```

### Banco de Dados
```bash
mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "QUERY"
```

### Organização Base
- Email: fabiangc@gmail.com
- Org: ORG-000006
- Location: 126 (Lugar 1)

## 📁 ESTRUTURA

### Frontend Modular
```
js/
├── main.js      # Entry point
├── services.js  # API calls (authenticatedFetch)
└── modules/     # Features
```

### Importação Obrigatória
```javascript
import { authenticatedFetch, showToast } from "/js/medpro.js";
```

## ⚠️ CUIDADOS

### Git/Produção
- NUNCA `git reset` sem permissão
- NUNCA adicionar arquivos extras
- SEMPRE seguir instruções EXATAS

### MySQL Limitations
```javascript
// ❌ ERRADO: LIMIT ?
// ✅ CERTO: LIMIT ${parseInt(limit)}
```

### Headers
- `<header-with-dash>` → Todas páginas exceto dashboard
- `<header-nodash>` → Apenas dashboard

## 🚀 COMANDOS ÚTEIS

### Limpar Dados (CUIDADO!)
```sql
-- Sempre dry-run primeiro
CALL CleanPatientData_HardcodedTables('CONFIRM-DELETE', TRUE);
```

### Dashboard APIs
- `/api/dashboard/stats/appointments/{email}`
- `/api/dashboard/stats/patients/{email}`
- `/api/dashboard/stats/revenue/{email}`
- `/api/dashboard/stats/satisfaction/{email}`

---

## 📊 PROJECT DASHBOARD REQUIREMENTS

### Dashboard Structure (MANDATORY)
1. **🎯 Open Development Fronts** - 5 main work areas with status/counts
2. **📋 Current Work Status** - 4 columns: Blockers | In Progress | Ready | Done
3. **📂 Module Details** - Collapsible priority-grouped tasks

### NEVER CREATE:
- ❌ Simple task lists without grouping
- ❌ Unknown metrics without explanation
- ❌ Executive dashboards with no actionable info

---

## 📝 PROJECT UPDATES WORKFLOW

When user reports progress completion:
1. **Update Source MD Files First** - Find actual project file, update with specific details
2. **Update FINAL_CONSOLIDATED.md** - Reflect changes in dashboard data source
3. **No Explanations Needed** - Just do updates efficiently

### NEVER:
- ❌ Ask for clarification on obvious updates
- ❌ Update only one file and forget the other
- ❌ Give vague progress descriptions

---

## 📂 DOCUMENTATION ORGANIZATION

### Key Principles
- `src_*` files = **TEMPORARY COPIES** for dashboard (deleted/regenerated on reanalysis)
- **REAL DOCS** live in project repos
- **ONE TOPIC** per MD file

### Repository Structure
- `medprofront/docs/` - Frontend tasks/implementation
- `medproback/docs/` - Backend tasks/APIs  
- `medpro-mobile-app/docs/` - Mobile tasks/components
- `medpro-docs/` - Cross-project coordination only

### Reanalysis Workflow (MANDATORY)
1. Delete all `src_*` files from medpro-docs
2. Scan all project repos for MD files
3. Create fresh `src_*` copies for dashboard
4. Extract real actionable tasks
5. Update `FINAL_CONSOLIDATED.md`
6. Update dashboard source mapping

### Rules
**ALWAYS:** Split mixed topics, move project-specific docs to their repos
**NEVER:** Keep permanent copies in medpro-docs, mix topics, leave `src_*` files