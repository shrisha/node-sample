var EmployeeProvider = require('../employeeprovider').EmployeeProvider;
var employeeProvider= new EmployeeProvider('localhost', 27017);

exports.index=function(req, res){
    employeeProvider.findAll(function(error, emps){
        res.render('index', {
            title: 'Employees',
            employees:emps
        });
    });
};

exports.newEmployee=function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
}

//save new employee
exports.saveNewEmployee=function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
}

exports.editEmployee=function(req, res) {
    employeeProvider.findById(req.param('_id'), function(error, employee) {
        res.render('employee_edit',
            {
                employee: employee
            });
    });
}

//save updated employee
exports.updateEmployee=function(req, res) {
    employeeProvider.update(req.param('_id'),{
        title: req.param('title'),
        name: req.param('name')
    }, function(error, docs) {
        res.redirect('/')
    });
}

//delete an employee
exports.deleteEmployee=function(req, res) {
    employeeProvider.delete(req.param('_id'), function(error, docs) {
        res.redirect('/')
    });
}