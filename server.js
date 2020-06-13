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
    database: 'employeesdb'
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
                await addEmployee();
                break;
            case 'Remove Employee':
                //await removeEmployee();
                break;
            case 'Update Employee Role':
                await updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                await updateEmployeeManager();
                break;
            case 'View All Roles':
                await viewAllRoles();                
                break;
            case 'Add a Role':
                await addRole();
                break;
            case 'Remove Role':
                //await removeRole();
                break;
            case 'View All Departments':
                await viewAllDepartments();
                break;
            case 'Add a Department':
                await addDepartment();
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
// only shows the different roles does not show duplicates since each role has a specific salary
// to show based employees/duplicates, add INNER JOIN employee ON employee.role_id = role.id
function viewAllRoles() {
    connection.query(`SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role 
    INNER JOIN department ON role.department_id = department.id
    ORDER BY ID ASC`,
    function (err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu()
    });
}

// when View All Departments is selected, display formatted table showing department names and department ids
function viewAllDepartments() {
    connection.query(`SELECT id, name AS department 
    FROM department 
    ORDER BY ID ASC`,
    function (err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu()
    });
}

// when Add a Department is selected user is prompted to enter the name of the department and that department is added to the database
async function addDepartment() {
    await inquirer.prompt([
        {
        type: 'input',
        name: 'department',
        message: 'What department would you like to add?',
        }
    ])
    .then(async function(answer){
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: answer.department,
            },
            function (err, res) {
                if (err) throw err;
                console.table('Added new department: '  + answer.department);
                mainMenu();
            }
        );
    });
}

// when Add a Role is selected user prompted to enter the name, salary, and department for the role and that role is added to the database
async function addRole() {
    connection.query('SELECT * FROM department;', 
    async function (err, departments) {
    if (err) throw err;
    await inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list',
            name: 'choice',
            message: 'What department does this role belong to?',
            choices: 
                //populate from db
                async function () {
                    var departmentChoices = [];
                    for (var i = 0; i < departments.length; i++) {
                        departmentChoices.push(departments[i].name);
                    }
                    return departmentChoices;
                }
        },
    ])
    .then(async function(answer){
        for (var i = 0; i < departments.length; i++) {
            if (departments[i].name === answer.choice) {
                departmentID = departments[i].id;
            }
        }
        connection.query(
            'INSERT INTO role SET ?',
            {
                title: answer.role,
                salary: answer.salary,
                department_id: departmentID
            }, 
            function (err) {
            if (err) throw err;
            console.table('Added new role: ' + answer.role);
                mainMenu();
            });
        });
    });
}
// when Add Employee is selected user is prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
async function addEmployee() {
    // get roles from db
    connection.query('SELECT * FROM role;', 
    async function (err, roles) {
        if (err) throw err;
        //get employees from db
        connection.query(`SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`, 
        async function (err, managers) {
        if (err) throw err;
        await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the employee\'s first name?',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the employee\'s last name?',
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s role?',
                choices: 
                    //populate from db
                    async function () {
                        var roleChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            roleChoices.push(roles[i].title);
                        }
                        return roleChoices;
                    }
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the employee\'s manager?',
                choices: 
                    //populate from db
                    async function () {
                        var managerChoices = [];
                        for (var i = 0; i < managers.length; i++) {
                            managerChoices.push(managers[i].Employee);
                        }
                        return managerChoices;
                    }
            }
        ]).then(async function(answer){
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].title === answer.role) {
                    roleID = roles[i].id;
                }
            }
            for (var i = 0; i < managers.length; i++) {
                if (managers[i].Employee === answer.manager) {
                    managerID = managers[i].id;
                }
            }
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: roleID,
                    manager_id: managerID
                }, 
                function (err) {
                if (err) throw err;
                console.table('Added new employee: ' + answer.first_name + ' ' + answer.last_name);
                    mainMenu();
                });
            });
        });
    });
}
// when Update Employee Role is selected user is prompted to select an employee to update and their new role and this information is updated in the database
async function updateEmployeeRole() {
    // get roles from db
    connection.query('SELECT * FROM role;', 
    async function (err, roles) {
        if (err) throw err;
        //get employees from db
        connection.query(`SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`, 
        async function (err, employees) {
        if (err) throw err;
        await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: 
                    //populate from db
                    async function () {
                        var employeeChoices = [];
                        for (var i = 0; i < employees.length; i++) {
                            employeeChoices.push(employees[i].Employee);
                        }
                        return employeeChoices;
                    }
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s new role?',
                choices: 
                    //populate from db
                    async function () {
                        var roleChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            roleChoices.push(roles[i].title);
                        }
                        return roleChoices;
                    }
            }
            
        ]).then(async function(answer){
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].title === answer.role) {
                    roleID = roles[i].id;
                }
            }
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].Employee === answer.employee) {
                    employeeID = employees[i].id;
                }
            }
            //update employee with new role
            connection.query(
                `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`,
                function (err) {
                if (err) throw err;
                console.table(answer.employee + ' role updated to ' + answer.role);
                    mainMenu();
                });
            });
        });
    });
}
// when Update Employee Manager is selected user is prompted to select an employee to update and their new Manager and this information is updated in the database
async function updateEmployeeManager() {
    
    //get employees from db
    connection.query(`SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`, 
    async function (err, employees) {
    if (err) throw err;
    await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: 
                //populate from db
                async function () {
                    var employeeChoices = [];
                    for (var i = 0; i < employees.length; i++) {
                        employeeChoices.push(employees[i].Employee);
                    }
                    return employeeChoices;
                }
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is their new manager?',
            choices: 
                //populate from db
                async function () {
                    var employeeChoices = [];
                    for (var i = 0; i < employees.length; i++) {
                        employeeChoices.push(employees[i].Employee);
                    }
                    return employeeChoices;
                }
        },
        
    ]).then(async function(answer){
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].Employee === answer.employee) {
                employeeID = employees[i].id;
            }
        }
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].Employee === answer.manager) {
                managerID = employees[i].id;
            }
        }
        //update employee with new manager
        connection.query(
            `UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`,
            function (err) {
            if (err) throw err;
            console.table(answer.employee + ' manager updated to ' + answer.manager);
                mainMenu();
            });
        });
    });
}
