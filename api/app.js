require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./docs/swagger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/ApiResponse');

const app = express();

app.use(cors());
app.use(express.json());

// Melayani file upload statis dari folder /files
app.use('/files', express.static(path.join(__dirname, 'files')));

// Home
app.get('/', (req, res) => {
  return ApiResponse.success(res, {
    message: 'Welcome to Codigram API 📸',
    data: { docs: '/api-docs' },
  });
});

// Swagger docs (Task 7)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Semua route utama
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  return ApiResponse.error(res, {
    message: 'Not found',
    details: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  });
});

// Error handler terpusat, harus di paling akhir
app.use(errorHandler);

module.exports = app;
