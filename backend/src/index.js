require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const { errorHandler, notFound } = require('./utils/errors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const supplierRoutes = require('./routes/suppliers');
const supplierOrderRoutes = require('./routes/supplierOrders');
const materialRequestRoutes = require('./routes/materialRequests');
const clientOrderRoutes = require('./routes/clientOrders');
const deliveryRoutes = require('./routes/deliveries');
const auditLogRoutes = require('./routes/auditLogs');
const notificationRoutes = require('./routes/notifications');
const quoteRequestRoutes = require('./routes/quoteRequests');
const projectFormRoutes = require('./routes/projectForms');
const stockTransactionRoutes = require('./routes/stockTransactions');
const dashboardRoutes = require('./routes/dashboard');
const activityRoutes = require('./routes/activities');
const insightsRoutes = require('./routes/insights');
const aiRoutes = require('./routes/ai');
const companyRoutes = require('./routes/company');
const publicRoutes = require('./routes/public');

const app = express();
const uploadsDir = path.join(__dirname, '..', 'uploads');
const frontendDistDir = path.join(__dirname, '..', 'public');

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

function getExpectedOrigin(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = forwardedProto ? String(forwardedProto).split(',')[0].trim() : req.protocol;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${protocol}://${String(host).trim()}` : '';
}

app.set('trust proxy', 1);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadsDir));
app.use(morgan('dev'));

// Basic CSRF mitigation: enforce Origin on state-changing requests
app.use((req, res, next) => {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return next();
  if (allowedOrigins.length === 0) return next();

  const origin = req.headers.origin || '';
  const expectedOrigin = getExpectedOrigin(req);

  if (origin && (allowedOrigins.includes(origin) || origin === expectedOrigin)) {
    return next();
  }

  return res.status(403).json({ error: 'Invalid origin' });
});

// Basic input sanitization to reduce XSS risks
app.use((req, _res, next) => {
  const sanitize = (value) => {
    if (typeof value === 'string') {
      return value.replace(/[<>]/g, '');
    }
    if (Array.isArray(value)) {
      return value.map(sanitize);
    }
    if (value && typeof value === 'object') {
      Object.keys(value).forEach((key) => {
        value[key] = sanitize(value[key]);
      });
      return value;
    }
    return value;
  };
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', supplierOrderRoutes);
app.use('/api/material-requests', materialRequestRoutes);
app.use('/api/orders', clientOrderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/quote-requests', quoteRequestRoutes);
app.use('/api/project-forms', projectFormRoutes);
app.use('/api/transactions', stockTransactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/public', publicRoutes);

if (fs.existsSync(frontendDistDir)) {
  app.use(express.static(frontendDistDir));

  app.get(/^\/(?!api\/|uploads\/|health$).*/, (_req, res) => {
    res.sendFile(path.join(frontendDistDir, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
let server = null;

if (require.main === module) {
  server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

module.exports = { app, server };
