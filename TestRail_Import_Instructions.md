# 📋 Guia de Importação TestRail - Funcionalidade de Prescrição

## 🎯 Arquivos Criados:
- `test_cases_testrail_import.csv` - Test cases formatados para importação
- `TestRail_Import_Instructions.md` - Este guia

## 📊 Resumo dos Test Cases:
- **Total:** 25 test cases
- **Críticos:** 8 casos
- **High Priority:** 9 casos  
- **Medium Priority:** 7 casos
- **Low Priority:** 1 caso

### 📁 Estrutura por Seções:
1. **Criação de Prescrição** (4 casos)
2. **Salvamento** (2 casos) 
3. **Geração de PDF** (2 casos)
4. **Assinatura Digital** (2 casos)
5. **Conclusão** (3 casos)
6. **Visualização Concluídas** (3 casos)
7. **Edição Draft** (2 casos)
8. **Reset e Navegação** (2 casos)
9. **Cenários de Erro** (3 casos)
10. **Fluxos Completos** (2 casos E2E)

---

## 🚀 Como Importar no TestRail:

### **Passo 1: Preparar Projeto**
1. Acesse sua instância do TestRail
2. Crie novo projeto: **"MedPro Frontend"**
3. Vá para **Test Cases & Suites**

### **Passo 2: Importar CSV**
1. Clique em **"+ Add"** > **"Import"**
2. Selecione **"CSV"** como formato
3. Faça upload do arquivo `test_cases_testrail_import.csv`

### **Passo 3: Configurar Mapeamento**
Configure o mapeamento das colunas:

| Campo CSV | Campo TestRail |
|-----------|----------------|
| Section | Section |
| Title | Title |
| Type | Type |
| Priority | Priority |
| Estimate | Estimate |
| Preconditions | Preconditions |
| Steps | Steps |
| Expected Result | Expected Result |
| Custom Tags | References/Tags |

### **Passo 4: Configurar Campos Customizados**
Antes de importar, configure estes campos:

#### **Types (Tipos):**
- Functional
- E2E
- Negative

#### **Priorities (Prioridades):**
- Critical
- High
- Medium  
- Low

#### **Custom Fields (Opcional):**
- **Browser:** Chrome, Firefox, Safari, Edge
- **Environment:** Development, Staging, Production
- **Test Data:** Required, Optional, Generated

### **Passo 5: Executar Importação**
1. Clique **"Import"**
2. Verifique preview dos dados
3. Confirme importação

---

## ✅ Verificação Pós-Importação:

### **Checklist:**
- [ ] 25 test cases importados
- [ ] 10 seções criadas corretamente
- [ ] Prioridades atribuídas
- [ ] Steps formatados corretamente
- [ ] Expected Results legíveis

### **Test Cases Críticos para Verificar:**
- TC003: Buscar e Adicionar Medicamento
- TC005: Salvar Prescrição como Rascunho  
- TC007: Gerar PDF de Prescrição
- TC011: Concluir Prescrição Sem Assinatura
- TC012: Concluir Prescrição Com Assinatura
- TC014: Abrir Prescrição Concluída
- TC024: Fluxo Completo E2E

---

## 🎯 Configuração de Test Runs:

### **Test Run 1: Smoke Tests**
Casos críticos para validação rápida:
- TC001, TC003, TC005, TC007, TC011, TC014

### **Test Run 2: Regression Full**
Todos os 25 test cases para validação completa

### **Test Run 3: E2E Scenarios**  
Focado nos fluxos completos:
- TC024, TC025

---

## 📊 Campos Adicionais Recomendados:

### **Configurar no TestRail:**

#### **Test Case Fields:**
- **Automation Status:** Manual, Automated, Candidate
- **Component:** Frontend, Backend, Integration
- **Browser Support:** All, Chrome Only, Firefox Only
- **Mobile Support:** Yes, No, Responsive

#### **Test Result Fields:**
- **Defect Severity:** Blocker, Critical, Major, Minor
- **Environment:** Development, Staging, Production
- **Build Version:** (para tracking)

---

## 🔧 Automação Futura:

### **Casos Candidatos à Automação:**
**Alto Valor:**
- TC003: Buscar e Adicionar Medicamento
- TC005: Salvar Prescrição 
- TC007: Gerar PDF
- TC024: Fluxo Completo E2E

**Ferramentas Recomendadas:**
- **Playwright** (para web apps modernas)
- **Cypress** (alternativa popular)

---

## 📈 Relatórios Sugeridos:

### **Dashboard TestRail:**
1. **Test Execution Progress**
   - % Passed/Failed por prioridade
   - Casos não executados

2. **Defect Analysis**  
   - Bugs por seção
   - Trends de qualidade

3. **Test Coverage**
   - Funcionalidades testadas
   - Gaps de cobertura

---

## 🚨 Troubleshooting Importação:

### **Problemas Comuns:**

#### **Erro: "Invalid CSV format"**
**Solução:** Abrir CSV no Excel e salvar novamente como CSV UTF-8

#### **Erro: "Unknown field type"**
**Solução:** Configurar Types personalizados antes da importação

#### **Steps mal formatados:**
**Solução:** Verificar que quebras de linha usam \n no CSV

#### **Caracteres especiais**
**Solução:** Verificar encoding UTF-8 do arquivo

---

## 📞 Suporte:

### **Se precisar de ajuda:**
1. **Documentação TestRail:** [docs.gurock.com](https://docs.gurock.com)
2. **Suporte TestRail:** support@gurock.com
3. **Ajuda com test cases:** Me consulte para ajustes

---

## 🎉 Próximos Passos:

### **Após Importação:**
1. ✅ Executar **TC001** para validar setup
2. ✅ Rodar **Smoke Tests** (6 casos críticos)
3. ✅ Documentar bugs encontrados
4. ✅ Planejar **Regression Full** (25 casos)
5. ✅ Considerar automação dos casos estáveis

**💡 Dica:** Comece executando os test cases críticos primeiro para validar as funcionalidades principais antes de partir para o teste completo!