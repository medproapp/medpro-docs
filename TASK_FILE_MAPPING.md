# Task to File Mapping

This document tracks which tasks in MEDPRO_TASKS_CONSOLIDATED.md correspond to which individual MD files, so updates can be reflected in both places.

## Critical Blockers

### 1. Mobile App - Networking Issue ✅ COMPLETED
- **Main File:** `MEDPRO_TASKS_CONSOLIDATED.md`
- **Child Files:** 
  - `medproapp/docs/STATUS_DESENVOLVIMENTO.md`
  - `medproapp/docs/NETWORKING_RESOLUTION.md`

### 2. Communication System - Patient Search Missing
- **Main File:** `MEDPRO_TASKS_CONSOLIDATED.md`
- **Child Files:**
  - `medprofront/communication/IMPLEMENTACAO-PENDENTE.md`
  - `medprofront/communication/README.md`

### 3. Encounter Creation - Mobile Testing
- **Main File:** `MEDPRO_TASKS_CONSOLIDATED.md`
- **Child Files:**
  - `EXACT_FRONTEND_ENCOUNTER_LOGIC.md`
  - `medproapp/docs/ENCOUNTER_TESTING.md`

### 4. Database Schema - Communication Tables
- **Main File:** `MEDPRO_TASKS_CONSOLIDATED.md`
- **Child Files:**
  - `medprofront/communication/IMPLEMENTACAO-PENDENTE.md`
  - `medproback/docs/DATABASE_SCHEMA.md`

## Module-Specific Files

### Mobile App Development
- **Main Section:** `## 📱 MOBILE APP DEVELOPMENT`
- **Child Files:**
  - `medproapp/docs/STATUS_DESENVOLVIMENTO.md`
  - `medproapp/docs/DESENVOLVIMENTO_MOBILE.md`
  - `medproapp/docs/PLANO_DESENVOLVIMENTO_DETALHADO.md`
  - `medproapp/docs/NETWORKING_RESOLUTION.md`
  - `medproapp/docs/ENCOUNTER_TESTING.md`

### Communication System
- **Main Section:** `## 💬 COMMUNICATION SYSTEM`
- **Child Files:**
  - `medprofront/communication/IMPLEMENTACAO-PENDENTE.md`
  - `medprofront/communication/README.md`

### Patient Management
- **Main Section:** `## 👥 PATIENT MANAGEMENT`
- **Child Files:**
  - `medprofront/patient/PATIENT_MANAGEMENT_ROADMAP.md`
  - `medprofront/patient/registration/ADVANCED_REGISTRATION_PLAN.md`

### Practitioner Dashboard
- **Main Section:** `## 🏥 PRACTITIONER DASHBOARD`
- **Child Files:**
  - `medprofront/practitioner/dashboard/PLANO_TESTE_DASHBOARD.md`
  - `medprofront/practitioner/dashboard/DASHBOARD_IMPROVEMENTS.md`

### Professional Website
- **Main Section:** `## 🌐 PROFESSIONAL WEBSITE`
- **Child Files:**
  - `medprofront/practitioner/website/PLANO_WEBSITE_PROFISSIONAL.md`

### Authentication & Registration
- **Main Section:** `## 🔐 AUTHENTICATION & REGISTRATION`
- **Child Files:**
  - `medprofront/register/MELHORIAS-REGISTRO-LOGIN.md`

### Backend Development
- **Main Section:** `## 🖥️ BACKEND DEVELOPMENT`
- **Child Files:**
  - `medproback/docs/PHASE1_PROGRESS.md`
  - `medproback/docs/PHASE2_PROGRESS.md`
  - `medproback/docs/BACKEND_ENHANCEMENT_PLAN.md`

### Testing & QA
- **Main Section:** `## 🧪 TESTING & QUALITY ASSURANCE`
- **Child Files:**
  - `PLANO_TESTE_DASHBOARD.md`
  - `medprofront/practitioner/mydata/plano-testes-practitioner-mydata.md`
  - `medprofront/checklist-testes-rapido.md`

### Analytics & Logging
- **Main Section:** `## 📊 ANALYTICS & LOGGING`
- **Child Files:**
  - `medprofront/LIMPEZA_LOGS_RESUMO.md`

## Update Process

When a task status changes:

1. **Update Consolidated:** Modify `MEDPRO_TASKS_CONSOLIDATED.md`
2. **Update Child Files:** Reflect changes in corresponding individual MD files
3. **Update Dashboard:** Changes will auto-sync to dashboard
4. **Cross-Reference:** Use this mapping to ensure consistency

## Status Sync Rules

- ✅ COMPLETED tasks should be marked as resolved in child files
- 🔴 CRITICAL/BLOCKING should be prominently marked in child files
- 🟡 HIGH PRIORITY should have clear next steps in child files
- 🟢 MEDIUM/🔵 LOW can have basic status updates

## File Change Detection

Monitor these patterns for updates:
- Status changes: `**Status:** [OLD] → [NEW]`
- Progress updates: `Progress: X% → Y%`
- Task completion: `[ ] → [x]` or `🔴 → ✅`
- New tasks added to any section