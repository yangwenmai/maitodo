var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, settings = require('./settings')
	, flash = require('connect-flash');

var app = express();

app.set('appname', 'maitodo');
app.set('site_name', settings.sitename);
app.set('site_description', settings.sitedescription);
app.set('port', process.env.PORT || settings.httpport);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon(__dirname+'/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

if(settings.usepwd == "true") {
	app.use(express.session({
		secret: settings.cookieSecret,
		key: settings.db,
		cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30 days
	}));
}

app.use(express.session({
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30 days
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(app.router);

if('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
	console.log(app.get('appname')+ ' is running on port ' + app.get('port'));
	console.log('Thank you for using maitodo!');
});

routes(app);