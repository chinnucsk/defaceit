Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/tools/css/home.css');


/** Делаем попытку пересесть на Backbone */

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

Blocks = {};
Defaceit.HtmlPageBlock = Backbone.Model.extend({
	initialize: function(name) {
		this.name(name);

		this.queueStore = new Defaceit.RWCollection();
		this.queueStore.on('status:change', this.route, this);

		this.on('status:change', this.route, this);
		this.status('start');

	},
	name: function(name) {

		if (name) {
			this.set('name', name);
			this.trigger('block:changed');
		}
		return this.get('name');
	},

	route: function() {
		var r = 'BLOCK:'+this.status() + ', STORE:' + (this.queueStore && this.queueStore.status());

		console.debug(this.name() + '  ' + r);


		switch(r) {
			case 'BLOCK:start, STORE:start':
			case 'BLOCK:start, STORE:ready': this.status('ready'); break;
			case 'BLOCK:save, STORE:ready': this.trigger("save", this);this.status('ready'); break;

			case 'BLOCK:edit, STORE:start':
			case 'BLOCK:edit, STORE:ready': this.edit(); break;
	
			case 'BLOCK:sync, STORE:update': this.save(); break;
			
		}
	},


	edit:function() {
		alert('You should specify Edit function');
	},


	save: function() {
		Backbone.Model.prototype.save.call(this);
		this.status('save');
	},

	status: function(status, propagate) {
		propagate = propagate == undefined ? true : propagate;

		if (status) {
			this.myStatus = status;
			if (propagate) {
				this.trigger('status:change');
			}
			return;
		}

		return this.myStatus;
	},

	toObject: function() {
		return {};
	}
});


/**
 * +MenuItemView
 */

Defaceit.HtmlPageBlock.MenuItemView = Backbone.View.extend({
	tagName: 'div',
	className: 'blockMenuItem',

	events: {
    "click": "open"
  	},

  	open: function(){this.htmlPageBlock.status('edit');},

	initialize: function(htmlPageBlock) {
		this.htmlPageBlock = htmlPageBlock;
		htmlPageBlock.on('block:changed', this.render, this);
	},

	render: function() {
		this.$el.html(this.htmlPageBlock.name());
		return this;
	}


});











/**
 * +SimplePage
 */
Blocks.SimplePage = Defaceit.HtmlPageBlock.extend({
	initialize: function() {
		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, ['SimplePage']);
	},

	edit: function() {
		this.template = new Defaceit.Template('content_page');
		this.template.on('status:change', this.run, this);
	},

	run: function() {
		if(this.template.status() == 'ready') {			
			var m = new Defaceit.BlockManager.View(this.template.get('words')),
				that = this;
			m.render();
			m.blocks.on('save', function(block) {
					var t = new Defaceit.BlockManager.EditView();
					t.render(_.template(that.template.get('text'), m.blocks.toObject()), m.blocks.blockList.PageUrl.queueStore.data);

			});
		}
		
	}
});





/**
 * +Default
 */
Blocks.Default = Defaceit.HtmlPageBlock.extend({
	initialize: function(name) {
		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);
		this.queueStore = new Defaceit.StackQueueStore(name, 'article.sandbox.defaceit.ru');
		this.queueStore.on('status:change', this.route, this);
		this.fetch();
	},

	edit: function(){
		var r = prompt(this.name() + ':', this.queueStore.data);

		if (r) {
			this.status('sync', false);
			this.queueStore.set(r || '');
		}else{
			this.status('ready');
		}

	},

	toObject: function() {
		return this.queueStore.data;
	}

});


Blocks.PageUrl = Blocks.Default.extend({
	edit: function(){
		var r = prompt('Введите URL будущей страницы:', this.queueStore.data);
		alert(this.queueStore);
		if (r) {
			this.status('sync', false);
			this.queueStore.set(r.toLowerCase().translit() || '');
		}else{
			this.status('ready');
		}

	}
});


/**
 * +Article
 */
