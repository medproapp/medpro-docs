# MedPro - Referência Rápida

## 🔑 ESSENCIAIS

### Ambientes & Login
- Backend: `localhost:3333` | Frontend: `localhost:8080`
- Login: `POST /login {"username":"fabiangc@gmail.com","password":"senha2"}`
- **ADMIN SERVER**: `localhost:4040` | Login: `POST /api/v1/auth/login {"email":"demo@medpro.com","password":"demo123"}`
- DB: `mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "QUERY"`
- Org: fabiangc@gmail.com | ORG-000006 | Location: 126

### Importação Obrigatória
```javascript
import { authenticatedFetch, showToast, appState } from "/js/medpro.js";
```

## ⚠️ PADRÕES CRÍTICOS

### 🚨 CHAMADAS DE API (NUNCA ERRE MAIS!)
```javascript
// ❌ ERRADO: window.location.origin, this.serverHost, localhost:8080
// ✅ CORRETO: SEMPRE usar appState.serverHost

const response = await authenticatedFetch(`${appState.serverHost}/api/endpoint`, {
    method: 'POST', // GET/PUT/DELETE
    body: { postData: data }
});

if (response.data?.success) {
    showToast("Success!", "success");
} else {
    showToast(`Error: ${response.data?.message}`, "error");
}
```

### authenticatedFetch (20+ ERROS EVITADOS)
- **Backend:** `localhost:3333` (config: `serverhost`)  
- **Frontend:** `localhost:8080` (config: `clienthost`)
- **SEMPRE:** `appState.serverHost` para APIs
- **NUNCA:** `window.location.origin` ou hardcode
- **CORS:** Se header `operation` falhar, backend precisa configurar

## 🚫 CRITICAL FRONTEND ARCHITECTURE RULES - NEVER BREAK AGAIN!

### 🔥 CSS & HTML STRUCTURE - MANDATORY APPROACH

**CRITICAL RULE: NEVER FORCE CSS OVERRIDES - COPY WORKING PAGE STRUCTURE EXACTLY**

**❌ WRONG APPROACH (REPEATED MISTAKE - STOP!):**
- Adding custom `<style>` blocks with `!important` declarations
- Forcing `font-family` on elements with aggressive CSS
- Assuming `custom.min.css` or `custom.css` need overriding  
- Creating CSS hacks instead of following architecture

**✅ RIGHT APPROACH (ALWAYS DO THIS):**
1. **Find a working page** with the same functionality/layout
2. **Copy the EXACT HTML head structure** - same order, same imports
3. **Copy the EXACT CSS loading sequence** - no modifications
4. **Let the existing architecture work naturally** - no forcing

**Why this works:** 
- MedPro has established CSS architecture that handles fonts, dropdowns, etc.
- Working pages already solved these problems correctly
- The global CSS (`custom.css`, `style.css`, Google Fonts) work together properly
- Forcing CSS breaks the cascade and creates conflicts

**Examples of CORRECT structure copying:**
- Dashboard: `/practitioner/dashboard/pract-dashboard.html` ✅
- Queue Dashboard: `/practitioner/checkin/dashboard/queue-dashboard.html` ✅  
- Patient List: `/patient/list/patient-list.html` ✅

**This mistake was repeated 3+ times - NEVER AGAIN!**

### 🚨 FONT OVERRIDES - ABSOLUTE FORBIDDEN PRACTICE!

**CRITICAL RULE: NEVER OVERRIDE FONT PROPERTIES IN CUSTOM CSS**

**❌ FORBIDDEN PROPERTIES IN CUSTOM CSS (CAUSES HEADER FONT ISSUES):**
- `font-size: XXX` - Breaks MedPro's responsive font system
- `font-weight: XXX` - Overrides global typography hierarchy  
- `font-family: XXX` - Conflicts with Google Fonts loading
- ANY font-related property that forces styling

**✅ CORRECT APPROACH - LET MEDPRO HANDLE FONTS:**
1. **NEVER add font properties** to your custom CSS files
2. **Use semantic HTML classes** that MedPro already styles properly
3. **Only set colors, margins, padding, layout** - NO FONTS!
4. **If you need different font styling**, create NEW CSS classes, don't override existing ones

**Why this is critical:**
- MedPro's global CSS (`custom.css`, `style.css`) handles all typography
- Font overrides break header navigation, dropdown arrows, and menu fonts
- Google Fonts loading sequence gets disrupted by forced font properties
- Responsive font scaling stops working when overridden

