if (!Defaceit.Wizard) {


	Defaceit.Wizard = function(items) {
		if (this == Defaceit) {
			return new Defaceit.Wizard(items);
		}
		this.initialize(items);
	}


	Defaceit.Wizard.prototype = _.extend({
		initialize: function(items) {
			this.current = null;
			this.args = {};
			this.items = [];
			_.each(items, this.add, this);
			
			
		},

		add: function(item) {
			this.items.push(item);
			return this;
		},
		
		start: function(inArgs) {
				this.args = inArgs || this.args;
				this.next();
		},
		wizard: function(inArgs) {
				this.on('done', function(){this.trigger('wizard:done', this.args);});
				this.start(inArgs);
		},

		next: function(args) {
			
			if (!this.items.length) {
				this.current = null;
				this.trigger('done');
				return;
			}
			var that = this;

			this.current = this.items.shift();
			
			// Если нет визарда и задана функция, то выполняем ее
			if(_.isFunction(this.current) && !this.current.wizard) {
				this.current = this.current(this.args) || {};
			}
			
			if (_.isFunction(this.current.wizard)) {
				this.current.on('wizard:done', this.wizard_done, this);
				this.current.wizard.call(this.current, this.args);
				
				return;
			}

			this.next();
		},

		wizard_done: function(outArgs){
			_.extend(this.args, outArgs);
			this.next();
		},

		check: function(index){
			this.current[index] = 'done';
			var a = _.uniq(this.current);
			if ( a.length == 1 && a[0] == 'done') {
				this.next();
			}
		}
	}, Backbone.Events);
}