#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 8888;
const HOST = 'localhost';

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Get MIME type based on file extension
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

// Serve static files
function serveFile(res, filePath) {
    console.log(`[SERVE] Reading file: ${filePath}`);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`[SERVE] Error reading file ${filePath}:`, err.message);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h1>404 - File Not Found</h1>
                        <p>The file <code>${filePath}</code> was not found.</p>
                        <a href="/">← Back to Dashboard</a>
                    </body>
                </html>
            `);
            return;
        }

        const mimeType = getMimeType(filePath);
        res.writeHead(200, {
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(data);
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    let requestedPath = req.url;
    
    // Log requests with more details
    console.log(`[${new Date().toISOString()}] ${req.method} ${requestedPath}`);
    console.log(`[SERVER] User-Agent: ${req.headers['user-agent']}`);
    console.log(`[SERVER] Headers:`, Object.keys(req.headers));
    
    // Handle root path - serve simple dashboard
    if (requestedPath === '/' || requestedPath === '/index.html') {
        requestedPath = '/simple-dashboard.html';
    }
    
    // Handle specific dashboard requests
    if (requestedPath === '/auto' || requestedPath === '/dashboard-auto') {
        requestedPath = '/medpro-tasks-dashboard-auto.html';
    }
    
    if (requestedPath === '/static' || requestedPath === '/dashboard-static') {
        requestedPath = '/medpro-tasks-dashboard.html';
    }
    
    // Remove leading slash and resolve file path
    const fileName = requestedPath.substring(1);
    const filePath = path.join(__dirname, fileName);
    
    // Security check - prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                    <h1>403 - Forbidden</h1>
                    <p>Access denied.</p>
                    <a href="/">← Back to Dashboard</a>
                </body>
            </html>
        `);
        return;
    }
    
    console.log(`[SERVER] Resolved file path: ${filePath}`);
    console.log(`[SERVER] Checking if file exists...`);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`[SERVER] File not found: ${filePath}`);
            // File doesn't exist - show available options
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head>
                        <title>MedPro Dashboard Server</title>
                        <style>
                            body { 
                                font-family: 'Segoe UI', Arial, sans-serif; 
                                max-width: 800px; 
                                margin: 50px auto; 
                                padding: 20px;
                                background: #f8f9fa;
                            }
                            .container {
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                            }
                            h1 { color: #5d7381; margin-bottom: 20px; }
                            .dashboard-link {
                                display: block;
                                padding: 15px 20px;
                                margin: 10px 0;
                                background: #5d7381;
                                color: white;
                                text-decoration: none;
                                border-radius: 8px;
                                transition: background 0.3s;
                            }
                            .dashboard-link:hover {
                                background: #4a6572;
                            }
                            .description {
                                color: #666;
                                margin-bottom: 30px;
                                line-height: 1.6;
                            }
                            .feature {
                                background: #e8f4f8;
                                padding: 10px 15px;
                                margin: 5px 0;
                                border-radius: 5px;
                                border-left: 4px solid #5d7381;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>📋 MedPro Dashboard Server</h1>
                            <p class="description">
                                Welcome to the MedPro Tasks Dashboard server! 
                                Choose which version of the dashboard you'd like to view:
                            </p>
                            
                            <a href="/auto" class="dashboard-link">
                                🔄 Auto-Sync Dashboard (Recommended)
                            </a>
                            <div class="feature">✨ Automatically reads from MEDPRO_TASKS_CONSOLIDATED.md</div>
                            <div class="feature">🔄 Updates every 30 seconds</div>
                            <div class="feature">📊 Real-time sync status</div>
                            
                            <a href="/static" class="dashboard-link">
                                📋 Static Dashboard
                            </a>
                            <div class="feature">📸 Fixed snapshot of tasks</div>
                            <div class="feature">⚡ Fast loading</div>
                            <div class="feature">🔒 No file dependencies</div>
                            
                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                            
                            <h3>📁 Available Files:</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li>📄 <a href="/MEDPRO_TASKS_CONSOLIDATED.md">MEDPRO_TASKS_CONSOLIDATED.md</a></li>
                                <li>🌐 <a href="/medpro-tasks-dashboard-auto.html">Auto-sync Dashboard</a></li>
                                <li>📋 <a href="/medpro-tasks-dashboard.html">Static Dashboard</a></li>
                            </ul>
                            
                            <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
                                Server running on <strong>http://${HOST}:${PORT}</strong><br>
                                Press Ctrl+C to stop the server
                            </p>
                        </div>
                    </body>
                </html>
            `);
            return;
        }
        
        console.log(`[SERVER] File exists, serving: ${filePath}`);
        // File exists - serve it
        serveFile(res, filePath);
    });
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error(`   Try a different port or stop the process using port ${PORT}`);
        console.error(`   You can find what's using the port with: lsof -i :${PORT}`);
    } else {
        console.error('❌ Server error:', err);
    }
    process.exit(1);
});

// Handle graceful shutdown
function gracefulShutdown(signal) {
    console.log(`\n\n🛑 Received ${signal}. Shutting down MedPro Dashboard server...`);
    
    // Stop accepting new connections immediately
    server.close((err) => {
        if (err) {
            console.error('❌ Error during server shutdown:', err);
        } else {
            console.log('✅ Server stopped gracefully');
        }
        process.exit(0);
    });
    
    // Force shutdown after 2 seconds if graceful shutdown fails
    setTimeout(() => {
        console.log('⚠️  Force shutting down server...');
        process.exit(0);
    }, 2000);
}

// Listen for various shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

// Handle uncaught exceptions to prevent hanging
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
server.listen(PORT, HOST, () => {
    console.log('\n🚀 MedPro Dashboard Server Started!');
    console.log('════════════════════════════════════');
    console.log(`📍 Server URL: http://${HOST}:${PORT}`);
    console.log(`🔄 Auto-sync: http://${HOST}:${PORT}/auto`);
    console.log(`📋 Static:    http://${HOST}:${PORT}/static`);
    console.log('════════════════════════════════════');
    console.log('📊 Dashboard will auto-refresh every 30 seconds');
    console.log('🔧 Press Ctrl+C to stop the server');
    console.log('📝 Server logs:');
    console.log('');
});

// Export for potential module use
module.exports = { server, PORT, HOST };