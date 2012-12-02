Defaceit.load.css('http://defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/home.css');

Defaceit.Page = {};
namespace = function() {
	return Defaceit.Page.name + '.' + Defaceit.Page.namespace;
}


/** Делаем попытку пересесть на Backbone */

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

Blocks = {};
Defaceit.HtmlPageBlock = Backbone.Model.extend({
	initialize: function(name) {
		this.name(name);
		this.visible = true;

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
			case 'BLOCK:ready, STORE:empty':
			case 'BLOCK:ready, STORE:ready': this.trigger('load'); break;
			case 'BLOCK:start, STORE:start':
			case 'BLOCK:start, STORE:ready': this.status('ready'); break;
			case 'BLOCK:save, STORE:ready': this.trigger("save", this);this.status('ready'); break;

			case 'BLOCK:edit, STORE:empty':
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
		propagate = propagate === undefined ? true : propagate;

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
		this.template = new Defaceit.Template('thumbnails_page');
		this.template.on('status:change', this.run, this);
	},

	run: function() {
		if(this.template.status() == 'ready') {	
			var m = new Defaceit.BlockManager.View(this.template.get('words')),
				that = this;
			m.render();
			m.blocks.on('save', function(block) {
					var t = new Defaceit.BlockManager.EditView(),
						content = _.template(that.template.get('text'), m.blocks.toObject());
				
					content = content.replace(new RegExp("\n", 'g'), "<br />\n");
					t.render(content, Defaceit.Page.name);

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

		this.queueNamespace = 'default.' + Defaceit.Page.namespace;
		this.queueStore = new Defaceit.StackQueueStore(name, this.queueNamespace);
		this.queueStore.on('status:change', this.route, this);
		this.fetch();
	},

	edit: function(data){
		if (data === null) {
			this.status('ready');
		}else if(_.isString(data)){
			this.status('sync', false);
			this.fill(data);
		}else {
			this.edit(prompt(this.name() + ':', this.queueStore.data));
		}

	},

	fill: function(data) {
		this.queueStore.set(data);
	},

	toObject: function() {
		return this.queueStore.data;
	}

});


Blocks.PageUrl = Blocks.Default.extend({
	initialize: function() {
		this.visible = false;
		this.name('PageUrl');
		this.queueStore = {read: function(){}, write: function(){}, status: function(){return 'ready'}};
	},

	status: function() {
		return 'ready';
	},

	edit: function() {
		alert('PageUrl неизменяемое поле.');
	},
	toObject: function() {
		return namespace();
	}
});


/**
 * +Defaults
 */

 Blocks.Defaults = Defaceit.HtmlPageBlock.extend({
 	initialize: function(name) {
 		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);

 		this.queueNamespace = 'defaults.' + Defaceit.Page.namespace;
		this.queueStore.add(new Defaceit.StackQueueStore('logo', this.queueNamespace));
		this.fetch();
		
 	},

 	edit: function(data){
		if (data === null) {
			this.status('ready');
		}else if(_.isString(data)){
			this.status('sync', false);
			this.fill(data);
		}else {
			this.edit(prompt('Logo:', this.queueStore.find('logo').data));
		}

	},

	fill: function(data) {
		this.queueStore.find('logo').set(data);
	},

	toObject: function() {
		return {'logo': this.queueStore.find('logo').data};
	}
 });



/**
 * +Thumbnail
 */

 Blocks.Thumbnail = Defaceit.HtmlPageBlock.extend({
 	initialize: function(name) {
 		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);

 		this.queueNamespace = name+'.'+namespace();
 		this.queueStore.add(new Defaceit.StackQueueStore('title', this.queueNamespace));
 		this.queueStore.add(new Defaceit.StackQueueStore('content', this.queueNamespace));
 		this.queueStore.add(new Defaceit.StackQueueStore('url', this.queueNamespace));
 		this.fetch();
 	},

	fill: function(title, content, url) {
		this.queueStore.find('title').set(title);
		this.queueStore.find('content').set(content);
		this.queueStore.find('url').set(url);
	},

	edit: function(data) {

		if (data) {
			this.status('sync', false);
			this.fill.apply(this, data);	
			
			return;
		}

	},

	toObject: function() {
		return {
			'title': this.queueStore.find('title').data,
			'content': this.queueStore.find('content').data,
			'url': this.queueStore.find('url').data
		};
	}

 });


Blocks.Thumbnail.EditView = Backbone.View.extend({
	el: '.page',

	
	initialize: function(index) {
		this.thumbnail = new Blocks.Thumbnail('Thumbnail'+index);
		this.thumbnail.on('load', this.render, this);
	},


	select: function() {
		this.trigger('select', this);
	},

	done: function() {
		this.thumbnail.edit([
				this.$el.find('#title').val(),
				this.$el.find('#content').val(),
				this.$el.find('#url').val()
		]);
	},
	render: function() {
		//var template = _.template('title:<input id="title" value="{{title}}"/>content:<input id="content" value="{{content}}"/>url:<input id="url" value="{{url}}"/>', this.thumbnail.toObject());
		var template = _.template(this.thumbnail.name()+': {{title}}', this.thumbnail.toObject());
		if (this.$el.find('#'+this.thumbnail.name()).length) {
			this.$el.find('#'+this.thumbnail.name()).html(template);
		}else{
			this.$el.append($('<div id="'+this.thumbnail.name()+'">').html(template));
			var that=this;
			this.$el.append($('<a>').html('edit').click(function(){that.select.call(that)}));
		}
	}
});

/**
 * +Thumbnails
 */

 Blocks.Thumbnails = Defaceit.HtmlPageBlock.extend({
 	initialize: function(name) {
 		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);

 		this.thumbnails = [];

 		this.queueNamespace = 'thumbnails.' + namespace;
 		this.queueStore.add(new Defaceit.StackQueueStore('list', this.queueNamespace));
 		//this.fetch();


 	},

 	fill: function() {
 		
 	},

 	edit: function(data) {
 		if (data) {
 			this.status('ready');
 			alert('Save data');
 			return;
 		}

		var e = new Blocks.Thumbnails.EditView(this);
		e.on('block:edit_done', this.edit, this); 		
 	},

 	compile: function() {
 		var wrap = '<ul class="thumbnails"><li class="span4">{{content1}}</li><li class="span4">{{content2}}</li><li class="span4">{{content3}}</li></ul>';
 			t = '<h4>{{title}}</h4><div>{{content}}</div><p style="text-align:right;margin-top:20px;"><a class="btn" href="{{url}}">Подробнее</a></p>', 
 			content1 = content2 = content3 ='';

 		var i = 1;

		_.each(this.thumbnails, function(item){
			if (item.queueStore.status() != 'empty') {
				if(i%3 == 0) {
					content3 += _.template(t, item.toObject());
				}else if(i%2 == 0) {
					content2 += _.template(t, item.toObject());
				}else{
					content1 += _.template(t, item.toObject());
				}
				i++;
				
			}
		});
		this.set('result', _.template(wrap, {content1: content1,content2: content2,content3: content3}));
		alert(this.get('result'));		
 	},

 	toObject: function() {
 		return this.get('result');
 	}

 });

