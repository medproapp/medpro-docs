# Claude Code Instructions for MedPro Project

## 🚨🚨🚨 CRITICAL: NEVER BREAK WORKING CODE - 2025-07-10 🚨🚨🚨

**ABSOLUTE RULE #1:**
# NUNCA QUEBRE ALGO QUE FUNCIONAVA ANTES!

**BEFORE ANY EDIT:**
1. ✅ **ALWAYS TEST SYNTAX FIRST**: Use `node -c file.js` before and after edits
2. ✅ **MAKE BACKUPS**: Copy file before editing
3. ✅ **VERIFY GIT STATUS**: Check if file is tracked before assuming restoration is possible
4. ✅ **READ ENTIRE CONTEXT**: Never use `sed` without understanding full file structure
5. ✅ **ONE EDIT AT A TIME**: Make single, verified changes - never batch operations

**FORBIDDEN PRACTICES:**
- ❌ **NEVER use sed for complex edits** - it corrupts file structure
- ❌ **NEVER remove code blocks without seeing full context**
- ❌ **NEVER assume git can restore untracked files**
- ❌ **NEVER make multiple automatic edits without verification**
- ❌ **NEVER edit files without reading surrounding code**

**CONSEQUENCES OF BREAKING CODE:**
- User must stop work to fix YOUR mistakes
- Loss of trust and productivity
- Wasted time and frustration
- Potential data loss or corruption

**SAFE EDITING CHECKLIST:**
```bash
# BEFORE editing:
1. git status file.js                    # Check if tracked
2. cp file.js file.js.backup            # Make backup
3. node -c file.js                      # Verify syntax
4. # Read full function/context
5. # Make ONE careful edit
6. node -c file.js                      # Test syntax again
7. # Verify functionality preserved
```

## 🚨 CRITICAL AUTHENTICATION AND DEBUGGING REMINDERS - 2025-07-10

**AUTHENTICATION CREDENTIALS:**
- **Login Route**: `/login` (POST)
- **Username**: `fabiangc@gmail.com`
- **Password**: `senha2`
- **JWT Token Structure**: Contains `username` field (NOT `email`!)

**HOW TO GET VALID TOKEN FOR API TESTING:**
```bash
# Step 1: Login to get token
curl -X POST "http://localhost:3000/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"fabiangc@gmail.com","password":"senha2"}'

# Step 2: Use returned token in Authorization header
curl -X GET "http://localhost:3000/api/endpoint" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**JWT TOKEN PAYLOAD STRUCTURE:**
```json
{
  "username": "fabiangc@gmail.com",
  "cpf": "fabiangc@gmail.com", 
  "role": "pract"
}
```

**CRITICAL DEBUGGING LESSONS - 2025-07-10:**
1. **ALWAYS check JWT token structure BEFORE changing route code**
2. **ALWAYS use CLAUDE.md credentials instead of guessing**
3. **NEVER make assumptions about field names (username vs email)**
4. **ALWAYS restart server after backend route changes**
5. **CHECK server logs for actual error messages before trying random fixes**

**Common Mistakes to AVOID:**
- ❌ Changing `req.user.username` to `req.user.email` without checking JWT payload
- ❌ Using wrong login credentials and not checking CLAUDE.md
- ❌ Testing API calls without restarting server after route changes
- ❌ Ignoring server logs that show the actual error message

**📚 LEARNING POINTS FOR EFFECTIVE DEBUGGING:**
1. **Read error traces completely** before making any assumptions
2. **Question why systems are interconnected** when they shouldn't be
3. **Focus on architectural correctness** before implementation details
4. **Listen more carefully** to user feedback and frustration cues
5. **Ask "Why is X involved?"** when unexpected components appear in error logs
6. **Stop and analyze** instead of making multiple "fixes" for wrong problems
7. **Follow the data flow** systematically instead of jumping to conclusions

## 🚨 CONFIGURAÇÃO CRÍTICA DE SERVIDORES - NUNCA ESQUECER!

**MEDPRO DEVELOPMENT ENVIRONMENT:**
- **Frontend**: `localhost:8080` (servidor local de desenvolvimento)
- **Backend**: `localhost:3000` (APIs Node.js/Express)

**ACESSO CORRETO:**
- Frontend pages: `http://localhost:8080/path/to/page.html`
- Backend APIs: `http://localhost:3000/api/endpoint`

**IMPORTANTE:** Frontend e Backend são servidos em portas DIFERENTES. Nunca confundir ou tentar acessar frontend via porta 3000.

## 🚨 IMPORTAÇÃO OBRIGATÓRIA DO MEDPRO.JS - ERRO BÁSICO!

**CRITICAL**: medpro.js é um ES6 module e DEVE ser carregado com `type="module"`:

**PADRÃO OBRIGATÓRIO EM TODOS OS HTMLs:**
```html
✅ CORRETO: <script type="module" src="/js/medpro.js"></script>
❌ ERRADO:  <script src="/js/medpro.js"></script>
```

**NUNCA esquecer `type="module"`** - sem isso o navegador gera erro de sintaxe: `Uncaught SyntaxError: Unexpected token 'export'`

## 🚨 IMPORTAÇÃO DE FUNÇÕES DO MEDPRO.JS - ERRO BÁSICO CRÍTICO!