Blocks.Article = Defaceit.HtmlPageBlock.extend({
	initialize: function(name) {
		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);


		this.queueNamespace = 'article.sandbox.defaceit.ru';
		this.queueStore.add(new Defaceit.StackQueueStore('title', this.queueNamespace));
		this.queueStore.add(new Defaceit.StackQueueStore('content', this.queueNamespace));
		
		this.fetch();
	},



	fill: function(title, content) {
		this.queueStore.find('title').set(title);
		this.queueStore.find('content').set(content);
	},

	edit: function(data) {

		if (data) {
			this.status('sync', false);
			this.fill.apply(this, data);	
			
			return;
		}

		var e = new Blocks.Article.EditView(this);
		e.on('block:edit_done', this.edit, this);
	},


	toObject: function() {
		return {'title': this.queueStore.find('title').data,
				'content': this.queueStore.find('content').data};
	},
	toString: function() {
		return this.title + ' ' + this.content;
	}
});

/**
 * +EditView
 */
Blocks.Article.EditView = Backbone.View.extend({
	el: '.center',
	className: 'panel',

	initialize: function(htmlPageBlock){
		this.htmlPageBlock = htmlPageBlock;
		this.htmlPageBlock.on('render', this.render, this);

		this.template = new Defaceit.Template('template', 'article.defaceit.ru');
		this.template.on('status:change', this.render, this);
	},

	save: function(){
		var title = jQuery('#defaceit-article-title').val(),
	    	content = jQuery('#defaceit-article-content').val();

	    this.htmlPageBlock.edit([title, content]);
	    this.hide();
	},

	cancel: function(){
		this.htmlPageBlock.status('ready');
		this.hide();
	},

	hide: function() {
		this.$el.html('');
	},


	render: function() {
		if (this.template.status() != 'ready' || this.htmlPageBlock.queueStore.status() != 'ready') {return;}

		this.$el.html(_.template(this.template.get('text'), this.htmlPageBlock));

		this.$el.find('#defaceit-article-title').val(this.htmlPageBlock.queueStore.find('title').data);
		this.$el.find('#defaceit-article-content').val(this.htmlPageBlock.queueStore.find('content').data);

		var b = new Blocks.Article.PanelButtonsView().render();
		b.on('done', this.save, this);
		b.on('cancel', this.cancel, this);
	}

});


/**
 * +PanelButtonsView
 */
Blocks.Article.PanelButtonsView = Backbone.View.extend({
	el: '.page',
	events: {
		'click #done': 'done',
		'click #cancel': 'cancel'
	},

	done: function() {
		this.trigger('done');
	},

	cancel: function() {
		this.trigger('cancel');
	},

	render: function() {
		this.$el.append($('<div>').addClass('blockMenuItem').attr('id', 'done').html('Сохранить'));
		this.$el.append($('<div>').addClass('blockMenuItem').attr('id', 'cancel').html('Отмена'));
		return this;
	}
});



/**
 * +BlockManager
 */ 
Defaceit.BlockManager = Backbone.Model.extend({
	initialize: function(newBlockList) {

		this.blockList = {};

		if (_.isString(newBlockList)) {
			newBlockList = [newBlockList];
		}
		_.each(newBlockList, this.add, this);
	},

	name: function(block) {
		return block = block.replace('{{', '').replace('}}', '').split('.')[0];
	},

	add: function(block) {
		var blockName = '';

		if (_.isString(block)) {
			blockName = this.name(block);
			block = this.create_block_from_name(blockName);
		}else{
			blockName = block.name();
		}
		block.on('save', this.change_status, this);
		this.blockList[blockName] = this.blockList[blockName] || block;
	},

	change_status: function(block) {
		this.trigger('save', block);
		
	},

	create_block_from_name: function(block) {
		if (Blocks[block]) {
			return new Blocks[block](block);
		}

		return new Blocks['Default'](block);
	},

	toObject: function() {
		var r = {};
		_.each(this.blockList, function(item) {
			r[item.name()] = item.toObject();
		});

		return r;
	}



});

