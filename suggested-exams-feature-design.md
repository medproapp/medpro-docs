# Suggested Exams Feature - Design & Implementation Plan

## Executive Summary

### Feature Overview
The **Suggested Exams Feature** is an AI-powered system that analyzes encounter data to identify implicit requests for medical exams that were not explicitly added by practitioners using the service request feature. The system uses artificial intelligence to understand clinical context and suggest relevant service requests, allowing practitioners to add them to encounters with one-click confirmation.

### Core Requirements
- **AI Analysis**: Extract implicit exam requests from encounter data (symptoms, diagnoses, medications, physical findings)
- **Clinical Context Understanding**: Analyze comprehensive encounter data for missing diagnostic procedures
- **One-Click Addition**: Create service request drafts without opening modal dialogs
- **Draft Management**: Service requests appear in "registros clínicos" tab for later completion
- **User Review**: Practitioners review AI suggestions before confirming additions

## Infrastructure Analysis: v2prod vs Version3

### v2prod (Production Version 2) Assessment
- **ANS ROL Implementation**: Complete with `/back/routes/diagnostics.js` containing `getAnsRolData` endpoint
- **Service Requests**: Monolithic implementation in `/front/encounter/encounter-request-shared.js`
- **Database**: Uses `anstable` with Fuse.js fuzzy search (threshold 0.3)
- **Architecture**: Direct DOM manipulation, jQuery-based approach
- **AI Integration**: ❌ **Limited/None** - No sophisticated AI analysis capabilities

### Version3 (Current) Assessment
- **ANS ROL Implementation**: Enhanced with caching in `/medproback/src/services/core/diagnosticService.js`
- **Service Requests**: Modular API approach with `/medprofront/encounter/request/request-api.js`
- **AI Integration**: ✅ **Advanced** - Complete AI analysis suite in `/medproback/src/services/ai/analysisHelper.js` (515 lines)
- **Architecture**: Modern ES6+ modules, service-oriented design
- **Clinical Services**: Comprehensive clinical record management in `/medproback/src/services/core/clinicalService.js`

### **Decision: Use Version3 Infrastructure**
**Rationale**: Version3 provides superior architecture with:
1. **Advanced AI Capabilities**: Existing AI analysis infrastructure for clinical conduct evaluation
2. **Better Code Organization**: Modular, maintainable service layers
3. **Enhanced API Design**: Clean abstraction with `authenticatedFetch` wrapper
4. **Comprehensive Features**: Quota-aware AI usage, multimodal analysis, attachment processing

## Technical Architecture

### System Components

#### 1. AI Analysis Engine
**File**: `/medproback/src/services/ai/analysisHelper.js`
- **New Function**: `suggestRelevantExams(encounterData, practitionerId)`
- **Integration**: Leverages existing AI service infrastructure
- **Quota Management**: Uses existing quota-aware AI generation

#### 2. ANS ROL Lookup Service
**Files**: 
- `/medproback/src/services/core/diagnosticService.js` (backend)
- `/medprofront/encounter/request/request-api.js` (frontend)
- **Enhancement**: Intelligent mapping between AI suggestions and ANS categories
- **Existing Features**: Fuzzy search, favorites, pagination, category filtering

#### 3. Service Request Draft Creation
**Files**:
- `/medproback/src/services/core/clinicalService.js` (backend service)
- `/medprofront/encounter/request/request-api.js` (frontend API)
- **Function**: Create draft service requests without modal interaction
- **Integration**: Drafts appear in existing "registros clínicos" tab

#### 4. UI Integration Layer
**File**: `/medprofront/encounter/summary/suggestions-ui.js`
- **Enhancement**: Add exam suggestions display to existing AI analysis UI
- **Features**: Clinical reasoning display, one-click action buttons
- **Status Feedback**: Visual confirmation for draft creation

### Data Flow Architecture

```
Encounter Data → AI Analysis → Exam Suggestions → ANS ROL Lookup → Draft Creation → UI Display
```

