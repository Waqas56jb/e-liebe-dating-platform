const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Liveness (no DB)
app.get('/health', (req, res) => res.json({ ok: true, service: 'e-liebe-api' }));

// API
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