Defaceit.BlockManager.View = Backbone.View.extend({
		el: '.menu',

		initialize:function(blocks) {
			this.blocks = new Defaceit.BlockManager(blocks);
		},

		render: function() {
			var that = this;
			this.$el.html('');

			_.each(this.blocks.blockList, function(block){
				var el =  new Defaceit.HtmlPageBlock.MenuItemView(block).render();
				that.$el.append(el.el);
			});
		}
});

Defaceit.BlockManager.EditView = Backbone.View.extend({
	tagName: 'form',
	className: 'page-form page',


	save: function() {
		this.$el
			.attr('method', 'POST')
			.attr('action', 'http://sandbox.defaceit.ru/page/save')
			.submit();
	},

	cancel: function() {

	},

	
	render: function(text, url) {
		this.$el.append(jQuery('<textarea>').attr('name', 'content').val(text));
		this.$el.append(jQuery('<input>').attr('name', 'url').attr('type', 'hidden').val(url));
		jQuery('.center').html('').append(this.$el);

		var b = new Blocks.Article.PanelButtonsView().render();
		b.on('done', this.save, this);
		b.on('cancel', this.cancel, this);
	}
});












/**
 * +Template
 */


Defaceit.Template = Backbone.Model.extend({
	initialize: function(template, namespace) {
		namespace = namespace || 'template.sandbox.defaceit.ru';
		this.queueStore = new Defaceit.StackQueueStore(template, namespace);
		this.status(this.queueStore.status());

		this.queueStore.on('status:change', this.parse, this);
		this.fetch();
	},

	parse: function(status) {

		if (this.queueStore.status() == 'ready') {
			var template = this.queueStore.data;
			this.set('text', template);

			var words = template.match(/{{[^}]+}}/g) || [];
			this.set('words', _.uniq(words));

			this.status('ready');
		}


	}, 

	status: function(status) {
		if(status) {
			this.myStatus = status;
			this.trigger('status:change');
		}
			return this.myStatus;
	},

	render: function(context) {
		return _.template(this.get('text'), context);
	}

});




/**
 * +MainPaveView
 */
Defaceit.MainPageView = Backbone.View.extend({
	el: 'body',

	initialize: function() {
		this.template = new Defaceit.Template('create_page');
		this.D = {};
		//this.template.on('template:parsed', this.create_blocks, this);
		this.template.on('status:change', this.render, this);

		//this.on('template:ready', this.render, this);
	},

	/*create_blocks: function(template) {
		var words = this.template.get('words'),
			that = this;

		this.D = {};
		this.blockView = new Defaceit.BlockManager.View(words);
		this.blockView.render();

		_.each(words, this.create_block, this);
		
		var that = this;
		_.each(this.D, function(block){
			block.on('block:ready', function(){that.trigger('template:ready');}, this);
			block.fetch();
		});
		//this.trigger('template:ready');
	},

	create_block: function(fullBlockName) {
		fullBlockName = fullBlockName.replace('{{','').replace('}}', '').split('.');


		if (Blocks[fullBlockName[0]]) {
			this.D[fullBlockName[0]] = this.D[fullBlockName[0]] || new Blocks[fullBlockName[0]];
		}else{
			this.D[fullBlockName[0]] = new Blocks.Article;
		}
	},
	

	onErrorTemplate_load: function() {
		alert('Во время загрузки шаблона MainPageView произошла ошибка');
	},*/

  	render: function() {
  		if(this.template.status() == 'ready'){
  			$('body').html(this.template.render(this.D));
  			new Defaceit.BlockManager.View(['{{SimplePage}}']).render();
  		}
  	}

});






















	


Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
	if (model.queueStore) {
		switch(method) {
			case 'read': model.queueStore.read(); break;
			case 'create': model.queueStore.write(); break;
			case 'update': model.queueStore.write(); break;
		}
	}else{
		Backbone.old_sync.apply(this, [method, model, options]);
	}
};


/**
 * +RWCollection
 */

Defaceit.RWCollection = function() {
	this.initialize();
}

