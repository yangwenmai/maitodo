var Todo = require('../models/todo.js');
var settings = require('../settings');

module.exports = function(app) {
	app.get('/', function(req, res){
		var page = req.query.p?parseInt(req.query.p):1;
		console.log('/ page :'+page);
		Todo.getTen(null, page, function(err, todos){
			if(err) {
				todos = [];
				console.log('error'+err);
			}
			console.log('todos:'+todos.length);
			res.render('index.ejs', {
				todos: todos,
				page: page,
				site_name: settings.site_name,
				site_description: settings.site_description,
				todosLen: todos.length,
				success: req.flash('success').toString(),
				err: req.flash('error').toString()
			});
		});
	});
	app.post('/todo/new', function(req, res){
		var title = req.body.title || '';
		console.log('title:'+title);
		if(!title){
			return res.render('error.ejs', {message: '标题是必须的'});
		}
		var todo = new Todo(req.body.title, 0, new Date());
		console.log('/todo/new title:'+todo.title);
		todo.save(function(err){
			if(err){
				console.log('error'+err);
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '发表成功!');
			res.redirect('/');
		});
	});
	app.get('/todo/:id/edit', function(req, res){
		var id = req.params.id;
		console.log('id:'+id);
		Todo.getOne(id, function(err, todo){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			console.log('edit id is :' + id);
			res.render('todo/edit.ejs', {
				todo: todo,
				id: id,
				site_name: settings.site_name,
				site_description: settings.site_description,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});
	app.post('/todo/update', function(req, res){
		var id = req.body.id;
		console.log('update id is ' + id);
		var title = req.body.title||'';
		title = title.trim();
		if(!title){
			return res.render('error.ejs', {message: '标题是必须的'});
		}
		console.log('id:'+id+",title:"+title);
		Todo.update(id, title, function(err, result){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '保存成功!');
			res.redirect('/');
		});
	});
	app.get('/todo/:id/delete', function(req, res){
		var id = req.params.id;
		console.log('delete id:'+id);
		Todo.remove(id, function(err){
			if(err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '删除成功');
			res.redirect('/');
		});
	});
	app.get('/todo/:id/finish', function(req, res){
		console.log('url is /todo/:id/finish');
		var finished = req.query.status ==='yes'?1:0;
		var id = req.params.id;
		console.log('finish id is :' + id + ',finished is '+finished);
		Todo.finishById(id, finished, function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '完成');
			res.redirect('/');
		});
	});
	app.get('*', function(req, res){
		console.log('404 handler...');
		res.render('404', {
			status: 404,
			site_name: settings.site_name,
			site_description: settings.site_description,
			title: settings.site_name,
		});
	});
}