**Example of FORBIDDEN vs CORRECT CSS:**
```css
/* ❌ FORBIDDEN - Breaks header fonts */
.patient-name {
    font-size: 0.9rem;    /* NEVER DO THIS */
    font-weight: 600;     /* NEVER DO THIS */
    color: #2c3e50;       /* OK */
    margin: 0 0 0.25rem 0; /* OK */
}

/* ✅ CORRECT - Let MedPro handle fonts */
.patient-name {
    color: #2c3e50;       /* OK - colors allowed */
    margin: 0 0 0.25rem 0; /* OK - layout allowed */
    /* NO FONT PROPERTIES - let global CSS handle it */
}
```

**This font override mistake was repeated 5+ times and broke header functionality every time - NEVER AGAIN!**

## 🚫 CRITICAL DEBUGGING RULES - NEVER BREAK AGAIN!

### 🔥 API ENDPOINT FIXES - MANDATORY STEPS
**BEFORE changing ANY API endpoint, ALWAYS:**

1. **TEST FIRST**: Use curl with valid token to test EXACT endpoints:
   ```bash
   TOKEN=$(curl -X POST -H "Content-Type: application/json" -d '{"username":"user@demo.app","password":"senha2"}' "http://localhost:3333/login" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
   curl -H "Authorization: Bearer $TOKEN" "http://localhost:3333/EXACT/ENDPOINT/PATH"
   ```

2. **CHECK ROUTE MOUNTING**: Never guess paths - check serverStartupService.js:
   ```bash
   grep -A 5 -B 5 "practitioner.*path" src/services/utils/serverStartupService.js
   # practitioner routes mounted at /pract/, NOT /practitioner/
   ```

3. **VERIFY ACTUAL ROUTES**: Check what endpoints exist:
   ```bash
   grep -r "router.get.*endpoint" routes/
   ```

### 🚨 AUTHENTICATION RULES
**NEVER use fetch() - ALWAYS use authenticatedFetch():**

```javascript
// ❌ WRONG - Manual auth headers
const response = await fetch(`${serverHost}/endpoint`, {
    headers: { 'Authorization': `Bearer ${token}` }
});

// ✅ CORRECT - Use MedPro's authenticatedFetch
const response = await authenticatedFetch(`${serverHost}/endpoint`);

// ✅ CORRECT - Handle MedPro response format
if (response && response.data) {
    // Handle response.data, NOT response.json()
}
```

### 🔥 BACKEND AUTH CONSISTENCY - CRITICAL ISSUE (REPEATED 10+ TIMES!)

**⚠️ MANDATORY CHECK: All methods in same route MUST use same req.user field**

**THE MISTAKE (STOP REPEATING!):**
```javascript
// ❌ INCONSISTENT AUTH - CAUSES 401 ERRORS
router.post("/", verifyJWT, (req, res) => {
    const practitionerId = req.user?.email;  // Uses EMAIL
});

router.get("/", verifyJWT, (req, res) => {
    const practitionerId = req.user?.username;  // Uses USERNAME - INCONSISTENT!
});
```

**BEFORE touching ANY backend route:**
1. **Check ALL methods** (GET, POST, PUT, DELETE) in the route file
2. **Verify consistent user identification** across all methods  
3. **Look for this exact pattern**: `req.user?.email` vs `req.user?.username`
4. **Standardize to ONE field** across the entire route file

**Common symptoms:**
- GET works (returns data) but POST fails (401 Unauthorized)
- Some methods work, others return 401
- Frontend code is correct but backend rejects requests

**Fix pattern:**
```javascript
// ✅ CONSISTENT - All methods use same field
const practitionerId = req.user?.username; // OR req.user?.email - but SAME everywhere
```

**This mistake was repeated in:** offerings.js, practitioner.js, multiple other routes
**NEVER AGAIN - Always check consistency first!**

### 💀 RESPONSE STRUCTURE TRAPS
**MedPro APIs have nested responses - CHECK STRUCTURE:**

```javascript
// Common structures:
response.data.serviceCategoryList  // Single nested
response.data.data.serviceCategoryList  // Double nested - CHECK LOGS!

// ALWAYS add debug logs to verify:
console.log('Response structure:', response.data);
```

### ⚡ DEBUGGING EFFICIENCY
1. **Add debug logs IMMEDIATELY** - don't guess data structures
2. **Test each API individually** with curl BEFORE coding
3. **Check console logs** for exact error messages (403 vs 404)
4. **Never change multiple things at once** - fix one endpoint at a time

