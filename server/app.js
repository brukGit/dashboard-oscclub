const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const pool = require('./db'); // Import the pool

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Middleware to attach pool to request
app.use((req, res, next) => {
    req.pool = pool;
    next();
});

app.use('/api/data', dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