**CRITICAL**: Após carregar medpro.js como module, é OBRIGATÓRIO fazer import das funções no JavaScript:

**PADRÃO OBRIGATÓRIO EM TODOS OS JS:**
```javascript
// SEMPRE no início do arquivo JavaScript:
import { authenticatedFetch, showToast, appState, hideLoader, showLoader } from "/js/medpro.js";
```

**DEPENDÊNCIAS OBRIGATÓRIAS:**
- moment.js DEVE ser carregado ANTES do medpro.js
- JavaScript que usa medpro.js DEVE ser type="module"

**EXEMPLO COMPLETO HTML:**
```html
<script src="/js/moment.js"></script>
<script type="module" src="/js/medpro.js"></script>
<script type="module" src="meu-script.js"></script>
```

**EXEMPLO COMPLETO JS:**
```javascript
import { authenticatedFetch, showToast, appState } from "/js/medpro.js";
// Agora posso usar authenticatedFetch()
```

## 🏗️ ARQUITETURA PADRÃO MEDPRO - OBRIGATÓRIO SEGUIR!

**BASEADO EM:** `pract-dashboard.html` - Padrão de referência do sistema

### **Estrutura HTML Obrigatória:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <!-- CSS files in correct order -->
    <link rel="stylesheet" href="/css/custom.css" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="page-specific.css" />
    
    <!-- Standard MedPro head content -->
    <title>Page Title - Medpro.app</title>
    <link rel="icon" type="image/x-icon" href="/assets/icon4.png" />
    
    <!-- Components -->
    <script src="/components/header.js" type="text/javascript" defer></script>
    <script src="/components/footer.js" type="module" defer></script>
</head>
<body>
    <!-- Standard loader -->
    <div id="loader-overlay" class="loader hide">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="loader-message">Carregando...</p>
    </div>
    
    <!-- Body main div wrapper -->
    <div id="body-main-div" class="shadow">
        <header-nodash id="main-header"></header-nodash>
        
        <main id="main-div" class="container-fluid p-4">
            <!-- Page content here -->
        </main>
        
        <footer-component></footer-component>
    </div>
    
    <!-- Scripts at bottom in correct order -->
    <script src="/js/moment.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    <script type="module" src="./js/main-file.js"></script>
</body>
</html>
```

### **Estrutura JavaScript Modular Obrigatória:**
```
js/
├── main-file.js              # Entry point with DOMContentLoaded
├── config.js                 # DOM elements configuration
├── services.js               # API calls with authenticatedFetch
├── ui.js                     # UI operations and rendering
├── stats.js                  # Statistics and data processing
└── modules/                  # Additional feature modules
    └── feature.js
```

### **Padrão de Main.js:**
```javascript
import { initMedpro, appState, showToast, showLoader, hideLoader } from "/js/medpro.js";
import { configElements as DOM } from "./config.js";
import * as ui from "./ui.js";
import * as services from "./services.js";

document.addEventListener("DOMContentLoaded", () => {
    DOM.init();
    main().catch((err) => {
        console.error("Critical error:", err);
        hideLoader();
        // Error handling
    });
});

async function main() {
    showLoader("Loading...");
    await initMedpro();
    
    if (!appState.user) {
        window.location.href = "/login.html";
        return;
    }
    
    // Initialize page logic here
    hideLoader();
}
```

### **Padrão de Config.js (DOM Elements):**
```javascript
export const configElements = {
    element1: null,
    element2: null,
    
    init() {
        this.element1 = document.getElementById('element1');
        this.element2 = document.getElementById('element2');
    }
};
```

### **Padrão de Services.js:**
```javascript
import { appState, authenticatedFetch } from "/js/medpro.js";

export async function getData() {
    const result = await authenticatedFetch('/api/endpoint');
    if (result.status === 200) {
        return result.data;
    }
    throw new Error('API call failed');
}
```

**NUNCA** criar páginas que não sigam esta arquitetura modular!

## Authentication Requirements

**CRITICAL**: Always use `authenticatedFetch` from `/js/medpro.js` for all authenticated API calls instead of regular `fetch`. This function handles:

- Automatic JWT token management from sessionStorage
- Proper Authorization headers
- Automatic 401 handling with redirect to error page
- Consistent error handling patterns
- Content-Type header management for JSON requests

### Usage Pattern:
```javascript
import { authenticatedFetch } from "/js/medpro.js";

// For GET requests
const result = await authenticatedFetch('/api/endpoint');
// Returns: { status, data, response }

