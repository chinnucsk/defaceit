if (!Defaceit.Variable) {

Defaceit.Constant = function(varName, value) {
	if (Defaceit == this) {
		return new Defaceit.Constant(varName, value);
	}

	this.initialize(varName, value);
}

Defaceit.Constant.prototype = _.extend({
	initialize: function(varName, value) {
		this.varName = varName;
		this.value = value;
	},
	fetch: function() {},
	on: function() {},
	status: function() {return 'loaded';},
	toObject: function() {
		return this.value;
	}
});


Defaceit.Status = _.extend({
	status: function(status, propagate) {
		propagate = propagate === undefined ? true : propagate;

		if (status) {
			/*var n = this.structName + '||' + this.varName;
			console.debug(n+':'+status);*/
			this.myStatus = status;
			if (propagate) {
				this.trigger(status, status);
			}
			return;
		}
		return this.myStatus;
	}
}, Backbone.Events);


Defaceit.CollectionStatus = _.extend({
	initialize: function() {
		this.items = [];
	},

	add: function(item) {
		this.items.push(item);
	},

	each: function(cb) {
		_.each(this.items, cb, this);
	},

	is_evrybody_status: function(status){
		var count = 0;
		this.each(function(item){item.status() == status && count++;});
		return count == this.items.length;
	},

	is_anybody_status: function(status) {
		var count = 0;
		this.each(function(item){item.status() == status && count++;});
		return count > 0;
	}
}, Defaceit.Status);


Defaceit.Variable = function(varName,  namespace) {
	var fullName = varName + '.' + namespace;
    if (this==Defaceit) {
		Defaceit.Variable.list[fullName] = Defaceit.Variable.list[fullName] || new Defaceit.Variable(varName, namespace);
		return Defaceit.Variable.list[fullName];
    }
    this.initialize(varName, namespace);
    return this;
}


Defaceit.Variable.list = Defaceit.Variable.list || {};
Defaceit.Variable.cache = Defaceit.Variable.cache || {};


_.extend(Defaceit.Variable.prototype, {
	initialize: function(varName, namespace) {
		this.varName = varName;
		this.namespace = namespace;

		this.value = null;
		this.rawData = null;

		this.status('start', false);

		this.on('fetch', this.set_from_web, this);
		this.on('status:change', this.change_status, this);
	},

	full_name: function() {
		return this.varName + '.' + this.namespace;
	},

	change_status: function(status, data) {
		switch(status) {
			case 'ok': this.clear_cache(); this.status('saved'); break;
			case 'empty': this.status('loaded'); break;
			case undefined: break;
		}
		
	},


	set: function(data) {

		if (data.data && data.data.message_text) {
			this.rawData = data;
			this.value = decodeURIComponent(data.data.message_text);
		}else{
			this.value = data;
			this.rawData = null;
			this.status('update'); // если напрямую обновили переменную
		}

		return this;
	},

	set_from_web: function(data) {
		if (this.status() == 'loading') {
			this.set(data);
			this.status('loaded');
		}
	},

	get: function() {
		return this.value;
	},

	/** Загружаем данные из центрального хранилища */
	read: function() {
		this.fetch();
	},

	fetch: function() {
		if (this.status() == 'saveing') {
			this.recall(this.fetch);
			return;
		}
		if (this.is_in_cache()){
			return this.get_from_cache();
		}
		return this.load_from_web();

	},


	is_empty: function(){
		return !this.get();
	},

	is_in_cache: function() {
		return !!Defaceit.Variable.cache[this.full_name()];
	},

	get_from_cache: function() {
		// почти весь код заточен на асинхронную задержку, поэтому непрерывное выополнение
		// создает проблемы эмулируем быструю загрузку из кэша.
		var that = this;
		setTimeout(function(){
			if (that.is_in_cache()){
				that.set(Defaceit.Variable.cache[that.full_name()]);
				that.status('loaded');
			}
		}, 1);
		return;
	},

	load_from_web: function() {
			this.status('loading', false);
			Defaceit.request('http://eservices.defaceit.ru/variable/get/'+this.full_name());
	},

	/** Сохраняем данные в хранилище */
	write: function() {
		this.save();
	},
	save: function() {
		this.status('saveing', false);
		if (this.is_in_cache()) {
			this.clear_cache();
		}
		cors_post('http://eservices.defaceit.ru/variable/set/'+this.full_name(), 'message_text='+encodeURIComponent(encodeURIComponent(this.get())));
	},

	clear_cache: function() {
		Defaceit.Variable.cache[this.full_name()] = null;
	},

	/** Обновляем данные */
	reload: function() {
		this.load_from_web();
	},

	recall: function(callback, args) {
		args = args || [];
		var that = this;
		setTimeout(function(){callback.apply(that,args);}, 100);
	},

	toObject: function() {

		return this.value;
	}


}, Defaceit.Status);


Defaceit.Variable.response = function(data){

	if (data.pack) {
		_.each(data.pack, function(dataSet){
			Defaceit.Variable.response(dataSet);
		});
		return;
	}

	if (data.type == 'data') {
		Defaceit.Variable.cache[data.variable_name] = data;

		Defaceit.Variable.list[data.variable_name] && 
		Defaceit.Variable.list[data.variable_name].trigger('fetch', data);
	}

	if (data.type == 'status') {
		Defaceit.Variable.list[data.variable_name].trigger('status:change', data.result, data);
	}
}

Defaceit.Variable.preload = function(namespace) {
	Defaceit.request('http://eservices.defaceit.ru/variable/get_pack/' + namespace);
}


Defaceit.Structure = function(structName, variablies, namespace) {
	if (this==Defaceit) {
		return new Defaceit.Structure(structName, variablies, namespace);
    }
	this.initialize(structName, variablies, namespace);
}


_.extend(Defaceit.Structure.prototype,{
	initialize: function(structName, variablies, namespace) {
		this.structName = structName;
		this.namespace = namespace;
		this.variablies = [];
		this.status('start', false);
		this.create_vars_from_array(variablies);

	},

	create_vars_from_array: function(variablies) {
		_.each(variablies, this.add_variable, this);
	},

	add_variable: function(varName) {
		var o = Defaceit.Variable(varName, this.structName + '.' + 	this.namespace);
		o.on('loaded', this.check_status, this);
		o.on('saved', function() {!this.is_anybody_status('saveing') && this.status('saved'); }, this);
		this.variablies.push(o);
	},

	fetch: function() {
		this.status('loading', false);
		_.each(this.variablies, function(item){item.fetch();});
		return this;
	},

	find: function(varName) {
		return _.find(this.variablies, function(variable){return variable.varName == varName;});
	},

	set: function(varName, value) {
		this.find(varName).set(value);
		this.status('update');
		return this;
	},

	get: function(varName) {
		return this.find(varName).get();
	},

	save: function() {
		this.status('saveing', false);
		this.each(function(item){item.status() == 'update' && item.save();});
		return this;
	},

	check_status: function(status) {
		var count = 0;
		this.each(function(item){item.status() == status && count++; });
		if (count == this.variablies.length) {
			this.status(status);
		}
	},

	each: function(callback) {
		_.each(this.variablies, callback, this);
	},

	is_empty: function() {
		var count = 0;
		this.each(function(item){item.is_empty() && count++;})
		return count == this.variablies.length;
	},

	is_not_empty: function() {
		return !this.is_empty();
	},

	is_anybody_status: function(status){
		var count = 0;
		this.each(function(item){item.status() == status && count++;});
		return count > 0;

	},


	toObject: function() {
		var o = {};
		this.each(function(v){o[v.varName] = v.get()});
		o.id = this.structName;
		return o;
	}
}, Defaceit.Status);



Defaceit.List = function(structName, variablies, namespace) {
	if (this==Defaceit) {
		
		return new Defaceit.List(structName, variablies, namespace);
    }
	this.initialize(structName, variablies, namespace);
}


_.extend(Defaceit.List.prototype,{
	initialize: function(structName, variablies, namespace) {
		this.structName = structName;
		this.namespace = namespace;
		this.variableNames = variablies;
		this.items = [];
		this.status('start', false);
	},

	create: function() {
		var o = Defaceit.Structure(this.structName + (this.items.length+1), this.variableNames, this.namespace);
		o.on('loaded', this.next, this);
		o.on('saved', this.status, this);
		o.on('update', this.status, this);
		this.items.push(o);
		return o;
	},



	next: function() {
		if (this.last().is_not_empty()){
			this.create().fetch();
		}
		this.is_evrybody_status('loaded') && this.status('loaded');
	},

	last: function() {
		return this.items[this.items.length-1];
	},

	fetch: function() {
		//this.status('loading');
		this.create().fetch();
		//_.each(this.items, function(item){item.fetch();});
		return this;
	},

	find: function(structName) {
		return _.find(this.items, function(item){return item.structName == structName;});
	},

	set: function(varName, value) {
		this.find(varName).set(value);
		return this;
	},

	get: function(index) {
		return this.find(this.structName + index);
	},

	save: function() {
		this.each(function(item){item.status() == 'update' && item.save();});
		return this;
	},

	check_status: function() {
	
	},

	each: function(callback) {
		_.each(this.items, callback, this);
	},

	is_evrybody_status: function(status){
		var count = 0;
		this.each(function(item){item.status() == status && count++;});
		return count == this.items.length;
	},

	is_anybody_status: function(status) {
		var count = 0;
		this.each(function(item){item.status() == status && count++;});
		return count > 0;
	},

	toObject: function() {
		var o = {};
		this.each(function(v){o[v.structName] = v.toObject();});
		return o;
	}
}, Defaceit.Status);


}