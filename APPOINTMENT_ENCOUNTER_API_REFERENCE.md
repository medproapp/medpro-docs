# MedPro Appointment & Encounter API Reference

Complete API documentation for creating appointments and starting encounters with in-progress status.

## Authentication

```bash
# Login to get JWT token
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{"username":"fabiangc@gmail.com","password":"senha2"}'

# Response:
{
  "role": "pract",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": "fabiangc@gmail.com"
}
```

## 1. Appointment Creation APIs

### A. Full Appointment Creation (Manual)
**Endpoint:** `POST /appointment/saveappointment`

```bash
curl -X POST http://localhost:3333/appointment/saveappointment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "managingorg: ORG-000006" \
  -H "practid: fabiangc@gmail.com" \
  -d '{
    "status": "booked",
    "appointmenttype": "ROUTINE",
    "priority": "routine",
    "description": "Consulta de rotina",
    "subject": "00636525872",
    "practitioner": "fabiangc@gmail.com",
    "startdate": "2024-07-15",
    "starttime": "09:00:00",
    "enddate": "2024-07-15",
    "endtime": "10:00:00",
    "location": "126",
    "slot": "60",
    "comment": "Consulta de teste"
  }'
```

### B. Quick Appointment Creation (Auto-generated IDs)
**Endpoint:** `POST /appointment/createappointment`

```bash
curl -X POST http://localhost:3000/appointment/createappointment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "managingorg: ORG-000006" \
  -H "practid: fabiangc@gmail.com" \
  -d '{
    "subject": "00636525872",
    "practitioner": "fabiangc@gmail.com",
    "startdate": "2024-07-15",
    "starttime": "09:00:00",
    "location": "126"
  }'
```

### C. Auto-Schedule Appointment
**Endpoint:** `POST /appointment/autoschedule`

```bash
curl -X POST http://localhost:3000/appointment/autoschedule \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "managingorg: ORG-000006" \
  -H "practid: fabiangc@gmail.com" \
  -d '{
    "patientCpf": "00636525872",
    "practitionerEmail": "fabiangc@gmail.com",
    "preferredDate": "2024-07-15",
    "appointmentType": "ROUTINE",
    "locationId": "126"
  }'
```

## 2. Appointment Status Management

### Update Appointment Status
**Endpoint:** `PUT /appointment/updatestatus/:appointmentId`

```bash
# Available statuses: 'proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow', 'entered-in-error'

curl -X PUT http://localhost:3000/appointment/updatestatus/123456 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "managingorg: ORG-000006" \
  -d '{
    "status": "booked",
    "comment": "Status updated for testing"
  }'
```

## 3. Encounter Creation from Appointment

### A. Start Encounter from Appointment
**Endpoint:** `POST /encounter/startfromappointment`

```bash
curl -X POST http://localhost:3000/encounter/startfromappointment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "managingorg: ORG-000006" \
  -H "practid: fabiangc@gmail.com" \
  -d '{
    "appointmentId": 123456,
    "encounterClass": "AMB",
    "encounterType": "consultation",
    "priority": "routine"
  }'
```

### B. Direct Encounter Creation
**Endpoint:** `POST /encounter/saveencounterinfo`

```bash
curl -X POST http://localhost:3000/encounter/saveencounterinfo \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "managingorg: ORG-000006" \
  -H "practid: fabiangc@gmail.com" \
  -d '{
    "Status": "in-progress",
    "Class": "AMB",
    "Subject": "00636525872",
    "Practitioner": "fabiangc@gmail.com",
    "Appointment": 123456,
    "actualStart": "2024-07-15T09:00:00.000Z",
    "PlannedStartDate": "2024-07-15T09:00:00.000Z",
    "PlannedEndDate": "2024-07-15T10:00:00.000Z"
  }'
```

### C. Update Encounter Status
**Endpoint:** `PUT /encounter/updatestatus/:encounterId`

```bash
# Available statuses: 'planned', 'in-progress', 'on-hold', 'completed', 'cancelled', 'entered-in-error'

curl -X PUT http://localhost:3000/encounter/updatestatus/ENC-123456 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "managingorg: ORG-000006" \
  -d '{
    "status": "in-progress",
    "actualStart": "2024-07-15T09:00:00.000Z"
  }'
```

## 4. Database Schema Reference

### Appointments Table
```sql
CREATE TABLE appointments (
  identifier INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(50),
  appointmenttype VARCHAR(50),
  priority VARCHAR(20),
  description TEXT,
  subject VARCHAR(14),           -- Patient CPF
  practitioner VARCHAR(100),     -- Practitioner email
  startdate DATE,
  starttime TIME,
  enddate DATE,
  endtime TIME,
  location VARCHAR(10),         -- Location ID
  slot INT,                     -- Duration in minutes
  comment TEXT,
  cancellationReason TEXT,
  managingOrganization VARCHAR(20)
);
```

