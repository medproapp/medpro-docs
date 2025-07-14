# EXACT Frontend Encounter Creation Logic

Based on analysis of `/encounter/start/encounter-start.js`, here's the EXACT process the frontend uses to create encounters.

## Frontend Workflow (Lines 625-644)

### Step 1: Get Next Encounter ID
```javascript
const { data: nextIdResponse } = await authenticatedFetch(`${appState.serverHost}/getNextId/ENC`);
const newEncounterId = nextIdResponse.nextval; // IMPORTANT: Uses .nextval not .nextId
```

### Step 2: Create Current Encounter Object
```javascript
currentEncounter = {
    Identifier: newEncounterId,
    Subject: localPatientInfo.cpf,        // Patient CPF
    Status: "in-progress",
    actualStart: new Date(),
};
actualStartTimestamp = currentEncounter.actualStart;
```

### Step 3: Call saveFullEncounterData() (Lines 557-610)

#### 3a. Create encounterDataPayload
```javascript
const encounterDataPayload = {
    Appointment: currentAppointment?.identifier,
    Identifier: effectiveEncounterId,
    Note: quillEncNotes ? JSON.stringify(quillEncNotes.getContents()) : null,
    Class: "AMB",
    Priority: encounterDOM.prioritySelect.value,  // Usually "routine"
    Length: encounterDurationSeconds,             // Timer duration
    Status: encounterState,                       // "in-progress"
    Subject: localPatientInfo.cpf,
    Practitioner: appState.user,
    actualStart: moment(actualStartTimestamp).format("YYYY-MM-DD HH:mm:ss"),
    actualEnd: isFinalSave && actualEndTimestamp ? moment(actualEndTimestamp).format("YYYY-MM-DD HH:mm:ss") : null,
};
```

#### 3b. Create wholeEncInfoForAI
```javascript
wholeEncInfoForAI.encounter = { data: { ...encounterDataPayload } };
if (quillEncNotes) wholeEncInfoForAI.encounter.Note = quillEncNotes.getText();
if (actualEndTimestamp) wholeEncInfoForAI.date = moment(actualEndTimestamp).format("YYYY-MM-DD HH:mm:ss");
wholeEncInfoForAI.duration = encounterDurationSeconds;
wholeEncInfoForAI.encId = effectiveEncounterId;
```

#### 3c. Create savePayload
```javascript
const savePayload = { 
    encounterData: encounterDataPayload, 
    wholeEncInfo: wholeEncInfoForAI 
};
```

#### 3d. Make API Call
```javascript
const { status } = await authenticatedFetch(`${appState.serverHost}/encounter/saveencounterinfo`, {
    method: "POST",
    body: savePayload,
});
```

### Step 4: Update Appointment Status
```javascript
if (currentAppointment?.identifier) {
    await authenticatedFetch(`${appState.serverHost}/appointment/updateAppointmentStatus`, {
        method: "POST",
        body: { status: "fulfilled", identifier: currentAppointment.identifier },
    });
}
```

### Step 5: Update URL
```javascript
window.location.search = `?encounterid=${newEncounterId}`;
```

## Complete wholeEncInfoForAI Structure (Lines 85-94)

```javascript
let wholeEncInfoForAI = {
    encId: "",
    pract: "",
    patient: "",
    date: "",
    duration: 0,
    appointment: {},
    encounter: {},
    encInfo: { clinical: [], medication: [], images: [], files: [], recordings: [] },
};
```

## Test Script Implementation

```javascript
// EXACT frontend replication
async function createTestInProgressEncounter() {
    // Step 1: Login and get headers
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
        username: 'fabiangc@gmail.com',
        password: 'senha2'
    });
    
    const headers = {
        'Authorization': `Bearer ${loginResponse.data.token}`,
        'Content-Type': 'application/json',
        'managingorg': 'ORG-000006',
        'practid': 'fabiangc@gmail.com'
    };

    // Step 2: Get next encounter ID (EXACT frontend)
    const nextIdResponse = await axios.get(`${BASE_URL}/getNextId/ENC`, { headers });
    const encounterId = nextIdResponse.data.nextval; // EXACT frontend extraction

    // Step 3: Create encounter objects (EXACT frontend structure)
    const encounterStartTime = new Date();
    
    const encounterDataPayload = {
        Appointment: appointmentId,              // From existing appointment
        Identifier: encounterId,
        Note: null,
        Class: "AMB",
        Priority: "routine",
        Length: 0,                              // Start with 0
        Status: "in-progress",
        Subject: "00636525872",                 // Patient CPF
        Practitioner: "fabiangc@gmail.com",
        actualStart: encounterStartTime.toISOString().slice(0, 19).replace('T', ' '),
        actualEnd: null
    };

    const wholeEncInfoForAI = {
        encId: encounterId,
        pract: "fabiangc@gmail.com",
        patient: "00636525872",
        date: encounterStartTime.toISOString().slice(0, 19).replace('T', ' '),
        duration: 0,
        appointment: { identifier: appointmentId },
        encounter: { data: { ...encounterDataPayload } },
        encInfo: { clinical: [], medication: [], images: [], files: [], recordings: [] }
    };

    const savePayload = { 
        encounterData: encounterDataPayload, 
        wholeEncInfo: wholeEncInfoForAI 
    };

    // Step 4: Save encounter (EXACT frontend call)
    const encounterResponse = await axios.post(
        `${BASE_URL}/encounter/saveencounterinfo`,
        savePayload,
        { headers }
    );

    // Step 5: Update appointment status (EXACT frontend call)
    await axios.post(
        `${BASE_URL}/appointment/updateAppointmentStatus`,
        { status: "fulfilled", identifier: appointmentId },
        { headers }
    );

    return { encounterId, appointmentId, success: true };
}
```

## Key Points

1. **MUST use `nextIdResponse.data.nextval`** - not .nextId or .data
2. **MUST include both `encounterData` AND `wholeEncInfo`** in savePayload
3. **MUST format dates as "YYYY-MM-DD HH:mm:ss"** using moment or equivalent
4. **MUST set appointment status to "fulfilled"** after encounter creation
5. **Length starts at 0** - gets updated by timer in frontend
6. **wholeEncInfo structure is required** - cannot be null

This EXACT replication should create encounters that appear in the mobile app's in-progress encounters list.