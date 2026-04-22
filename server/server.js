const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware: size limits and JSON parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all /api/* routes
app.use('/api/', apiLimiter);

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/pollinators', require('./routes/pollinatorRoutes'));
app.use('/api/morphology', require('./routes/morphologyRoutes'));
app.use('/api/environmental', require('./routes/environmentalRoutes'));
app.use('/api/research', require('./routes/researchRoutes'));

// Health check endpoint (read-only, no state changes)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Ensure all /api routes are GET-only (read-only)

app.post('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(403).json({ error: 'Write operations not allowed' });
  }
  next();
});

app.put('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(403).json({ error: 'Write operations not allowed' });
  }
  next();
});

app.delete('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(403).json({ error: 'Write operations not allowed' });
  }
  next();
});

if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../frontend/dist/stl-echo-frontend');

  app.use(express.static(frontendDistPath));

  // Let Angular handle all non-API routes in production.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ 
    error: status === 404 ? 'Not found' : 'Something went wrong!' 
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