1. **Input**: Complete encounter data (symptoms, diagnoses, medications, physical exam)
2. **Processing**: AI analysis to identify missing diagnostic procedures
3. **Mapping**: Match AI suggestions to ANS ROL procedure categories
4. **Creation**: Generate service request drafts with clinical justification
5. **Display**: Present suggestions with one-click confirmation buttons

## Implementation Plan

### Phase 1: AI Prompting Strategy for Exam Extraction
**Duration**: 3-5 days
**Files Modified**: `/medproback/src/services/ai/analysisHelper.js`

#### AI Prompt Design
```javascript
const examSuggestionPrompt = `
Analise os dados do atendimento clínico e identifique exames complementares que poderiam ser clinicamente relevantes mas que NÃO foram explicitamente solicitados.

**DADOS PARA ANÁLISE:**
- Queixa principal e sintomas
- Exame físico realizado
- Diagnósticos estabelecidos
- Medicamentos prescritos
- Exames já solicitados (para evitar duplicação)

**CRITÉRIOS PARA SUGESTÕES:**
1. Relevância clínica baseada em diretrizes médicas
2. Adequação à investigação diagnóstica
3. Monitoramento terapêutico quando aplicável
4. Prevenção e rastreamento apropriados

**FORMATO DE RESPOSTA JSON:**
{
  "suggestedExams": [
    {
      "category": "LAB|IMG|PROCGERAIS|PROCCLIN",
      "examType": "Tipo específico do exame",
      "clinicalReasoning": "Justificativa clínica detalhada",
      "urgency": "routine|urgent|stat",
      "confidence": 0.8,
      "ansSearchTerms": ["termo1", "termo2"]
    }
  ],
  "summary": "Resumo das sugestões e contexto clínico"
}
`;
```

#### Implementation Details
- **Function Name**: `suggestRelevantExams(encounterData, practitionerId)`
- **Input**: Complete encounter object with all clinical data
- **Output**: Structured exam suggestions with ANS search terms
- **Error Handling**: Graceful fallback for AI service failures
- **Quota Management**: Integration with existing quota tracking

### Phase 2: ANS ROL Integration for Exam Lookup
**Duration**: 2-3 days
**Files Modified**: 
- `/medproback/src/services/core/diagnosticService.js`
- `/medprofront/encounter/request/request-api.js`

#### Backend Enhancement
```javascript
async function findAnsRolProcedures(examSuggestions) {
  const results = [];
  for (const suggestion of examSuggestions.suggestedExams) {
    const ansData = await searchAnsRolData({
      filter: suggestion.ansSearchTerms.join(' '),
      grupo: suggestion.category,
      page: 1,
      limit: 5
    });
    results.push({
      ...suggestion,
      ansMatches: ansData.result,
      bestMatch: ansData.result[0] // Highest scored match
    });
  }
  return results;
}
```

#### Frontend API Integration
```javascript
export async function fetchExamSuggestions(encounterId, encounterData) {
  const url = `${API_BASE_CLINICAL}/suggest-exams/${encounterId}`;
  const { data, status } = await authenticatedFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encounterData })
  });
  
  if (status !== 200) {
    throw new Error(`Failed to fetch exam suggestions (Status: ${status})`);
  }
  return data;
}
```

### Phase 3: One-Click Service Request Draft Creation
**Duration**: 3-4 days
**Files Modified**:
- `/medproback/src/services/core/clinicalService.js`
- `/medprofront/encounter/request/request-api.js`

#### Backend Service Enhancement
```javascript
async function createServiceRequestDraft(examSuggestion, encounterData) {
  const clinicalObject = {
    type: "ServiceRequest",
    status: "draft", // Key: Creates as draft
    patient: encounterData.patient,
    encounter: encounterData.identifier,
    practitioner: encounterData.practitioner,
    date: moment().format("YYYY-MM-DD HH:mm:ss"),
    metadata: JSON.stringify({
      servicerequestCategory: examSuggestion.category,
      servicerequestItems: [examSuggestion.bestMatch],
      aiGenerated: true,
      clinicalReasoning: examSuggestion.clinicalReasoning,
      confidence: examSuggestion.confidence,
      urgency: examSuggestion.urgency
    })
  };
  
  return await saveClinicalRecord(clinicalObject);
}
```