Blocks.Thumbnails.EditView = Backbone.View.extend({
	el: '.center',
	className: 'panel',

	initialize: function(htmlPageBlock){
		this.htmlPageBlock = htmlPageBlock;
		this.currentThumbnail = null;
		this.render();
	},

	create: function() {
		var b = new Blocks.Thumbnail.EditView([this.htmlPageBlock.thumbnails.length+1]);
		this.currentThumbnail = b.thumbnail;
		this.currentThumbnail.on('load', this.next, this);
		this.htmlPageBlock.thumbnails.push(this.currentThumbnail);
		b.render();
		b.on('select', this.change_current, this);
	},

	next: function() {
		console.debug('next');
		if (this.htmlPageBlock.thumbnails[this.htmlPageBlock.thumbnails.length-1].queueStore.status() == 'empty') {
			this.change_current({thumbnail:this.htmlPageBlock.thumbnails[this.htmlPageBlock.thumbnails.length-1]});
			return;
		}
		this.create();
	},
	change_current: function(el) {
		this.currentThumbnail = el.thumbnail;
		this.$el.find('#title').val(this.currentThumbnail.queueStore.find('title').data);
		this.$el.find('#content').val(this.currentThumbnail.queueStore.find('content').data);
		this.$el.find('#url').val(this.currentThumbnail.queueStore.find('url').data);
	},

	done: function() {
		this.currentThumbnail.edit([
				this.$el.find('#title').val(),
				this.$el.find('#content').val(),
				this.$el.find('#url').val()
		]);


	},

	cancel: function() {
		this.htmlPageBlock.compile();
		this.htmlPageBlock.trigger('save');
	},

	render: function() {
		var template = '<p class="calc_label">title:<input style="width:99%" id="title"/></p><p class="calc_label">content:<textarea style="width:99%; height: 200px;" id="content" /></textarea></p>url:<input style="width:99%" id="url" />';
		this.$el.html('<div class="page">'+template+'</div>');
		var b = new Blocks.Article.PanelButtonsView().render();
		b.on('done', this.done, this);
		b.on('cancel', this.cancel, this);
		this.create();

		
	}
});


/**
 * +Article
 */