### 🚨 CRITICAL DEBUGGING RULE - NEVER WASTE TIME AGAIN!

**When API returns empty/wrong data but you KNOW database has data:**

**STEP 1: READ THE FUCKING LOGS FIRST!**
```bash
tail -50 /path/to/server/logs/combined-YYYY-MM-DD.log | grep -E "(error|ERROR|failed)"
```

**STEP 2: If you see SQL syntax errors - FIX THE SQL IMMEDIATELY!**
- Don't debug auth, connections, or environment setup
- Don't waste time on authentication or server management  
- **THE LOGS TELL YOU THE EXACT PROBLEM**

**STEP 3: Fix ORDER BY and GROUP BY syntax:**
```sql
# ❌ WRONG - alias in ORDER BY fails in some MySQL versions
SELECT DATE_FORMAT(timestamp, '%H:%i') as hour_minute
GROUP BY DATE_FORMAT(timestamp, '%H:%i')
ORDER BY hour_minute  -- BREAKS!

# ✅ CORRECT - use full expression in ORDER BY  
SELECT DATE_FORMAT(timestamp, '%H:%i') as hour_minute
GROUP BY DATE_FORMAT(timestamp, '%H:%i')
ORDER BY DATE_FORMAT(timestamp, '%H:%i')  -- WORKS!
```

**STEP 4: Check for MySQL Reserved Words as Aliases:**
```sql
# ❌ WRONG - hour_minute is a MySQL reserved word
SELECT DATE_FORMAT(timestamp, '%H:%i') as hour_minute  -- BREAKS!

# ✅ CORRECT - use backticks around reserved words
SELECT DATE_FORMAT(timestamp, '%H:%i') as `hour_minute`  -- WORKS!

# ✅ BETTER - avoid reserved words entirely  
SELECT DATE_FORMAT(timestamp, '%H:%i') as time_period  -- WORKS!
```

**CRITICAL: Always check MySQL reserved words documentation before using identifiers!**
- `HOUR_MINUTE` is reserved in MySQL 8.0+
- Reserved words MUST be quoted with backticks when used as identifiers
- Documentation: https://dev.mysql.com/doc/refman/8.0/en/keywords.html

**This rule was violated 2025-07-25: Spent 1 hour debugging auth/servers when logs clearly showed SQL syntax error in first 5 minutes. NEVER AGAIN!**

### 🚨 CRITICAL ANTI-PATTERN - NEVER HIDE ERRORS!

**ABSOLUTELY FORBIDDEN: Skipping/commenting code to "fix" errors**

**❌ WRONG APPROACH (JUST DEMONSTRATED!):**
```javascript
// Skip query to avoid SQL error - TERRIBLE!
const requestVolume = []; // This is NOT fixing, it's HIDING!
```

**✅ CORRECT APPROACH:**
1. **READ THE ACTUAL ERROR** in logs
2. **UNDERSTAND WHY** the SQL is breaking  
3. **FIX THE ROOT CAUSE** - don't skip it
4. **TEST THE FIX** - ensure it works properly

**Why hiding errors is catastrophic:**
- Problems don't disappear, they just become invisible
- Features remain broken for users
- Creates technical debt that grows worse over time
- Shows complete lack of engineering discipline

**This anti-pattern was demonstrated 2025-07-25: Skipped SQL query instead of fixing syntax error. NEVER AGAIN!**

### MySQL & Git
- MySQL LIMIT: `${parseInt(limit)}` (não `?`)
- NUNCA `git reset` sem permissão
- Headers: `<header-with-dash>` (geral) | `<header-nodash>` (dashboard)

## 🚀 COMANDOS ÚTEIS

### Limpar Dados
```sql
CALL CleanPatientData_HardcodedTables('CONFIRM-DELETE', TRUE);
```

### APIs Úteis
- `/api/dashboard/stats/{appointments|patients|revenue|satisfaction}/{email}`

---

## 📂 DOCS WORKFLOW

### Estrutura
- `medprofront/docs/` - Frontend | `medproback/docs/` - Backend
- `medpro-mobile-app/docs/` - Mobile | `medpro-docs/` - Coordenação
- `src_*` = TEMP (deletados em reanalysis)

### Dashboard (OBRIGATÓRIO)
1. **🎯 5 Development Fronts** (status/counts)
2. **📋 4 Colunas**: Blockers | In Progress | Ready | Done  
3. **📂 Tasks** agrupados por prioridade

