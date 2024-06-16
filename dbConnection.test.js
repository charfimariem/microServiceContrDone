// dbConnection.test.js

const mysql = require('mysql');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

describe('Database Connection', () => {
  test('Should connect to the database', (done) => {
    const db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    db.connect((err) => {
      if (err) {
        fail('Failed to connect to the database: ' + err.stack);
      } else {
        console.log('Connected to MySQL database');
        db.end(); // Fermer la connexion après le test
        done();
      }
    });
  });
});
