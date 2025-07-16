const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // For serving static files

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Uijwal@7', // Replace with your MySQL password
    database: 'medicine_locator', // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// API to Fetch All Medicines
app.get('/api/medicines', (req, res) => {
    const query = 'SELECT * FROM medicines';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching medicines:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// API to Search Medicines by Name
app.get('/api/medicines/search', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name parameter is required' });
    }

    const query = 'SELECT * FROM medicines WHERE name LIKE ?';
    db.query(query, [`%${name}%`], (err, results) => {
        if (err) {
            console.error('Error searching medicines:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.post('/api/medicines', (req, res) => {
    const { name, row_num, rack } = req.body;

    if (!name || !row_num || !rack) {
        console.log("Missing fields:", req.body);
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO medicines (name, row_num, rack) VALUES (?, ?, ?)';
    db.query(query, [name, row_num, rack], (err, results) => {
        if (err) {
            console.error('Error adding medicine:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        console.log("Insert Success:", results);
        res.json({ message: 'Medicine added successfully', id: results.insertId });
    });
});


// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to Delete a Medicine by Name
// API to Delete a Medicine by Name
app.delete('/api/medicines/:name', (req, res) => {
    const { name } = req.params;
    
    const query = 'DELETE FROM medicines WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Error deleting medicine:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        res.json({ message: 'Medicine deleted successfully' });
    });
});

 

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});