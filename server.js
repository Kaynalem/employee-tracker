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
    password: 'your password',
    database: 'employeesDB'
});

connection.connect(err => {
    if (err) throw err;
    //console.log('connected as id ' + connection.threadId);
    console.log(` 
    ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
    ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
    █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
    ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
    ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
    ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗        
    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗       
    ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝       
    ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗       
    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║       
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝       
`)
    mainMenu();
});
// Main menu prompts
async function mainMenu() {
    let choices = [
        'View All Employees',
        'View All Employees By Department',
        'View All Employees By Manager',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Roles',
        'Add a Role',
        'Remove Role',
        'View All Departments',
        'Add a Department',
        'Remove Department',
        'View Department Budget',
        'Exit']
    await inquirer.prompt([
        {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: choices,
        pageSize: choices.length
        }
    ])
    .then(async function(answers){
        switch(answers.choice){
            case 'View All Employees':
                await viewAllEmployees();                
                break;
            case 'View All Employees by Department':
                //await viewEmployeesByDepartment();                
                break;
            case 'View All Employees by Manager':
                //await viewEmployeesByManager();                
                break;
            case 'Add Employee':
                //await addEmployee();
                break;
            case 'Remove Employee':
                //await removeEmployee();
                break;
            case 'Update Employee Role':
                //await updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                //await updateEmployeeManager();
                break;
            case 'View All Roles':
                await viewAllRoles();                
                break;
            case 'Add a Role':
                //await addRole();
                break;
            case 'Remove Role':
                //await removeRole();
                break;
            case 'View All Departments':
                await viewAllDepartments();
                break;
            case 'Add a Department':
                //await addDepartment();
                break;
            case 'Remove Department':
                //await removeDepartment();                
                break;
            case 'View Department Budgets':
                //await viewDepartmentBudgets();                
                break;
            case 'Exit':  
                connection.end();   
                break;
            default:
                connection.end();
                break;
        }
    });
}
// when View All Employees is selected, display formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name, ' ' ,  manager.last_name) AS manager 
    FROM employee 
    employee LEFT JOIN employee manager ON employee.manager_id = manager.id 
    INNER JOIN role ON employee.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id 
    ORDER BY ID ASC`,
    function (err, res) {
    console.table(res);
    if (err) throw err;
    mainMenu()
    });
}

// when View All Roles is selected, display formatted table showing job title, role id, the department that role belongs to, and the salary for that role
//sorts out duplicates
function viewAllRoles() {
    connection.query(`SELECT DISTINCT role.id, role.title, department.name AS department, role.salary 
    FROM role 
    INNER JOIN department ON role.department_id = department.id
    INNER JOIN employee ON employee.role_id = role.id
    ORDER BY ID ASC`,
    function (err, res) {
    console.table(res);
    if (err) throw err;
    mainMenu()
    });
}

// when View All Departments is selected, display formatted table showing department names and department ids
function viewAllDepartments() {
    connection.query(`SELECT id, name AS department 
    FROM department 
    ORDER BY ID ASC`,
    function (err, res) {
    console.table(res);
    if (err) throw err;
    mainMenu()
    });
}