### Encounters Table
```sql
CREATE TABLE encounters (
  Identifier VARCHAR(10) PRIMARY KEY,
  Status VARCHAR(20),           -- 'in-progress', 'on-hold', 'completed', etc.
  Class VARCHAR(10),            -- 'AMB' (Ambulatory), 'EMER' (Emergency), etc.
  Subject VARCHAR(14),          -- Patient CPF
  Practitioner VARCHAR(100),    -- Practitioner email
  Appointment INT,              -- FK to appointments.identifier
  actualStart DATETIME,
  actualEnd DATETIME,
  PlannedStartDate DATETIME,
  PlannedEndDate DATETIME,
  Length INT,                   -- Duration in seconds
  LocationReference INT
);
```

## 5. Complete Test Script Workflow

```javascript
// create-test-encounter.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const TEST_DATA = {
  practitioner: 'fabiangc@gmail.com',
  patient: '00636525872',
  organization: 'ORG-000006',
  location: '126'
};

async function createTestInProgressEncounter() {
  try {
    // Step 1: Login
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: 'fabiangc@gmail.com',
      password: 'senha2'
    });
    
    const token = loginResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'managingorg': TEST_DATA.organization,
      'practid': TEST_DATA.practitioner
    };

    // Step 2: Create Appointment
    console.log('📅 Creating appointment...');
    const appointmentData = {
      status: 'booked',
      appointmenttype: 'ROUTINE',
      priority: 'routine',
      description: 'Test appointment for in-progress encounter',
      subject: TEST_DATA.patient,
      practitioner: TEST_DATA.practitioner,
      startdate: new Date().toISOString().split('T')[0],
      starttime: '09:00:00',
      enddate: new Date().toISOString().split('T')[0],
      endtime: '10:00:00',
      location: TEST_DATA.location,
      slot: 60,
      comment: 'Generated by test script'
    };

    const appointmentResponse = await axios.post(
      `${BASE_URL}/appointment/saveappointment`,
      appointmentData,
      { headers }
    );

    const appointmentId = appointmentResponse.data.appointmentId;
    console.log(`✅ Appointment created with ID: ${appointmentId}`);

    // Step 3: Start Encounter from Appointment
    console.log('🏥 Starting encounter...');
    const encounterData = {
      appointmentId: appointmentId,
      encounterClass: 'AMB',
      encounterType: 'consultation',
      priority: 'routine'
    };

    const encounterResponse = await axios.post(
      `${BASE_URL}/encounter/startfromappointment`,
      encounterData,
      { headers }
    );

    const encounterId = encounterResponse.data.encounterId;
    console.log(`✅ Encounter started with ID: ${encounterId}`);

    // Step 4: Set Encounter Status to In-Progress
    console.log('⏳ Setting encounter to in-progress...');
    await axios.put(
      `${BASE_URL}/encounter/updatestatus/${encounterId}`,
      {
        status: 'in-progress',
        actualStart: new Date().toISOString()
      },
      { headers }
    );

    console.log('✅ Encounter set to in-progress status');

    // Step 5: Verification
    console.log('🔍 Verifying created data...');
    const verifyResponse = await axios.get(
      `${BASE_URL}/encounter/getencounters/practitioner/${TEST_DATA.practitioner}?status={"filter1":"in-progress","filter2":"","filter3":""}`,
      { headers }
    );

    console.log(`✅ Found ${verifyResponse.data.data?.length || 0} in-progress encounters`);
    
    return {
      appointmentId,
      encounterId,
      success: true
    };

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return { success: false, error };
  }
}

// Run the test
createTestInProgressEncounter()
  .then(result => {
    if (result.success) {
      console.log('🎉 Test encounter created successfully!');
      console.log(`Appointment ID: ${result.appointmentId}`);
      console.log(`Encounter ID: ${result.encounterId}`);
    }
  })
  .catch(console.error);
```

## 6. Running the Test Script

```bash
# Install dependencies
cd /home/adminuser/medpro/repo/version3
npm install axios

# Run the script
node create-test-encounter.js
```

## 7. Verification Queries

### Check Created Appointments
```bash
curl -X GET "http://localhost:3000/appointment/getnextappointments/fabiangc@gmail.com?days=7" \
  -H "Authorization: Bearer $TOKEN" \
  -H "managingorg: ORG-000006" \
  -H "practid: fabiangc@gmail.com"
```

### Check In-Progress Encounters
```bash
curl -X GET "http://localhost:3000/encounter/getencounters/practitioner/fabiangc@gmail.com?status=%7B%22filter1%22:%22in-progress%22,%22filter2%22:%22on-hold%22,%22filter3%22:%22%22%7D" \
  -H "Authorization: Bearer $TOKEN" \
  -H "managingorg: ORG-000006" \
  -H "practid: fabiangc@gmail.com"
```

## 8. Common Status Values

### Appointment Statuses
- `proposed` - Appointment proposed
- `pending` - Waiting for confirmation
- `booked` - Confirmed appointment
- `arrived` - Patient has arrived
- `fulfilled` - Appointment completed
- `cancelled` - Appointment cancelled
- `noshow` - Patient didn't show up

### Encounter Statuses
- `planned` - Encounter is planned
- `in-progress` - Encounter is active
- `on-hold` - Encounter is paused
- `completed` - Encounter finished
- `cancelled` - Encounter cancelled
- `entered-in-error` - Data entry error

This reference provides everything needed to create appointments and start in-progress encounters for testing the mobile app functionality.