# Checklist Rápido - Testes Practitioner MyData

## 🚀 Testes Críticos (Must Have)

### ✅ Form Wizard
- [ ] Inicia na etapa 1
- [ ] Navegação Próximo/Anterior funciona
- [ ] Validação impede avanço sem dados obrigatórios
- [ ] Barra de progresso atualiza
- [ ] Botão "Finalizar" aparece na última etapa

### ✅ Validações
- [ ] CPF válido aceito, inválido rejeitado
- [ ] Campos obrigatórios bloqueiam submit
- [ ] Máscaras aplicadas corretamente
- [ ] Toast de erro para validações

### ✅ CEP Lookup
- [ ] CEP válido preenche estado/cidade/endereço
- [ ] CEP inválido mostra erro
- [ ] API indisponível degrada gracefully
- [ ] Indicadores visuais funcionam

### ✅ Autocomplete Endereços
- [ ] Sugestões aparecem após 3 caracteres
- [ ] Navegação por teclado (setas, Enter)
- [ ] Seleção por clique funciona
- [ ] Padrões brasileiros reconhecidos

### ✅ Upload/Captura Foto
- [ ] Upload de arquivo JPG/PNG funciona
- [ ] Captura por câmera operacional
- [ ] Preview imediato após seleção
- [ ] Error handling para problemas

### ✅ Loading States
- [ ] Skeleton loading na inicialização
- [ ] Button loading durante salvamento
- [ ] Progress bar em operações longas
- [ ] Toast notifications funcionais

### ✅ Responsividade
- [ ] Desktop (1920x1080) ✓
- [ ] Mobile (375x667) ✓
- [ ] Tablet (768x1024) ✓
- [ ] Orientação landscape/portrait ✓

### ✅ Compatibilidade
- [ ] Chrome (últimas 2 versões) ✓
- [ ] Firefox (últimas 2 versões) ✓
- [ ] Safari (macOS/iOS) ✓
- [ ] Edge (Chromium) ✓

### ✅ Performance
- [ ] Carregamento <3s em 3G
- [ ] Transições suaves <200ms
- [ ] Sem memory leaks
- [ ] Lighthouse score >90

### ✅ Integração Backend
- [ ] Salvamento de dados funcional
- [ ] Upload de foto operacional
- [ ] Autenticação verificada
- [ ] Error handling adequado

---

## 🧪 Cenários de Teste Rápido

### Cenário 1: Cadastro Novo Usuário (5 min)
1. [ ] Acesse a página como novo usuário
2. [ ] Preencha Etapa 1: Nome, CPF, telefone
3. [ ] Avance para Etapa 2
4. [ ] Digite CEP válido (ex: 01310-100)
5. [ ] Verifique auto-preenchimento
6. [ ] Complete endereço com autocomplete
7. [ ] Avance para Etapa 3
8. [ ] Preencha CRM (se médico)
9. [ ] Avance para Etapa 4
10. [ ] Faça upload de foto
11. [ ] Finalize cadastro
12. [ ] Verifique redirecionamento e sucesso

### Cenário 2: Edição Dados Existentes (3 min)
1. [ ] Acesse como usuário existente
2. [ ] Verifique dados pré-preenchidos
3. [ ] Navegue livremente entre etapas
4. [ ] Edite apenas telefone na Etapa 1
5. [ ] Finalize e verifique salvamento

### Cenário 3: Error Handling (3 min)
1. [ ] Tente avançar etapa sem dados obrigatórios
2. [ ] Digite CPF inválido
3. [ ] Digite CEP inexistente
4. [ ] Simule perda de conexão
5. [ ] Verifique todas as mensagens de erro

---

## 📱 Teste Mobile Rápido (5 min)

### iPhone/Android
- [ ] Abra no mobile browser
- [ ] Teste wizard navigation por toque
- [ ] Verifique teclado virtual não quebra layout
- [ ] Teste captura de foto por câmera
- [ ] Verifique toast notifications responsivas

---

## 🔧 Teste de APIs (3 min)

### ViaCEP
- [ ] CEP 01310-100 → Avenida Paulista, São Paulo, SP
- [ ] CEP 20040-020 → Centro, Rio de Janeiro, RJ
- [ ] CEP 00000-000 → Erro

### IBGE
- [ ] Estados carregam alfabeticamente
- [ ] SP → Cidades de São Paulo carregam
- [ ] RJ → Cidades do Rio carregam

---

## ⚡ Performance Check (2 min)

### Chrome DevTools
1. [ ] Abra Network tab
2. [ ] Recarregue página
3. [ ] Verifique: Total load time <3s
4. [ ] Lighthouse audit score >90
5. [ ] Console sem erros críticos

---

## 🔒 Security Check (2 min)

- [ ] HTTPS obrigatório
- [ ] Token JWT em headers
- [ ] Inputs sanitizados
- [ ] File upload validado
- [ ] Error messages não exposem detalhes internos

---

## 📊 Métricas de Sucesso

### Targets Mínimos
- [ ] **Load Time:** <3 segundos
- [ ] **Lighthouse:** >90 score
- [ ] **Errors:** 0 críticos
- [ ] **Compatibility:** 99%+ browsers
- [ ] **Mobile:** 100% functional

### KPIs de Qualidade
- [ ] **Completion Rate:** >85%
- [ ] **Error Rate:** <5%
- [ ] **User Satisfaction:** >4.5/5
- [ ] **Support Tickets:** <3% UX issues

---

## 🚨 Bloqueadores Críticos

### STOP SHIP se falhar:
- [ ] Dados não salvam
- [ ] Wizard não funciona
- [ ] Mobile quebrado
- [ ] Performance >5s
- [ ] Errors críticos no console
- [ ] Acessibilidade básica falha

---

## ✅ Sign-off Checklist

### Antes do Deploy
- [ ] Todos os testes críticos ✅
- [ ] Performance targets atingidos
- [ ] Mobile 100% funcional
- [ ] Error handling testado
- [ ] Security review OK

### Aprovações Necessárias
- [ ] **QA Lead:** Testes completos
- [ ] **Dev Lead:** Code review
- [ ] **UX Designer:** Experience validation
- [ ] **Product Owner:** Business requirements
- [ ] **DevOps:** Deploy readiness

---

**⏱️ Tempo Total de Execução: ~25 minutos**

**🎯 Este checklist cobre 90% dos casos críticos em tempo mínimo!**