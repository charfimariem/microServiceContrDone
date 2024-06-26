const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const promClient = require('prom-client'); // Import prom-client library
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5050; // Use PORT from environment variables or default to 5050

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Enable Prometheus metrics collection
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Create a histogram metric for request duration
const etudiantRequestDurationMicroseconds = new promClient.Histogram({
  name: 'etudiant_request_duration_seconds',
  help: 'Duration of etudiant-ms service HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram metric
register.registerMetric(etudiantRequestDurationMicroseconds);

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = etudiantRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.url, code: res.statusCode });
  });
  next();
});

// Route to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.get('/etudiant', (req, res) => {
  const query = 'SELECT * FROM etudiant';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/etudiant', (req, res) => {
  const { cin, nom, prenom, numtel, email, department, classe, password } = req.body;
  const query = 'INSERT INTO etudiant (cin, nom, prenom, numtel, email, department, classe, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [cin, nom, prenom, numtel, email, department, classe, password], (err, result) => {
    if (err) {
      console.error('Error adding student:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(201).json({ message: 'Student added successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
