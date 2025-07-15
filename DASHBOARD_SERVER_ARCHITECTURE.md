# MedPro Dashboard Server Architecture

## Overview
The `serve-dashboard.js` is a Node.js HTTP server that provides a web interface for viewing consolidated project documentation and tasks across all MedPro repositories.

## Current Architecture

### Server Location
- **File**: `/medpro-docs/serve-dashboard.js`
- **Port**: 8888
- **Host**: localhost

### Current Functionality
The server currently:
1. Serves static files from the `medpro-docs` directory
2. Provides a landing page with dashboard options
3. Serves two main dashboard views:
   - **Auto-sync Dashboard** (`/auto`) - Reads from `MEDPRO_TASKS_CONSOLIDATED.md` with 30-second refresh
   - **Static Dashboard** (`/static`) - Fixed snapshot without auto-refresh

### File Structure Dependencies
```
medpro-docs/
├── serve-dashboard.js                    # Main server file
├── MEDPRO_TASKS_CONSOLIDATED.md         # Consolidated documentation (target file)
├── medpro-tasks-dashboard-auto.html     # Auto-refresh dashboard view
├── medpro-tasks-dashboard.html          # Static dashboard view
└── simple-dashboard.html               # Default landing page
```

## Intended Architecture (Not Yet Implemented)

### Multi-Repository Documentation Consolidation
The server is designed to work with a **consolidated documentation system** that should:

1. **Scan Multiple Repositories** for Markdown files:
   - `../medpro-mobile-app/` - Mobile app documentation
   - `../medproback/` - Backend documentation  
   - `../medprofront/` - Frontend documentation

2. **Generate Consolidated File**:
   - Collect all `.md` files from the three main repositories
   - Consolidate content into `MEDPRO_TASKS_CONSOLIDATED.md`
   - Serve this consolidated view through the dashboard

3. **Auto-Update Mechanism**:
   - Monitor MD files across repositories for changes
   - Regenerate consolidated file when source files change
   - Provide real-time updates to dashboard viewers

### Repository Structure Context
```
version3/
├── medpro-docs/           # Documentation hub + dashboard server
│   └── serve-dashboard.js
├── medpro-mobile-app/     # Mobile app (has README-WSL.md)
├── medproback/           # Backend (extensive docs/ folder)
├── medprofront/          # Frontend (multiple MD files in modules)
├── v2prod/               # Legacy (not included in consolidation)
└── medproapp/            # Main app (minimal docs)
```

### Key MD File Locations
- **medproback**: `docs/`, `config/`, `jobs/import/`, `SERVER_INFO.md`
- **medprofront**: `patient/`, `practitioner/`, `communication/`, multiple feature docs
- **medpro-mobile-app**: `README-WSL.md`

## Current Limitations
1. **No Multi-Repository Scanning**: Server only reads files from its own directory
2. **Manual Consolidation**: `MEDPRO_TASKS_CONSOLIDATED.md` must be manually created/updated
3. **Static Content**: No automatic regeneration of consolidated documentation

## Access Points
- **Main Dashboard**: `http://localhost:8888/`
- **Auto-Sync View**: `http://localhost:8888/auto`
- **Static View**: `http://localhost:8888/static`
- **Direct File Access**: `http://localhost:8888/MEDPRO_TASKS_CONSOLIDATED.md`

## Security Features
- Directory traversal prevention
- CORS headers for API access
- Proper MIME type handling
- Request logging

## Future Enhancement Plan
The server should be enhanced to:
1. Automatically scan sibling repositories for MD files
2. Generate/update `MEDPRO_TASKS_CONSOLIDATED.md` from all source files
3. Provide real-time consolidation and dashboard updates
4. Include file modification timestamps and source attribution