#### Frontend API Integration
```javascript
export async function createExamDraft(suggestionId, encounterId) {
  const url = `${API_BASE_CLINICAL}/create-exam-draft`;
  const { data, status } = await authenticatedFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suggestionId, encounterId })
  });
  
  if (status !== 201) {
    throw new Error(`Failed to create exam draft (Status: ${status})`);
  }
  return data;
}
```

### Phase 4: UI Integration
**Duration**: 2-3 days
**Files Modified**: `/medprofront/encounter/summary/suggestions-ui.js`

#### UI Component Enhancement
```javascript
function displayExamSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) return '';
  
  const suggestionsHtml = suggestions.map((suggestion, index) => `
    <div class="exam-suggestion-card mb-3" data-suggestion-id="${index}">
      <div class="card">
        <div class="card-body">
          <h6 class="card-title">
            <i class="fas fa-lightbulb text-warning me-2"></i>
            Sugestão: ${suggestion.examType}
          </h6>
          <p class="card-text small">
            <strong>Categoria:</strong> ${suggestion.category}<br>
            <strong>Justificativa:</strong> ${suggestion.clinicalReasoning}
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
              Confiança: ${Math.round(suggestion.confidence * 100)}%
            </small>
            <button class="btn btn-primary btn-sm add-exam-draft" 
                    data-suggestion-id="${index}">
              <i class="fas fa-plus me-1"></i>Adicionar à Solicitação
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  return `
    <div class="exam-suggestions-section mt-4">
      <h5><i class="fas fa-robot me-2"></i>Sugestões de Exames</h5>
      ${suggestionsHtml}
    </div>
  `;
}
```

## API Specifications

### New Backend Endpoints

#### 1. POST `/clinical/suggest-exams/:encounterId`
**Purpose**: Generate AI-powered exam suggestions for an encounter
**Input**: 
```json
{
  "encounterData": {
    "identifier": "ENC-123456",
    "patient": "12345678901",
    "practitioner": "pract@example.com",
    "chiefComplaint": "Dor abdominal",
    "physicalExam": { /* exam data */ },
    "diagnoses": [ /* diagnosis array */ ],
    "medications": [ /* medication array */ ],
    "existingRequests": [ /* existing service requests */ ]
  }
}
```
**Output**:
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "suggestion-1",
      "category": "LAB",
      "examType": "Hemograma completo",
      "clinicalReasoning": "Avaliação inicial para quadro de dor abdominal...",
      "urgency": "routine",
      "confidence": 0.85,
      "ansMatches": [
        {
          "procedimento": "HEMOGRAMA COMPLETO",
          "hash": "hash123",
          "grupo": "LAB"
        }
      ]
    }
  ],
  "summary": "Identificadas 3 sugestões de exames relevantes..."
}
```

#### 2. POST `/clinical/create-exam-draft`
**Purpose**: Create a service request draft from an AI suggestion
**Input**:
```json
{
  "suggestionId": "suggestion-1",
  "encounterId": "ENC-123456",
  "selectedAnsItem": {
    "procedimento": "HEMOGRAMA COMPLETO",
    "hash": "hash123"
  }
}
```
**Output**:
```json
{
  "success": true,
  "draftId": "CLI-000123",
  "message": "Solicitação criada como rascunho"
}
```

### Frontend API Integration

#### New Functions in `/medprofront/encounter/request/request-api.js`
```javascript
export async function fetchExamSuggestions(encounterId, encounterData);
export async function createExamDraft(suggestionId, encounterId, selectedAnsItem);
export async function getSuggestionStatus(suggestionId);
```

## Database Schema Considerations

### Existing Tables (No Changes Required)
- **`clinicalrecord`**: Stores service request drafts with `status = 'draft'`
- **`anstable`**: ANS ROL procedure lookup data
- **`encounters`**: Encounter data for AI analysis

