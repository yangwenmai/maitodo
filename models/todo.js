var MongoClient = require('mongodb').MongoClient,
    settings = require('../settings');
var BSON = require('mongodb').BSONPure;

function Todo(title, finished, post_date) {
	this.title = title;
	this.finished = finished;
	this.post_date = post_date;
}

module.exports = Todo;

Todo.prototype.save = function(callback) {
	var todo = {
		title : this.title,
		finished : this.finished,
		post_date : this.post_date
	};
	console.log('1:todo.title:'+todo.title+",todo.finished:"+todo.finished+",todo.post_date:"+todo.post_date);
	MongoClient.connect("mongodb://"+settings.host+"/"+settings.db, function(err, db){
		if(err){
			return callback(err);
		}
		console.log('2:todo.title:'+todo.title+",todo.finished:"+todo.finished+",todo.post_date:"+todo.post_date);
		db.collection('todo', function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			console.log('3:todo.title:'+todo.title+",todo.finished:"+todo.finished+",todo.post_date:"+todo.post_date);
			collection.insert(todo, function(err, todo){
				db.close();
				callback(err, todo);
			});
		});
	});
};

Todo.update = function(id, title, callback) {
	console.log('id is ；'+ id + ',title: ' + title);
	var obj_id = BSON.ObjectID.createFromHexString(id);
	console.log('obj_id is : '+obj_id);
	MongoClient.connect("mongodb://"+settings.host+"/"+settings.db, function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('todo', function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			collection.update({_id:obj_id}, {title: title}, function(err, todo){
				db.close();
				callback(err, todo);
			});
		});
	});
};

Todo.getTen = function(title, page, callback){
	MongoClient.connect("mongodb://" + settings.host +"/" + settings.db, function(err, db) {
		if(err){
			return callback(err);
		}
		db.collection('todo', function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			var query = {};
			if(title){
				query.title = title;
			}
			collection.find(query, {skip: (page-1)*10, limit: 10}).toArray(function(err, todos){
				db.close();
				if(err){
					callback(err, null);
				}
				callback(null, todos);
			});
		});
	});
};

Todo.getOne = function(id, callback){
	MongoClient.connect("mongodb://" + settings.host + "/" + settings.db, function(err, db) {
		if(err){
			return callback(err);
		}
		
		db.collection('todo', function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			console.log('_id:'+id);
			
			var obj_id = BSON.ObjectID.createFromHexString(id);
			collection.findOne({_id: obj_id}, function(err, todo){
				db.close();
				if(err){
					callback(err, null);
				}
				console.log('todo is :'+todo);
				callback(null, todo);
			});
		});
	});
};

Todo.remove = function(id, callback) {
	MongoClient.connect("mongodb://" + settings.host + "/" + settings.db, function(err, db) {
		if(err){
			return callback(err);
		}
		db.collection('todo', function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			var obj_id = BSON.ObjectID.createFromHexString(id);
			collection.remove({_id: obj_id}, function(err){
				db.close();
				if(err){
					callback(err);
				}
				callback(null);
			});
		});
	});
};
Todo.finishById = function(id, finish, callback) {
	console.log('finish id is :' + id + ', finished is '+ finish);
	MongoClient.connect("mongodb://" + settings.host + "/" + settings.db, function(err, db) {
		if(err){
			return callback(err);
		}
		db.collection('todo', function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			var obj_id = BSON.ObjectID.createFromHexString(id);
			console.log('finish obj_id is :' + obj_id + ', finished is '+ finish);
			collection.findOne({_id: obj_id}, function(err, todo){
				collection.update({_id: obj_id}, {title: todo.title, post_date: todo.post_date, finished: finish}, function(err, todo){
					db.close();
					if(err){
						callback(err);
					}
					callback(null, todo);
				});
			});
		});
	});
};
