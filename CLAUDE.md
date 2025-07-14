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