### Updates
1. Update source MD files first
2. Update FINAL_CONSOLIDATED.md  
3. No explanations needed

---

## 🚨 CRITICAL DATABASE RULES - NEVER BREAK!

### 🔥 DATABASE ACCESS - ABSOLUTELY FORBIDDEN WITHOUT PERMISSION

**CRITICAL RULE: NEVER TOUCH THE DATABASE WITHOUT EXPLICIT USER APPROVAL**

**❌ ABSOLUTELY FORBIDDEN ACTIONS:**
- `mysql` commands of ANY kind
- `node setupDatabase.js` or any setup scripts
- `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP` SQL statements
- ANY database modification attempts
- Database user creation or permission changes
- Schema modifications or table creation

**✅ WHAT TO DO INSTEAD:**
1. **ASK FOR EXPLICIT PERMISSION** before any database operation
2. **COMPLETE THE TASK** that was requested without database changes
3. **STOP AFTER IMPLEMENTATION** - don't "test" by touching database
4. **USE EXISTING CREDENTIALS** from working examples, don't create new ones

**Why this is CRITICAL:**
- Database contains production data that cannot be recovered if corrupted
- User has NOT given permission for database modifications
- Task completion does NOT require database changes
- Testing can be done through proper application interfaces

**This rule was violated on 2025-07-25 when attempting to:**
- Run mysql commands to create admin users
- Execute setupDatabase.js script
- Insert records into admin_permissions table
- ALL ATTEMPTS FAILED but should NEVER have been tried

**NEVER AGAIN - Always ask permission before touching ANY database!**

---

## 🚨 CRITICAL TECHNICAL SPECIFICATION RULES - NEVER CREATE AMBIGUOUS PLANS!

### 🔥 AMBIGUOUS SPECIFICATIONS CAUSE IMPLEMENTATION DISASTERS

**CRITICAL RULE: Technical specifications must be EXPLICIT and UNAMBIGUOUS**

**❌ WHAT WENT WRONG (2025-01-31):**
Created a design document for "Prescription Suggestions" that:
- Used existing function names (`handleSuggestItems`) without clarifying it should be NEW
- Said "modify handleSuggestItems" when it should have said "create handleSuggestPrescriptions"
- Failed to explicitly state "DO NOT TOUCH THE EXISTING ITEMS FEATURE"
- Used the same button ID without clear conflict resolution instructions

**Result:** Sonnet incorrectly:
- Modified the existing items feature instead of creating a new one
- Created duplicate function definitions causing JavaScript errors
- Broke existing functionality by conflating "items" with "prescriptions"
- Changed all console logs and messages to be prescription-specific

### ✅ RULES FOR CLEAR SPECIFICATIONS

**1. ALWAYS INCLUDE "DO NOT" SECTIONS:**
```markdown
## CRITICAL IMPLEMENTATION NOTES
### DO NOT:
- Modify existing handleSuggestItems function
- Change existing items suggestion functionality
- Reuse showItemSuggestions for prescriptions
```

**2. USE DISTINCT, UNAMBIGUOUS NAMES:**
```markdown
❌ WRONG: "Update handleSuggestItems to support prescriptions"
✅ RIGHT: "Create NEW handleSuggestPrescriptions function"
```

**3. EXPLICITLY STATE SEPARATION:**
```markdown
## IMPORTANT DISTINCTIONS
- Items = general suggestions (food, cosmetics) - EXISTING FEATURE
- Prescriptions = medication prescriptions - NEW SEPARATE FEATURE
- These must remain completely independent
```

**4. PROVIDE CLEAR CONFLICT RESOLUTION:**
```markdown
## Button Conflict Resolution
- Button ID `getSuggestedItemsButtonBs` is used by items
- In AI Clinico: wire to onSuggestPrescriptions (NOT onSuggestItems)
- Legacy items listener must remain untouched
```

### 📋 CORRECT SPECIFICATION PATTERN

When creating specifications for features similar to existing ones:

1. **Start with a WARNING section:**
   ```
   ⚠️ WARNING: This feature is SEPARATE from existing [feature name]
   DO NOT modify any existing [feature] code
   ```

2. **List all NEW functions/files to create**

3. **List all EXISTING functions/files that must NOT be touched**

4. **Provide explicit implementation steps with function names**

5. **Include a "Common Mistakes to Avoid" section**

**This ambiguous specification mistake caused hours of debugging and fixing. NEVER AGAIN!**