_.extend(Defaceit.RWCollection.prototype, {
		initialize: function() {
			this.status('start');
			this.storeList = [];
		},

		read: function() {
			_.each(this.storeList, function(store){
				store.read();
			}, this);
		},

		write: function() {
			_.each(this.storeList, function(store){
				store.write();
			}, this);
		},

		add: function(store){
			store.on('status:change', this.check_status, this);
			this.storeList.push(store);

		},

		status: function(status) {
			
			if (status) {
				this.myStatus = status;
				this.trigger('status:change');
				return;
			}
			return this.myStatus;
		},

		check_status: function() {
			function flawless_status(list) {
				var s = [];
				_.each(list, function(item) {
					s.push(item.status());
				});
				s = _.uniq(s);
				return s.length == 1 ? s.pop() : 'wait';
			}
			
			this.status(flawless_status(this.storeList));
		},

		find: function(key) {
			var that = this;
			return _.find(this.storeList, function(store){return store.field == key});
		}

}, Backbone.Events);

Defaceit.QueueStore = Defaceit.extend({});
/**
 * +QueueStore
 */
_.extend(Defaceit.QueueStore.prototype, {
	initialize: function(field, namespace) {
		this.status('start');
		this.field = field;
		this.namespace = namespace || Defaceit.namespace;
		this.queueCallId = [];
		this.queue = this.full_name();

		Defaceit.Queue(this.full_name()).client(this);
	},

	full_name: function() {
		return this.field + '.' + this.namespace;
	},

	set: function(d, status) {
		status = status || 'update';
		this.data = d;
		this.status(status);
	},


	queue_message: function(m, o, raw){
		if(_.indexOf(this.queueCallId, raw.call_id) != -1) {

			this.set(m, 'ready');
		}

	},

	status: function(status) {
		if(status) {
			this.myStatus = status;
			this.trigger('status:change');
			return;
		}

		return this.myStatus;		

		
	},

	queue_status: function(m){
		if (m.result == 'empty') {
			this.set('', 'ready');
			return;
		}
		this.status('ready');
		console.debug('Обработка статусов не выполняется');
		//alert('queue_status не обрабатывает этот статус');
	},

	read: function() {
		throw new Error('Не определена функция read в QueueStore');
	},

	write: function() {
		throw new Error('Не определена функция write в QueueStore');
	}
}, Backbone.Events);



/**
 * Stack Queue Store
 */

Defaceit.StackQueueStore = Defaceit.extend(Defaceit.QueueStore, {

	read: function() {
		this.queueCallId.push(Defaceit.Queue(this.full_name()).last());
	},
	write: function() {
		Defaceit.Queue(this.full_name()).push(this.data);
		
	}
});



 String.prototype.translit = (function () {
        var L = {
            'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
            'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'Yo', 'ё': 'yo', 'Ж': 'Zh', 'ж': 'zh',
            'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
            'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
            'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
            'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'Kh', 'х': 'kh', 'Ц': 'Ts', 'ц': 'ts',
            'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sch', 'щ': 'sch', 'Ъ': '', 'ъ': '',
            'Ы': 'Y', 'ы': 'y', 'Ь': "", 'ь': "", 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu',
            'Я': 'Ya', 'я': 'ya', ' ': '-', '_': '-', 
            '"': '', "'": '', '.': '', ',': '', '!': '', ':': '', ';': ''
        },
        r = '',
        k;
        for (k in L) r += k;
        r = new RegExp('[' + r + ']', 'g');
        k = function (a) {
            return a in L ? L[a] : '';
        };

        return function () {
            var text_string = this.replace(r, k).replace(' ', '-').toString();

            var literals = 'QqWwEeRrTtYyUuIiOoPpAaSsDdFfGgHhJjKkLlZzXxCcVvBbNnMm-0123456789';
            var newString = '';
            for (var i = 0; i < text_string.length; i++) {
                if (!(literals.indexOf(text_string.charAt(i)) == -1)) {
                    newString += text_string.charAt(i); 
                };
            };
            return newString;
        };
    })();


mainPage = new Defaceit.MainPageView();
