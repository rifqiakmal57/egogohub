const express = require('express');
const mysql = require('mysql2');
const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Create a connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crudDB'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Route to get all customers
app.get('/', (req, res) => {
    connection.query('SELECT * FROM customers', (err, results) => {
        if (err) throw err;
        res.render('index', { customers: results });
    });
});

// Route to handle the form submission for adding a new customer
app.post('/add', (req, res) => {
    const { name, email } = req.body;

    // Insert the new customer into the database
    const query = 'INSERT INTO customers (name, email) VALUES (?, ?)';
    connection.query(query, [name, email], (err, results) => {
        if (err) throw err;
        // Redirect to the homepage to show updated list
        res.redirect('/');
    });
});

// Route to show the edit form with current customer data
app.get('/edit/:id', (req, res) => {
    const customerId = req.params.id;

    // Fetch the customer data by ID
    connection.query('SELECT * FROM customers WHERE id = ?', [customerId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('edit', { customer: results[0] });
        } else {
            res.status(404).send('Customer not found');
        }
    });
});

// Route to handle the form submission for updating a customer
app.post('/edit/:id', (req, res) => {
    const customerId = req.params.id;
    const { name, email } = req.body;

    // Update the customer in the database
    const query = 'UPDATE customers SET name = ?, email = ? WHERE id = ?';
    connection.query(query, [name, email, customerId], (err, results) => {
        if (err) throw err;
        // Redirect to the homepage to show updated list
        res.redirect('/');
    });
});




// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
