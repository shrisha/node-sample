/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , EmployeeProvider = require('./employeeprovider').EmployeeProvider;

var app = express();
routes=require('./routes/index.js');

var initLogger=function(req,res,next){
    console.log("fkjfkjflkjfkljdfljdlf");
    next();
}

express.logger.token('rid', function(req, res){
    if(!req.rid){
        req.rid=Math.floor(Math.random()*100000);
    }else{
        return req.rid;
    }
    return req.rid;
})


express.logger.token('sid', function(req, res){ return req.sessionID; })
express.logger.format('splunk', 'rid=:rid; sid=:sid; ip=:remote-addr; d=[:date]; m=:method; u=:url; s=:status; ref=:referrer; ua=:user-agent; t=:response-time');



var notFound=function (req,res,next){
    res.send("404","Custom 404 page goes here");
};

var errorHandler=function (err,req,res,next){
    res.send("500","Custom 500 page goes here");
};

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    //app.use(initLogger);
    app.use(express.favicon());
    app.use(express.cookieParser("boorah"));
    app.use(express.session({secret: "boorah"}));
    app.use(express.logger('splunk'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(notFound); //this is registered after app.router so that it's the fall-through route
    app.use(errorHandler);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var employeeProvider= new EmployeeProvider('localhost', 27017);

//Routes


app.get('/',routes.index);
app.get('/employee/new', routes.newEmployee);
//save new employee
app.post('/employee/new', routes.saveNewEmployee);
//update an employee
app.get('/employee/:id/edit',routes.editEmployee);
//save updated employee
app.post('/employee/:id/edit', routes.updateEmployee);

//delete an employee
app.post('/employee/:id/delete', routes.deleteEmployee);

app.listen(3000);