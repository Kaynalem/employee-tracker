const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'Enter your password here',
    database: 'employeesDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    mainMenu();
});