// For POST/PUT requests
const result = await authenticatedFetch('/api/endpoint', {
    method: 'POST',
    body: { key: 'value' }  // Object will be auto-stringified
});
```

### DO NOT USE:
```javascript
// ❌ NEVER use manual Authorization headers
const response = await fetch('/api/endpoint', {
    headers: {
        'Authorization': `Bearer ${appState.token}`
    }
});
```

This instruction was added after discovering incorrect authentication patterns in the communication module implementation.

## Organizational Structure Requirements - 2025-07-10

**CRITICAL**: MedPro has a specific organizational hierarchy that must be correctly implemented for proper system functionality.

### Organizational Hierarchy Rules:

1. **Admin Practitioners** (`users.admin = 1`):
   - ✅ **MUST** have their own organization created automatically
   - ✅ **MUST** have entries in: `organization`, `entitygroup`, `groupmembers`
   - ✅ **MUST** be marked as `role = 'owner'` in groupmembers
   - ❌ **CANNOT** function properly without complete organizational structure

2. **Member Practitioners** (`users.admin = 0`):
   - ❌ **DO NOT** have their own organization
   - ✅ **ARE** associated with existing organizations via `groupmembers`
   - ✅ **HAVE** `role = 'pract'` or `'member'` in groupmembers

3. **Assistants**:
   - ❌ **DO NOT** have their own organization
   - ✅ **ARE** associated with existing organizations via `groupmembers`
   - ✅ **HAVE** `role = 'member'` or `'assist'` in groupmembers

### Auto-Creation Implementation:

#### Backend Auto-Creation (Prevention):
- **Location**: `/medproback/src/services/core/practitionerService.js`
- **Function**: `savePractitionerData()`
- **Logic**: Automatically detects admin practitioners without organization and creates complete structure
- **Triggered**: Every time admin practitioner saves data in pract-mydata

#### Frontend Dashboard Detection (Correction):
- **Location**: `/medprofront/practitioner/dashboard/js/pract-dashboard-main.js`
- **Function**: `initializePractitionerSetup()`
- **Logic**: Detects admin practitioners without organization structure and offers manual correction
- **Triggered**: Every time admin practitioner accesses dashboard

### Required Database Functions:

#### nextval() Function:
```sql
-- CRITICAL: Must exist for ID generation
CREATE FUNCTION nextval(seq_name varchar(100)) 
RETURNS bigint
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE cur_val bigint(20);
    SELECT sequence_cur_value INTO cur_val FROM identifiers2 WHERE sequence_name = seq_name;
    IF cur_val IS NOT NULL THEN
        UPDATE identifiers2 SET sequence_cur_value = IF (
            (sequence_cur_value + sequence_increment) > sequence_max_value,
            IF (sequence_cycle = TRUE, sequence_min_value, NULL),
            sequence_cur_value + sequence_increment
        ) WHERE sequence_name = seq_name;
    END IF;
    RETURN cur_val;
