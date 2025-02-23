const express = require('express');
const mysql = require('mysql2'); // Import mysql2 once
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // Replace with your MySQL host
    user: 'root',      // Replace with your MySQL username
    password: 'Uijwal@7', // Replace with your MySQL password
    database: 'medicine_locator' // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// API to search for medicine
app.get('/api/medicines', (req, res) => {
    const { name } = req.query;
    let query = 'SELECT * FROM medicines';
    let queryParams = [];

    if (name) {
        query += ' WHERE name LIKE ?';
        queryParams.push(`%${name}%`);
    }

    console.log('Executing Query:', query); // Log the query
    console.log('Query Parameters:', queryParams); // Log the parameters

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database Error:', err); // Log the error
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json(results);
    });
});

// API to add a new medicine
app.post('/api/medicines', (req, res) => {
    const { name, row, rack } = req.body;

    // Validate input
    if (!name || !row || !rack) {
        return res.status(400).json({ error: 'All fields (name, row, rack) are required' });
    }

    // Insert into the database
    const query = 'INSERT INTO medicines (name, row_number, rack) VALUES (?, ?, ?)'; // Use row_number
    db.query(query, [name, row, rack], (err, results) => {
        if (err) {
            console.error('Error adding medicine:', err); // Log the error
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ message: 'Medicine added successfully', id: results.insertId });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});