Blocks.Article = Defaceit.HtmlPageBlock.extend({
	initialize: function(name) {
		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);


		this.queueNamespace = 'article.' + namespace();
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

		this.template = new Defaceit.Template('article', 'template.defaceit.ru');
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
		if (this.template.status() == 'ready' && (this.htmlPageBlock.queueStore.status() == 'ready' || this.htmlPageBlock.queueStore.status() == 'empty')) {

			this.$el.html(_.template(this.template.get('text'), this.htmlPageBlock));

			this.$el.find('#defaceit-article-title').val(this.htmlPageBlock.queueStore.find('title').data);
			this.$el.find('#defaceit-article-content').val(this.htmlPageBlock.queueStore.find('content').data);

			var b = new Blocks.Article.PanelButtonsView().render();
			b.on('done', this.save, this);
			b.on('cancel', this.cancel, this);
		}
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

	create_block_from_name: function(blockName) {
		if (Blocks[blockName]) {
			return new Blocks[blockName](blockName);
		}

		return new Blocks['Default'](blockName);
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
				if (block.visible) {
					var el =  new Defaceit.HtmlPageBlock.MenuItemView(block).render();
					that.$el.append(el.el);
				}
			});
		}
});

Defaceit.BlockManager.EditView = Backbone.View.extend({
	tagName: 'form',
	className: 'page-form page',


	save: function() {
		this.$el
			.attr('method', 'POST')
			.attr('action', 'http://defaceit.ru/page/save')
			.submit();
	},

	cancel: function() {

	},

	
	render: function(text, url) {
		this.$el.append('<p>Страница изменена, сохранить?</p>');
		this.$el.append(jQuery('<textarea>').attr('name', 'content').css('display','none').val(text));
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
		namespace = namespace || 'template.defaceit.ru';
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
		this.template.on('status:change', this.render, this);
	},

  	render: function() {
  		if(this.template.status() == 'ready'){
			$('body').html(this.template.render({}));
  			//new Defaceit.BlockManager.View(['{{SimplePage}}']).render();
  			button = new Defaceit.Page.BigButtonView().render();
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
		this.queueCallId = []; // Забываем о том, что обращались к хранилищу :-)
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
			this.set('', 'empty');
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


Defaceit.Page.ButtonView = Backbone.View.extend({
	tagName: 'img',

	events: {
		'click': 'run'
	},

	hide: function() {
		this.$el.hide();
	},
	run: function() {
		new Blocks.SimplePage().edit();
		this.trigger('hide');
	},

	render: function(x,y){
		this.$el.attr('src', 'http://defaceit.ru/images/templates/test.png').css({'width':'100px', 'position':'absolute', 'left': x, 'top': y}).appendTo('body');
		return this;
	}
});

Defaceit.Page.BigButtonView = Backbone.View.extend({
	tagName: 'div',
	className: 'centerLayer',


	events: {
		'click': 'show'
	},

	hide: function() {
		for(var i = 0; i < this.elements.length;i++) {
			this.elements[i].hide();
		}
		this.$el.css({'display': 'none'});
	},
	show: function() {

		this.elements = [];
		this.elements.push(new Defaceit.Page.ButtonView());
		this.elements.push(new Defaceit.Page.ButtonView());
		this.elements.push(new Defaceit.Page.ButtonView());
		

		var	angel = 120,
			angelStep = 40,//90 / (elements.length-1),
			center = $('#big-button').offset(),
			width = $('#big-button').width() / 2 - 50,
			height = $('#big-button').height() / 2 - 50,
			r = 220;
			
		for(var i = 0; i < this.elements.length;i++) {
			
			dX = Math.cos(angel * Math.PI / 180) * r;
			dY = Math.sin(angel * Math.PI / 180) * r;
			angel += angelStep;
			//jQuery('<img>').attr('src', '/images/templates/test.png').css({'width':'100px', 'position':'absolute', }).html(i).appendTo('body');
			this.elements[i].render(width+center.left + dX, height+center.top -dY);
			this.elements[i].on('hide', this.hide, this);

		}
		
	},
	render: function() {
		this.$el.html('<img id="big-button" src="http://defaceit.ru/images/buttons/create.png" />').appendTo('body');
	}
});


function run(){
//Defaceit.Page.namespace = 'babywonder.ru';
	if (!Defaceit.Page.name) {
		var pagename = null;
		do{	pagename = prompt('Введите имя страницы');
		}while(pagename === null);
		Defaceit.Page.name = pagename.toLowerCase().translit();
	}
	console.debug(Defaceit.Page.namespace);
	mainPage = new Defaceit.MainPageView();
}
	

if (/defaceit.ru.*pages/.test(document.location)) {
	Defaceit.Page.namespace = 'babywonder.ru';	
	run();			
}

