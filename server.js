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
    //database: 'employeesDB'
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
                //await viewAllEmployees();                
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
                //await viewAllRoles();                
                break;
            case 'Add a Role':
                //await addRole();
                break;
            case 'Remove Role':
                //await removeRole();
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