END
```

#### identifiers2 Table:
```sql
-- CRITICAL: Must exist for sequence management
CREATE TABLE identifiers2 (
  sequence_name varchar(100) NOT NULL PRIMARY KEY,
  sequence_increment int unsigned NOT NULL DEFAULT '1',
  sequence_min_value int unsigned NOT NULL DEFAULT '1',
  sequence_max_value bigint unsigned NOT NULL DEFAULT '18446744073709551615',
  sequence_cur_value bigint unsigned DEFAULT '1',
  sequence_cycle tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Required sequences:
INSERT INTO identifiers2 (sequence_name, sequence_cur_value) VALUES 
('ORG', 1), ('ETG', 1), ('ENC', 1), ('ATT', 1), ('MDR', 1), ('CLI', 1), ('ERR', 1);
```

### Complete Organizational Structure Creation:

#### Function: createFullOrganization()
- **Location**: `/medproback/src/services/core/organizationService.js`
- **Purpose**: Creates complete organizational structure in single transaction
- **Creates**:
  1. **Organization** record with unique `ORG-XXXXXX` identifier
  2. **EntityGroup** record with unique `ETG-XXXXXX` identifier
  3. **GroupMember** record linking practitioner as owner
- **Usage**: Called automatically for admin practitioners missing structure

#### API Endpoints:
```javascript
GET  /pract/checkorganizationalstructure/:practId  // Verify structure exists
POST /pract/createorganizationstructure/:practId   // Create structure manually
```

### Root Database Access for Functions:

When creating MySQL functions like `nextval()`, use root access:
```bash
# Enable function creation
sudo mysql -u root -e "SET GLOBAL log_bin_trust_function_creators = 1;"

# Create functions as root via socket (not TCP)
sudo mysql -u root -D medpro < function_file.sql
```

### Testing Organizational Structure:

```sql
-- Verify admin has complete structure
SELECT 
    u.email, u.admin,
    uto.managingEntity as orgId,
    o.name as orgName,
    uto.groupId,
    gm.role as memberRole
FROM users u
LEFT JOIN usertoorg uto ON u.email = uto.email
LEFT JOIN organization o ON uto.managingEntity = o.identifier  
LEFT JOIN groupmembers gm ON uto.email = gm.memberId
WHERE u.email = 'admin@example.com';
```

### Key Learnings - 2025-07-10:

1. **Problem**: Admin practitioners were missing organizational structure causing dashboard statistics failures
2. **Root Cause**: Organization creation was only triggered for new users marked as admin in sessionStorage
3. **Solution**: Dual approach - backend auto-creation + frontend detection with manual correction
4. **Database Issue**: `nextval()` function was missing, preventing ID generation
5. **Resolution**: Copied function from external database using `mysqlsh.exe` and root access via `sudo mysql`

### ID Generation System (Sequences):

#### How MedPro Generates Unique IDs:

MedPro uses a custom sequence system similar to PostgreSQL sequences, implemented in MySQL:

1. **Sequence Table**: `identifiers2` stores current values for each ID type
2. **Sequence Function**: `nextval(seq_name)` generates next unique ID
3. **ID Format**: `TYPE-XXXXXX` (e.g., `ORG-000042`, `ETG-000043`)

#### Sequence Types and Usage:

```sql
-- Current sequences in production:
ORG    -- Organization IDs (ORG-000001, ORG-000002, etc.)
ETG    -- Entity Group IDs (ETG-000001, ETG-000002, etc.)  
ENC    -- Encounter IDs (ENC-000001, ENC-000002, etc.)
ATT    -- Attachment IDs (ATT-000001, ATT-000002, etc.)
MDR    -- Medical Record IDs (MDR-000001, MDR-000002, etc.)
CLI    -- Clinical Record IDs (CLI-000001, CLI-000002, etc.)
ERR    -- Error Record IDs (ERR-000001, ERR-000002, etc.)
```

#### Sequence Implementation Details:

```sql
-- Function call returns current value and increments for next call
SELECT nextval('ORG') as new_org_id;  -- Returns: 42, sets next to 43
SELECT nextval('ETG') as new_group_id;  -- Returns: 43, sets next to 44

-- Check current sequence values
SELECT sequence_name, sequence_cur_value FROM identifiers2;
```

#### Integration with getNextid():

```javascript
// Backend function that wraps nextval() for JavaScript use
const { getNextid } = require("../utils/functions.js");

// Usage in services
const newOrgId = await getNextid(pool, "ORG");  // Returns: "ORG-000042"
const newGroupId = await getNextid(pool, "ETG");  // Returns: "ETG-000043"
```

#### Sequence Management:

```sql
-- Add new sequence type
INSERT INTO identifiers2 (sequence_name, sequence_cur_value) VALUES ('NEW', 1);

-- Reset sequence (be careful!)
UPDATE identifiers2 SET sequence_cur_value = 1 WHERE sequence_name = 'ORG';

-- Check sequence status
SELECT 
    sequence_name,
    sequence_cur_value as current_value,
    sequence_increment as increment_by,
    sequence_max_value as max_value
FROM identifiers2 
ORDER BY sequence_name;
```

#### Critical Dependencies:

1. **Database Function**: `nextval()` must exist and be accessible to medpro user
2. **Sequence Table**: `identifiers2` must exist with proper data
3. **Privileges**: Function creation requires root access or `log_bin_trust_function_creators = 1`
4. **Transaction Safety**: Function handles concurrent access safely
5. **Error Handling**: `getNextid()` function provides proper error messages

#### Troubleshooting Sequence Issues:

```bash
# Check if nextval function exists
mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "SHOW FUNCTION STATUS WHERE Name = 'nextval';"

# Test function manually
mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "SELECT nextval('ORG') as test_id;"

# Check sequence table
mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "SELECT * FROM identifiers2;"

# If function missing, recreate with root access
sudo mysql -u root -e "SET GLOBAL log_bin_trust_function_creators = 1;"
sudo mysql -u root -D medpro < create_nextval_function.sql
```

## Database Access Requirements

**CRITICAL**: Always consult the database directly using mysql instead of relying on SQL files in the repository, as they are outdated and not representative of the current database structure.

### MySQL Authentication:
Always use credentials from `/mnt/c/fagce/medpro/repo/version3/medproback/.env`:
- **Host**: 127.0.0.1 (localhost within WSL)
- **User**: medpro  
- **Password**: medpro
- **Database**: medpro

### Usage Pattern:
```bash
# To check table structure
mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "DESCRIBE table_name;"

# To list tables
mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "SHOW TABLES;"

# To view specific data
mysql -u medpro -pmedpro -h 127.0.0.1 -D medpro -e "SELECT * FROM table_name LIMIT 10;"
```

### DO NOT USE:
- ❌ NEVER rely on .sql files in `/mysql/` directories for current schema
- ❌ NEVER use hardcoded credentials - always read from .env file

### MySQL Query Limitations:
**CRITICAL**: MySQL with mysql2 driver does NOT support placeholder parameters (?) in LIMIT and OFFSET clauses. Always construct these dynamically:

```javascript
// ❌ WRONG - Will cause SQL syntax error
const query = `SELECT * FROM table LIMIT ? OFFSET ?`;
const params = [limit, offset];

// ✅ CORRECT - Construct dynamically
const query = `SELECT * FROM table LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
const params = [/* other params only */];
```

This limitation has caused errors in previous implementations and must be remembered for all future queries.

### Server Restart Requirement:
**CRITICAL**: Always restart the Node.js server after making changes to backend code. Backend changes are NOT hot-reloaded.

```bash
# After any backend file changes, restart server:
# 1. Stop current server (Ctrl+C in terminal)
# 2. Start again: npm start
# 3. Wait ~20 seconds for full initialization
```

Failing to restart will result in testing old code and incorrect behavior validation.

## MedPro Data Model Structure

**CRITICAL**: MedPro uses an organization-based data model. Practitioners belong to organizations, and patients are linked to organizations, not directly to practitioners via practlinkedpatients table.

### Key Data Model Concepts:

1. **Organization-Based Linking**: Patients are linked to practitioners through organization membership
2. **No Direct Patient-Practitioner Links**: The `practlinkedpatients` table is NOT required when patients belong to the same organization as the practitioner
3. **Practitioner Organization**: `fabiangc@gmail.com` belongs to organization `ORG-000006`

### Dashboard Implementation Status:

✅ **RESOLVED**: Dashboard statistics now working correctly with organization-based queries
✅ **RESOLVED**: Patient names displaying correctly in appointments and encounters
✅ **RESOLVED**: Appointment status logic fixed - no longer shows "No-Show" for future appointments
✅ **RESOLVED**: All test data properly linked to organization ORG-000006

### Key Solutions Implemented:

1. **Organization-Based Queries**: All statistics queries use `usertoorg` view to get practitioner's organization
2. **Patient Association**: Patients with `managingOrganization = 'ORG-000006'` are automatically associated with practitioners in that organization
3. **Location References**: Use location ID 126 ("Lugar 1") which belongs to organization ORG-000006
4. **DateTime Parsing**: Fixed appointment status calculation by properly combining date and time fields
5. **API Structure**: Patient data accessed via `patient?.data || patient` for nested response structure

### Database Schema Mappings:

#### Appointments Table Structure:
```sql
-- Real column names (not 'id' as assumed)
- identifier (int, auto_increment PRIMARY KEY)
- status (varchar(15)) - Use: 'booked', 'arrived', 'checked-in' 
- startdate (date)
- starttime (time)
- subject (varchar(20)) - Patient CPF
- practitionerid (varchar(100)) - Use: 'fabiangc@gmail.com'
- locationid (int) - NOT 'location_id'
- inprogress (tinyint(1)) - Must be 0 for getNextAppointments
```

#### Encounters Table Structure:
```sql
-- Uses Capital case columns
- Identifier (varchar(10) PRIMARY KEY) 
- Status (varchar(20)) - Use: 'completed'
- Subject (varchar(14)) - Patient CPF
- Practitioner (varchar(100)) - Use: 'fabiangc@gmail.com'
- actualStart (datetime) - NOT 'start_time'
- actualEnd (datetime) - NOT 'end_time'
- LocationReference (int) - NOT 'location_id'
```

#### Patients Table Structure:
```sql
- cpf (varchar(14) PRIMARY KEY) - NOT 'id'
- name (varchar(100)) - NOT 'nome'/'sobrenome'
- birthdate (date) - NOT 'nascimento'
- phone (varchar(15)) - NOT 'telefone'
- managingOrganization (varchar(20)) - Links patient to organization
```

#### Organizations Table Structure:
```sql
- id (varchar(20) PRIMARY KEY) - e.g., 'ORG-000006'
- name (varchar(100)) - Organization name
```

#### Practitioners Table Structure:
```sql
- email (varchar(100) PRIMARY KEY) - e.g., 'fabiangc@gmail.com'
- name (varchar(100)) - Practitioner name
- cpf (varchar(11)) - Practitioner CPF
- active (tinyint(1)) - Active status
- valoratendimento (varchar(5)) - Appointment value
- tempoatendimento (varchar(5)) - Appointment duration
- intervaloatendimentos (varchar(5)) - Appointment interval
```

#### UserToOrg View (Organization Relationship):
```sql
-- Use this view to get practitioner's organization:
SELECT managingEntity as organizationId FROM usertoorg WHERE email = 'fabiangc@gmail.com'
-- Returns: ORG-000006

-- CRITICAL: Dashboard statistics services now use this view instead of nonexistent 'practs' table
```

#### Locations Table Structure:
```sql
- id (int PRIMARY KEY) - e.g., 126
- locName (varchar(100)) - Location name
- organizationid (varchar(20)) - Links location to organization
```

#### PractLinkedPatients Table Structure:
```sql
- practId (varchar(100)) - Use: 'fabiangc@gmail.com'
- patientId (varchar(100)) - Patient CPF
- linkedDate (datetime) - NOT 'status' column
**NOTE**: This table is NOT required for organization-based patient linking. 
Patients are automatically associated with practitioners through organization membership.
```

#### Satisfaction Surveys Table Structure:
```sql
- encounter_id (varchar(10))
- patient_cpf (varchar(14)) - NOT 'patient_id'
- practitioner_id (varchar(100)) - Use: 'fabiangc@gmail.com'
- overall_rating (int) - NOT decimal
- status (enum: 'pending','sent','completed','expired')
```

### Critical Function Mappings:

#### getNextAppointments Function Requirements:
```sql
-- Query looks for specific status values:
WHERE status IN ('booked','arrived','checked-in') 
AND COALESCE(inprogress, FALSE) = FALSE 
AND practitionerid = 'fabiangc@gmail.com'
AND (((startdate = CURDATE()) AND ADDTIME(starttime, SEC_TO_TIME(duration * 60 + 3600)) >= CURTIME()) OR (startdate > CURDATE()))
```

#### Organization-Based Patient Queries:
```sql
-- Correct way to query patients for a practitioner:
SELECT DISTINCT p.cpf, p.name
FROM patients p
JOIN usertoorg uo ON p.managingOrganization = uo.managingEntity
WHERE uo.email = 'fabiangc@gmail.com'

-- Simplified approach using known organization:
SELECT DISTINCT p.cpf, p.name
FROM patients p
WHERE p.managingOrganization = 'ORG-000006'

-- NOT using practlinkedpatients:
-- SELECT p.cpf FROM patients p JOIN practlinkedpatients plp ON p.cpf = plp.patientId WHERE plp.practId = 'fabiangc@gmail.com'
```

#### Dashboard Statistics API Calls:
- `/api/dashboard/stats/appointments/fabiangc@gmail.com` - Returns appointment count
- `/api/dashboard/stats/patients/fabiangc@gmail.com` - Returns patient statistics
- `/api/dashboard/stats/revenue/fabiangc@gmail.com` - Returns revenue data
- `/api/dashboard/stats/satisfaction/fabiangc@gmail.com` - Returns satisfaction ratings

### Data Consistency Requirements:

1. **Practitioner ID**: ALL data must use `fabiangc@gmail.com` (never USR-240901-001)
2. **Organization ID**: Use `ORG-000006` for test data
3. **Patient References**: Use actual patient CPFs from database (e.g., '00636525872', '11122233445', '43228189864', '55566677889')
4. **Location References**: Use location ID 126 which belongs to organization ORG-000006
5. **Status Values**: Use exact status values expected by functions
6. **Date/Time**: Use proper MySQL datetime formats
7. **Organization-Based Relationships**: Ensure patients, practitioners, and locations all belong to the same organization

### Missing Data Issues:

- **Location Service**: `/location/getlocationbyid/1/?email=fabiangc@gmail.com` returns 404
- **Patient Details**: `/patient/getpatientdetails/11122233445` returns 404
- **Appointments Today**: Statistics API returns 0 despite data existing

### Next Steps Required:

1. Fix location service to return proper location names
2. Fix patient details service to return patient information
3. Verify appointment statistics calculation is using correct query
4. Ensure all test data follows proper schema relationships

## Specific Issues Found During Implementation:

### Statistics Dashboard Problems:
1. **Compromissos Hoje = 0**: Despite having valid appointments in database, the statistics API returns 0
2. **Data Inconsistency**: Appointments exist but don't appear in "Próximos Compromissos" section
3. **404 Errors**: Multiple services returning 404 for valid data

### Log Analysis from Console:
```
- appointments: formatted: '0' (should show actual count)
- appointments: trend: -100.0% (down) 
- appointmentsWeek: formatted: '0'
- appointmentsMonth: formatted: '0'
```

### Root Cause Analysis:
The dashboard statistics service is not properly querying the appointments table. The issue is likely in:
- `/medproback/src/services/dashboard-stats.js` - Query may be incorrect
- Time zone or date comparison issues
- Status value mismatches

### Database Data Verification:
Current test data exists for `fabiangc@gmail.com`:
- 74 total appointments
- 33 future appointments  
- 25 encounters (23 completed)
- 41 linked patients
- 53 satisfaction surveys (47 completed)

### API Endpoint Status:
- ✅ `/api/dashboard/stats/patients/fabiangc@gmail.com` - Working (organization-based queries implemented)
- ✅ `/api/dashboard/stats/revenue/fabiangc@gmail.com` - Working (organization-based queries implemented)
- ✅ `/api/dashboard/stats/satisfaction/fabiangc@gmail.com` - Working 
- ✅ `/api/dashboard/stats/appointments/fabiangc@gmail.com` - Working (shows today's appointments count)

### Test Data Summary:
- **Organization**: ORG-000006 (fabiangc@gmail.com belongs to this organization)
- **Patients**: 4 patients in organization (CPFs: 00636525872, 11122233445, 43228189864, 55566677889)
- **Location**: ID 126 ("Lugar 1") belongs to organization ORG-000006
- **Appointments**: 5 appointments for today + historical data - ALL properly referencing real patient CPFs
- **Patient Statistics**: 4 total patients, 4 with recent activity, 4 recurring patients
- **Revenue**: Test invoices created for organization patients
- **Satisfaction**: Test surveys linked to organization patients

### Dashboard UI Status:
- ✅ **Individual Card Rotation**: Working with 4 cards rotating statistics independently
- ✅ **Patient Names**: Displaying correctly in "Próximos Compromissos" section
- ✅ **Appointment Status**: Showing correct status (no more "No-Show" for future appointments)
- ✅ **Location Names**: Showing "Lugar 1" correctly
- ✅ **Statistics Values**: All showing real data from database
- ✅ **Table Space Optimization**: Improved table density and readability with optimized fonts and spacing
- ✅ **Appointment Type Icons**: Colorful emoji icons with contextual animations for visual appeal

### Critical Data Relationships:
```sql
-- Organization-based relationships (CORRECT):
patients.managingOrganization = practs.organizationid = locations.organizationid

-- Appointments link to patients via CPF (all in same organization):
appointments.subject = patients.cpf
appointments.practitionerid = 'fabiangc@gmail.com'
appointments.locationid = 126 (belongs to ORG-000006)

-- Encounters link to patients and practitioners:
encounters.Subject = patients.cpf
encounters.Practitioner = 'fabiangc@gmail.com'
encounters.LocationReference = 126

-- Satisfaction surveys link encounters to practitioners:
satisfaction_surveys.encounter_id = encounters.Identifier
satisfaction_surveys.practitioner_id = 'fabiangc@gmail.com'
satisfaction_surveys.patient_cpf = patients.cpf

-- AVOID direct patient-practitioner links:
-- practlinkedpatients table is NOT required for organization-based model
```

### Status Value Requirements:
- **Appointments**: Use 'booked', 'arrived', 'checked-in' (NOT 'confirmed', 'scheduled')
- **Encounters**: Use 'completed' (NOT 'finished', 'done')
- **Satisfaction**: Use 'completed' (NOT 'finished', 'answered')

### Important Bug Fixes Applied:
1. **DateTime Parsing Issue**: Fixed appointment status calculation by properly combining `item.startdate` and `item.starttime` fields instead of just using date
2. **Patient Data Structure**: Fixed patient name retrieval by handling nested API response structure (`patient?.data || patient`)
3. **Database Table Reference**: Changed from nonexistent `practs` table to `usertoorg` view in dashboard statistics service
4. **Data Consistency**: All appointments now reference real patient CPFs instead of PAT-xxx placeholders

### Time-Based Query Issues:
The appointment statistics query uses complex time calculations that may fail:
```sql
-- This condition may be causing issues:
(((startdate = CURDATE()) AND ADDTIME(starttime, SEC_TO_TIME(duration * 60 + 3600)) >= CURTIME()) OR (startdate > CURDATE()))
```

Current time is 12:17 PM, so appointments before this time are filtered out.

## 📍 COMPONENTES DO SISTEMA MEDPRO

### Header Component Structure:

**CRITICAL**: Header component está localizado em `/medprofront/components/header.js`

### Componentes do Sistema:
- **Header**: `/medprofront/components/header.js` - Componente principal do cabeçalho
- **Footer**: `/medprofront/components/footer.js` - Componente do rodapé
- **CSS**: `/medprofront/css/` - Estilos globais do sistema

### Estrutura do Header:
- Carregado via `<script src="/components/header.js" type="text/javascript" defer></script>`
- Contém navegação principal e menus do sistema

#### **REGRA CRÍTICA DE HEADERS:**
- ✅ **`<header-with-dash>`**: TODAS as páginas (exceto pract-dashboard)
- ❌ **`<header-nodash>`**: APENAS pract-dashboard.html

#### **Uso Correto:**
```html
<!-- Para QUALQUER página exceto pract-dashboard -->
<header-with-dash id="main-header"></header-with-dash>

<!-- APENAS para pract-dashboard.html -->
<header-nodash id="main-header"></header-nodash>
```

#### **Páginas que devem usar header-with-dash:**
- `/communication/inbox/inbox-main.html` ✅
- `/patient/search/patient-search.html` ✅
- `/appointment/create/appointment_create.html` ✅
- Todas as outras páginas do sistema ✅

#### **Única exceção:**
- `/practitioner/dashboard/pract-dashboard.html` → `<header-nodash>`

### Sistemas de Comunicação MedPro - 2025-07-10:

**CRITICAL**: MedPro possui dois sistemas de comunicação completamente separados e independentes.

#### 1. 📧 **COMUNICAÇÃO INTERNA** (Profissionais/Equipe):
- **Localização**: Ícone dedicado no header
- **Funcionalidade**: Mensagens entre profissionais da mesma organização
- **Sistema**: Internal Communication (inbox/threads/messages)

##### Estrutura no Header:
```html
<!-- Dropdown de comunicação interna no header -->
<div class="dropdown me-3">
    <a href="#" class="position-relative" data-bs-toggle="dropdown">
        <i class="fa-solid fa-envelope text-primary"></i>
        <span class="header-comm-badge badge bg-danger">0</span>
    </a>
    <ul class="dropdown-menu dropdown-menu-end">
        <li><h6 class="dropdown-header">Comunicação Interna</h6></li>
        <li><a href="/communication/inbox/inbox-main.html">Caixa de Entrada</a></li>
        <li><a href="/communication/inbox/inbox-main.html?action=new">Enviar Mensagem</a></li>
    </ul>
</div>
```

**IMPORTANT**: O dropdown do header contém APENAS funcionalidades de comunicação interna (entre profissionais). Dashboard e configurações pertencem à comunicação com pacientes e ficam no menu Pacientes.

##### Funcionalidades:
- **Inbox/Outbox**: Sistema de mensagens internas
- **Threads**: Conversas organizadas por assunto
- **Real-time badges**: Indicadores de mensagens não lidas
- **URL parameter `?action=new`**: Abre modal de nova mensagem
- **Badge animations**: Pulse e mudança de cor quando há não lidas

#### 2. 💬 **COMUNICAÇÃO COM PACIENTES** (Automação/Campanhas):
- **Localização**: Menu Pacientes → Comunicação com Pacientes
- **Funcionalidade**: Automação, campanhas, configurações de comunicação
- **Sistema**: Patient Communication (config/dashboard/automation)

##### Estrutura no Menu Pacientes:
```html
<!-- Seção no dropdown de Pacientes -->
<li><h6 class="dropdown-header">Comunicação com Pacientes</h6></li>
<li><a href="/communication/communication-config.html">Configuração Automática</a></li>
<li><a href="/communication/communication-dashboard.html">Dashboard de Comunicação</a></li>
```

##### Funcionalidades:
- **Configuração Automática**: Setup de comunicação com pacientes
- **Dashboard de Comunicação**: Métricas e relatórios
- **Campanhas**: Automação de mensagens para pacientes
- **Templates**: Modelos de comunicação

#### **SEPARAÇÃO CRÍTICA:**

| Aspecto | Comunicação Interna | Comunicação com Pacientes |
|---------|-------------------|---------------------------|
| **Usuários** | Profissionais ↔ Profissionais | Clínica → Pacientes |
| **Localização** | Header (ícone envelope) | Menu Pacientes |
| **Sistema** | Internal Messages | Patient Communications |
| **Dados** | internal_comm_* tables | patient_comm_* configs |
| **APIs** | `/api/internal-comm/*` | `/api/patient-comm/*` |
| **Funcionalidade** | Chat/Inbox real-time | Automação/Campanhas |

#### **Implementação Técnica:**

##### CSS de Suporte (Comunicação Interna):
```css
@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}

.header-comm-badge {
    font-size: 0.6rem !important;
    border-radius: 50% !important;
}
```

##### Badge Manager Global:
- **Escopo**: Apenas comunicação interna
- **Atualização**: A cada 30 segundos
- **Indicadores**: Badge numérico + animação pulse + mudança de cor

## Dashboard Table Enhancements - 2025-07-09

### Table Space Optimization Implemented:

1. **Font System Optimization**:
   - Changed to `Inter` font with `SF Pro Text` fallback for better readability
   - Reduced font size from 16px to 14px for better information density
   - Line height optimized to 1.3 for compact display
   - Added font smoothing and kerning for crisp text rendering

2. **Spacing Improvements**:
   - Cell padding reduced from 16px to 10px vertical, 8px horizontal
   - Header padding optimized to 12px vertical, 8px horizontal
   - Removed excessive white space between elements

3. **Column Width Optimization**:
   - **Próximos Compromissos**: Type (6%), Patient (24%), Date (18%), Time (12%), Status (15%), Location (15%), Actions (10%)
   - **Últimos Encontros**: Patient (30%), Start (25%), Duration (15%), Location (20%), Actions (10%)
   - **Últimos Pacientes**: Patient (40%), Last encounter (30%), Number of encounters (30%)

4. **Status Badges Enhancement**:
   - More compact badges with 3px 8px padding
   - Smaller font (11px) with 500 weight
   - Added subtle borders for better definition
   - Improved color contrast and consistency

5. **Responsive Design**:
   - Mobile-optimized font sizes and spacing
   - Column hiding on small screens
   - Proportional adjustments for different screen sizes

### Appointment Type Visual Icons - 2025-07-09

#### Colorful Emoji Icon System:
Replaced flat FontAwesome icons with expressive emojis for better visual impact:

1. **📋 ROUTINE** (Consulta de Rotina) - Clipboard with natural blue/white colors
2. **⭐ FIRST** (Primeira Consulta) - Golden star with sparkle animation
3. **🚶‍♂️ WALKIN** (Encaixe) - Walking person with natural skin/blue tones
4. **🩺 CHECKUP** (Check-up) - Medical stethoscope with swing animation
5. **🔄 FOLLOWUP** (Retorno) - Rotation arrows in natural blue
6. **🚨 EMERGENCY** (Emergência) - Red emergency siren with pulse animation

#### Enhanced Visual Features:
- **Size**: 1.4rem for prominent display
- **Animations**: Context-specific animations for emergency (pulse), first consultation (sparkle), and checkup (swing)
- **Hover Effects**: 1.3x scale with 5° rotation and enhanced shadow
- **Background**: Gradient background column with subtle border
- **Tooltips**: Descriptive tooltips on hover
- **Header**: Emoji tag icon (🏷️) in column header

#### Animation Details:
- **Emergency Pulse**: Breathing effect with red glow every 2 seconds
- **First Consultation Sparkle**: Golden shimmer with scale and rotation every 2 seconds
- **Checkup Swing**: Gentle pendulum motion every 3 seconds
- **Hover**: All icons scale 1.3x with rotation and enhanced drop shadow

#### Database Updates:
Updated appointment types in database for visual variety:
- ID 4: ROUTINE (14:00 - Maria Oliveira Costa)
- ID 5: FIRST (15:00 - MANOEL AUGUSTO RODRIGUES FOZ)
- ID 6: CHECKUP (16:00 - MANOEL AUGUSTO RODRIGUES FOZ)
- ID 31: FOLLOWUP (17:00 - MANOEL AUGUSTO RODRIGUES FOZ)
- ID 30006: EMERGENCY (08:00 - João Silva Santos)
- ID 7: WALKIN (09:00 - João Silva Santos)

### Result:
Dashboard tables now feature:
- **Better information density** with 20% more content in same space
- **Improved readability** with optimized typography
- **Colorful visual indicators** with emoji icons and animations
- **Professional appearance** with consistent spacing and alignment
- **Enhanced user experience** with interactive elements and smooth transitions