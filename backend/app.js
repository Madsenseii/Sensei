const path = require('path');
const fs = require('fs');

// Multi-path dotenv resolution (supports running from root, backend/, or serverless)
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(process.cwd(), 'backend', '.env')
];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    require('dotenv').config({ path: p });
    break;
  }
}

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

// Parse custom allowed origins from .env
const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);

    // If wildcard or no specific origins defined, allow
    if (configuredOrigins.includes('*') || configuredOrigins.length === 0) {
      return callback(null, true);
    }

    // Check exact matches
    if (configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow vercel preview / production deployments and localhost
    if (
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    return callback(null, true); // Permissive default for frictionless API calls
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health check endpoint (mounted at both /api/health and /health)
const healthHandler = (req, res) => {
  res.json({
    result: 'ok',
    message: 'Mad Sensei backend is live.',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production'
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount API routes with and without /api prefix for seamless Vercel / serverless routing
app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/', authRoutes);
app.use('/', orderRoutes);

// Static file serving for local all-in-one development (npm run dev / node backend/server.js)
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('/shop', (req, res) => {
    res.sendFile(path.join(publicDir, 'shop.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    result: 'error',
    message: `Endpoint ${req.originalUrl} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    result: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : (err.message || 'Server error')
  });
});

module.exports = app;