### New Fields in Existing Tables
- **`clinicalrecord.metadata`**: Enhanced to include:
  ```json
  {
    "aiGenerated": true,
    "clinicalReasoning": "Justificativa clínica da IA",
    "confidence": 0.85,
    "suggestionId": "suggestion-1",
    "urgency": "routine"
  }
  ```

## User Workflow

### Practitioner Experience
1. **Encounter Completion**: Practitioner completes encounter documentation
2. **AI Analysis Trigger**: System automatically analyzes encounter data
3. **Suggestion Display**: AI suggestions appear in encounter summary with clinical reasoning
4. **Review Process**: Practitioner reviews each suggestion with confidence scores
5. **One-Click Addition**: Single click creates draft service request
6. **Draft Management**: Drafts appear in "registros clínicos" tab
7. **Final Review**: Practitioner completes drafts with additional details if needed

### System Workflow
```
User completes encounter → AI analyzes data → Generate suggestions → 
Map to ANS ROL → Display with reasoning → User clicks "Add" → 
Create draft → Update UI → Draft available in clinical records
```

## Testing Strategy

### Unit Tests
- **AI Analysis Function**: Test prompt generation and response parsing
- **ANS ROL Mapping**: Test suggestion-to-procedure matching
- **Draft Creation**: Test service request draft generation
- **API Endpoints**: Test all new backend endpoints

### Integration Tests
- **End-to-End Workflow**: Complete suggestion-to-draft flow
- **UI Integration**: Test suggestion display and interaction
- **Error Handling**: Test AI service failures and fallbacks
- **Authentication**: Test with different practitioner permissions

### User Acceptance Testing
- **Clinical Relevance**: Validate suggestion accuracy with medical professionals
- **Usability**: Test one-click workflow efficiency
- **Performance**: Test with large encounter datasets

## Deployment Considerations

### Rollout Strategy
1. **Phase 1**: Backend API deployment with feature flag
2. **Phase 2**: Limited frontend rollout to selected practitioners
3. **Phase 3**: Full deployment with monitoring
4. **Phase 4**: Performance optimization based on usage patterns

### Monitoring & Analytics
- **AI Suggestion Accuracy**: Track practitioner acceptance rates
- **Performance Metrics**: API response times and error rates
- **Usage Patterns**: Most suggested exam types and categories
- **Clinical Impact**: Measure improvement in diagnostic completeness

### Configuration
- **AI Model Selection**: Configurable model choice (gpt-4o vs gpt-4o-mini)
- **Confidence Thresholds**: Adjustable minimum confidence for suggestions
- **Category Filters**: Enable/disable suggestion categories per specialty
- **Rate Limiting**: AI quota management per practitioner

## Development Timeline

### Week 1-2: AI Prompting Strategy (Phase 1)
- Design and implement AI prompts for exam suggestion
- Add `suggestRelevantExams` function to analysisHelper
- Unit tests for AI analysis function

### Week 3: ANS ROL Integration (Phase 2)
- Enhance ANS ROL lookup with suggestion mapping
- Frontend API integration for suggestions
- Integration tests for ANS matching

### Week 4-5: Draft Creation Workflow (Phase 3)
- Implement draft creation backend service
- Frontend API for one-click draft creation
- Integration with existing clinical records system

### Week 6: UI Integration (Phase 4)
- Enhance suggestions UI with exam suggestions display
- Implement one-click action buttons
- End-to-end testing and bug fixes

### Week 7: Testing & Deployment
- User acceptance testing
- Performance optimization
- Production deployment with monitoring

## Conclusion

The Suggested Exams Feature leverages Version3's superior infrastructure to provide AI-powered diagnostic suggestions that enhance clinical decision-making. By building on existing ANS ROL lookup, service request creation, and AI analysis capabilities, the implementation minimizes new code while maximizing functionality.

The modular design ensures maintainability and scalability, while the one-click workflow improves practitioner efficiency. The comprehensive testing strategy and phased deployment approach minimize risk while ensuring clinical accuracy and user satisfaction.

---

**Document Version**: 1.0  
**Created**: 2025-07-30  
**Author**: Claude AI Assistant  
**Status**: Design Complete - Ready for Implementation