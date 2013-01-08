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

Defaceit.Model = Backbone.Model.extend({

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
	}
});

Defaceit.HtmlPageBlock = Defaceit.Model.extend({
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
		var r = 'BLOCK:'+this.status() + ', STORE:' + (this.structure && this.structure.structName);
		console.debug(this.name() + '  ' + r);


		switch(r) {
			case 'BLOCK:start, STORE:empty': this.status('ready');break;

			case 'BLOCK:ready, STORE:empty': 
			case 'BLOCK:ready, STORE:ready': this.trigger('load'); break;
			//case 'BLOCK:start, STORE:start': nothing to do
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
 * +Default
 */
Blocks.Default = Defaceit.HtmlPageBlock.extend({
	initialize: function(name) {
		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);

		this.queueNamespace = 'default.' + Defaceit.Page.namespace;
		this.queueStore = new Defaceit.StackQueueStore(name, this.queueNamespace);
		this.queueStore.on('status:change', this.route, this);
		//this.fetch();
	},

	interactive_edit: function() {
				var item = this,
					el = jQuery('.'+this.name().toLowerCase()+'_container');

				if (el.length) {
					var height = el.height();

					el.html(jQuery('<a class="blockMenuItem" href="#">изменить</a>').click(function(){
					
    					item.edit();
    				
    				}));

    				el.height(height);
    			}
    			

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

Blocks.Namespace = Blocks.Default.extend({
	initialize: function() {
		this.visible = false;
		this.name('Namespace');
		this.queueStore = {read: function(){}, write: function(){}, status: function(){return 'ready'}};
	},

	status: function() {
		return 'ready';
	},

	edit: function() {
		alert('PageUrl неизменяемое поле.');
	},
	toObject: function() {
		return Defaceit.Page.namespace;
	}
});

Blocks.PageName = Blocks.Default.extend({
	initialize: function() {
		this.visible = false;
		this.name('PageName');
		this.queueStore = {read: function(){}, write: function(){}, status: function(){return 'ready'}};
	},

	status: function() {
		return 'ready';
	},

	edit: function() {
		alert('PageUrl неизменяемое поле.');
	},
	toObject: function() {
		return Defaceit.Page.name;
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
		//this.fetch();
		
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
 		this.queueStore.add(Defaceit.Variable('title.'+this.queueNamespace));
 		this.queueStore.add(Defaceit.Variable('content.'+this.queueNamespace));
 		this.queueStore.add(Defaceit.Variable('url.'+this.queueNamespace));
 		//this.fetch();
 	},

	fill: function(title, content, url) {
		this.find('title').set(title);
		this.find('content').set(content);
		this.find('url').set(url);
		this.queueStore.status('update');
	},

	edit: function(data) {

		if (data) {
			this.status('sync', false);
			this.fill.apply(this, data);	
			
			return;
		}else{

			var e = new Blocks.Thumbnail.EditView(this).render();
		}

	},

	find: function(key) {
		var that = this;
		return _.find(this.queueStore.storeList, function(item){return item.varName == key+'.'+that.queueNamespace});
		
	},

	toObject: function() {
		

		return {
			'title': this.find('title').get(),
			'content': this.find('content').get(),
			'url': this.find('url').get(),
			'id': this.name()
		};
	}

 });


Blocks.Thumbnail.EditView = Backbone.View.extend({
	el: '.center',

	
	initialize: function(thumbnail) {
		this.thumbnail = thumbnail;
	},


	select: function() {
		this.trigger('select', this);
	},

	done: function() {
		this.thumbnail.set('title',	this.$el.find('#title').val());
		this.thumbnail.set('content', this.$el.find('#content').val());
		this.thumbnail.set('url', this.$el.find('#url').val());
		this.thumbnail.save();
	},
	render: function() {
		var template = '<div class="page"><p class="calc_label">title:<input style="width:99%" id="title"/></p><p class="calc_label">content:<textarea style="width:99%; height: 100px;" id="content" /></textarea></p>url:<input style="width:99%" id="url" /></page>';
		this.$el.html(template);
		this.$el.find('#title').val(this.thumbnail.get('title'));
		this.$el.find('#content').val(this.thumbnail.get('content'));
		this.$el.find('#url').val(this.thumbnail.get('url'));

		var b = new Blocks.Article.PanelButtonsView().render();
		b.on('done', this.done, this);
		b.on('cancel', this.cancel, this);
	}
});

/**
 * +Thumbnails
 */

 Blocks.Thumbnails = Defaceit.HtmlPageBlock.extend({
 	initialize: function(name) {
 		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);

 		this.thumbnails = Defaceit.List('Thumbnail', ['title', 'content', 'url'], namespace());
 		this.thumbnails.on('loaded', function(){this.status('ready');}, this);
 		this.thumbnails.on('saved', function(){this.status('ready');}, this);

 		this.status('start');
 	},

 	fetch: function() {
 		/*var index = this.thumbnails.length+1,
 			o = new Blocks.Thumbnail('Thumbnail'+index);

 			//o.on('status:change', function(){console.debug(this.status());}, o);
 		o.on('status:change', this.load_next, this);
 		o.on('save', function(){this.trigger('save');}, this);
 		this.thumbnails.push(o);
 		o.fetch();*/
 		this.thumbnails.fetch();
 		console.debug(this.thumbnails);
 	},


 	interactive_edit: function() {
				this.thumbnails.each(function(item) {
				if (item.is_empty()) {
					jQuery('.thumbnails_container').prepend(jQuery('<a class="blockMenuItem" href="#">Добавить</a>').click(function(){
					w = Defaceit.Window.Manager.create('Simple', {
    						content: '<div class="center"></div>',
    						buttons: [{text: "Расчитать", handler: function(){}}],
    						geometry:['width:750', 'center', 'show']
    				});
    				//item.edit();
    				w.center();
    			})).css({border: '1px dotted black', padding: "10px", "margin": "10px"});;
				}

				jQuery('#'+item.structName).html('<a class="blockMenuItem" href="#">' + item.get('title') + '</a><br />').click(function(){
					w = Defaceit.Window.Manager.create('Simple', {
    						content: '<div class="center"></div>',
    						buttons: [{text: "Расчитать", handler: function(){}}],
    						geometry:['width:750', 'center', 'show']
    				});

					//item.edit();
					new Blocks.Thumbnail.EditView(item).render();
					w.center();
				});
			});
			
 	},

 	compile: function() {
 		var wrap = '<ul class="thumbnails"><li class="span4">{{content1}}</li><li class="span4">{{content2}}</li><li class="span4">{{content3}}</li></ul>';
 			t = '<div id="{{id}}"><h4>{{title}}</h4><div>{{content}}</div><p style="text-align:right;margin-top:20px;"><a class="btn" href="{{url}}">Подробнее</a></p></div>', 
 			content1 = content2 = content3 ='';

 		var i = 1;

		this.thumbnails.each(function(item){
			if (item.is_not_empty()) {
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
			
 	},

 	toObject: function() {
 		this.compile();
 		alert(this.get('result'));
 		return this.get('result');
 	}

 });

Blocks.Thumbnails.EditView = Backbone.View.extend({
	el: '.center',
	className: 'panel',

	events: {
		'click .edit': 'edit',
		'click #cancel': 'cancel'
	},
	edit: function(el) {
		this.htmlPageBlock.thumbnails[parseInt(el.target.id)].edit();
		//alert('edit');
	},

	initialize: function(htmlPageBlock){
		this.htmlPageBlock = htmlPageBlock;
		this.render();
	},

	
	done: function() {
		console.debug(this.htmlPageBlock.last());
		this.htmlPageBlock.last().edit();
	},

	cancel: function() {
	},

	render: function() {





		var template = '<p class="calc_label">title:<input style="width:99%" id="title"/></p><p class="calc_label">content:<textarea style="width:99%; height: 200px;" id="content" /></textarea></p>url:<input style="width:99%" id="url" />';

		template = '';
		var list = [];

		_.each(this.htmlPageBlock.thumbnails, function(item, index) {
			list.push('<a id="'+index+'" class="edit" href="#">'+item.queueStore.find('title').data+'</a>');
		});
		
		template = list.join("<br />");

		this.$el.html('<div class="page">'+template+'</div>');
		var b = new Blocks.Article.PanelButtonsView().render();
		b.on('done', this.done, this);
		b.on('cancel', this.cancel, this);

	}
});


/**
 * +Article
 */
Blocks.Article = Defaceit.HtmlPageBlock.extend({
	initialize: function(name) {
		Defaceit.HtmlPageBlock.prototype.initialize.apply(this, [name]);

		this.structure = Defaceit.Structure('article', ['title', 'content'], namespace());
		this.structure.on('loaded', this.status, this);
		//this.fetch();
	},


	fetch: function() {
		this.structure.fetch();
	},


	fill: function(title, content) {
		this.structure.set('title', title);
		this.structure.set('content', content);
	},

	edit: function(data) {

		if (data) {
			this.fill.apply(this, data);	
			return;
		}
		var e = new Blocks.Article.EditView(this);
		e.on('block:edit_done', this.edit, this);
	},

	interactive_edit: function() {
				var item = this,
					el = jQuery('.article_container'),
					height = el.height();

				el.html(jQuery('<a class="blockMenuItem" href="#">'+item.queueStore.find('title').data+'</a>').click(function(){
					item.w = Defaceit.Window.Manager.create('Simple', {
    						content: '<div class="center"></div>',
    						buttons: [{text: "Расчитать", handler: function(){}}],
    						geometry:['width:750', 'center', 'show']
    				});
    				item.edit();
    				
    			}));

    			el.height(height).css({border: '1px dotted black', padding: "50px", "margin": "10px"});
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
		 f
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



Defaceit.Page.View = {

	'ArticleEdit': Backbone.View.extend({
		el: '.article_container',

		interactive_edit: function() {
				var item = this.attributes.data,
					height = this.$el.height(),
					that = this;

				this.$el.html(jQuery('<a class="blockMenuItem" href="#">'+item.get('title')+'</a>').click(function(){
					new Defaceit.Page.View.ArticleEditPanel({'attributes':{data:item}});
    				
    			}));

    			this.$el.height(height).css({border: '1px dotted black', padding: "50px", "margin": "10px"});
		}
	}),

	'ArticleEditPanel': Backbone.View.extend({
		el: '.container',

		initialize: function(data) {
				console.debug(data);
				this.template = new Defaceit.Template('article', 'template.defaceit.ru');
				this.template.on('status:change',  this.render, this);
		},

		save: function() {
			this.attributes.data.set('title', jQuery('#defaceit-article-title').val());
	    	this.attributes.data.set('content', jQuery('#defaceit-article-content').val());
	    	this.attributes.data.save();
		},

		cancel: function() {
			alert('cancel');
		},
		render: function() {

			this.$el.html(this.template.get('text'));

			this.$el.find('#defaceit-article-title').val(this.attributes.data.get('title'));
			this.$el.find('#defaceit-article-content').val(this.attributes.data.get('content'));

			var b = new Blocks.Article.PanelButtonsView().render();
			b.on('done', this.save, this);
			b.on('cancel', this.cancel, this);
		}
	}),

	'Thumbnails': Backbone.View.extend({
		compile: function() {
			var wrap = '<ul class="thumbnails"><li class="span4">{{content1}}</li><li class="span4">{{content2}}</li><li class="span4">{{content3}}</li></ul>';
 			t = '<div id="{{id}}"><h4>{{title}}</h4><div>{{content}}</div><p style="text-align:right;margin-top:20px;"><a class="btn" href="{{url}}">Подробнее</a></p></div>', 
 			content1 = content2 = content3 ='';

 			var i = 1;

			this.attributes.data.each(function(item){
				if (item.is_not_empty()) {
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
			return _.template(wrap, {content1: content1,content2: content2,content3: content3});
		}

	}),

	'ThumbnailsEdit': Backbone.View.extend({
		interactive_edit: function() {
			this.attributes.data.each(function(item) {
				if (item.is_empty()) {
					jQuery('.thumbnails_container').prepend(jQuery('<a class="blockMenuItem" href="#">Добавить</a>').click(function(){
    				var itemEditView = new Defaceit.Page.View.ThumbnailEditPanel({attributes:{'data':item}});
					itemEditView.render();
    			})).css({border: '1px dotted black', padding: "10px", "margin": "10px"});;
				}

				jQuery('#'+item.structName).html('<a class="blockMenuItem" href="#">' + item.get('title') + '</a><br />').click(function(){
					var itemEditView = new Defaceit.Page.View.ThumbnailEditPanel({attributes:{'data':item}});
					itemEditView.render();
				});
			});
		}
	}),

	'ThumbnailEditPanel': Backbone.View.extend({
		el: '.container',

		done: function() {
			this.attributes.data.set('title',	this.$el.find('#title').val());
			this.attributes.data.set('content', this.$el.find('#content').val());
			this.attributes.data.set('url', this.$el.find('#url').val());
			this.attributes.data.save();
		},

		cancel: function() {
			this.$el.html('');
		},
		render: function() {
			var template = '<div class="page"><p class="calc_label">title:<input style="width:99%" id="title"/></p><p class="calc_label">content:<textarea style="width:99%; height: 100px;" id="content" /></textarea></p>url:<input style="width:99%" id="url" /></page>';
			this.$el.html(template);
			this.$el.find('#title').val(this.attributes.data.get('title'));
			this.$el.find('#content').val(this.attributes.data.get('content'));
			this.$el.find('#url').val(this.attributes.data.get('url'));

			var b = new Blocks.Article.PanelButtonsView().render();
			b.on('done', this.done, this);
			b.on('cancel', this.cancel, this);
		}
	}),

	'Default': Backbone.View.extend({
		compile: function() {
			return this.attributes.data.toObject();
		}
	}),

	'DefaultEdit': Backbone.View.extend({
		interactive_edit: function() {
				var item = this,
				
				el = jQuery('.'+this.attributes.data.varName.toLowerCase()+'_container');

				if (el.length) {
					var height = el.height();

					el.html(jQuery('<a class="blockMenuItem" href="#">изменить</a>').click(function(){
    					item.attributes.data.set(prompt(item.attributes.data.varName + ':', item.attributes.data.get()));
    					item.attributes.data.save();
    				
    				}));

    				el.height(height);
    			}
    			

		}
	})
}


/**
 * +BlockManager
 */ 
Defaceit.BlockManager = Defaceit.Model.extend({
	initialize: function(pageName) {

		this.items = {};
		this.pageType = pageName;
		

		/*this.blockList = {};
		this.status('start', false);
		this.on('status:change', this.check_status, this);*/


		/** Загружаем шаблон страницы и находим в ней блоки */
		this.template = new Defaceit.Template(pageName);
		this.template.on('status:change', this.find_blocks, this);


		/*this.statusCollection = new Defaceit.StatusCollection();
		this.statusCollection.on('status:change', this.check_status, this);*/
		//_.each(['Article', 'Thumbnails', 'Logo'], this.add, this);
		
	},


	find_blocks: function() {
		var newBlockList = this.template.get('words');

		newBlockList = this.normalize(newBlockList);
		_.each(newBlockList, this.add, this);
		_.each(this.items, function(item, key){item.fetch();});
		//this.statusCollection.fetch();
	},

	normalize: function(blockList) {
		var blocks = [];
		for( var i=0; i < blockList.length; i++) {
			blocks.push(this.name(blockList[i]));
		}
		return _.uniq(blocks);
	},

	name: function(block) {
		return block = block.replace('{{', '').replace('}}', '').split('.')[0];
	},

	add: function(block) {
		this.items[block] = this.create_block_from_name(block);;
		this.items[block].on('saved', this.done, this);
	},


	done: function() {
		if(this.is_evrybody_status(['loaded', 'saved']) && this.template.status() == 'ready') {
			
			var t = new Defaceit.BlockManager.EditView(),
					content = this.template.render(this.toObject());
				
			content = content.replace(new RegExp("\n", 'g'), "<br />\n");
			t.render(content, Defaceit.Page.name, this.pageType);
			t.save();
		}else{
			var that = this;
			setTimeout(function(){that.done();}, 100);
		}

	},

	create_block_from_name: function(blockName) {
		var b = {
			'Article': ['Structure', 'article', ['title', 'content'], namespace()],
			'Thumbnails': ['List', 'Thumbnail', ['title', 'content', 'url'], namespace()]
		}

		
		if (b[blockName]) {
			var v = b[blockName];
			return Defaceit[v[0]](v[1], v[2], v[3]);
		}

		return Defaceit.Variable(blockName, 'default.'+Defaceit.Page.namespace);
	},

	toObject: function() {
		var r = {};

		this.each(function(item, key) {

			r[key] = Defaceit.Page.View[key] ?	
						new Defaceit.Page.View[key]({attributes:{data:item}}).compile() : 
						new Defaceit.Page.View.Default({attributes:{data:item}}).compile();
		});

		return r;
	},
	each: function(cb) {
		_.each(this.items, cb, this);
	},

	is_evrybody_status: function(status){
		status = _.isString(status) ? [status] : status;
		var s = [];
		this.each(function(item){s.push(item.status());});
		s = _.difference(_.uniq(s), status);
		return s.length == 0;
	},

	is_anybody_status: function(status) {
		var count = 0;
		this.each(function(item){item.status() == status && count++;});
		return count > 0;
	}
});


Defaceit.BlockManager.EditView = Backbone.View.extend({
	tagName: 'form',
	className: '',


	save: function() {
		this.$el
			.attr('method', 'POST')
			.attr('action', 'http://defaceit.ru/page/save')
			.submit();
	},

	cancel: function() {

	},

	
	render: function(text, pageName, pageType) {
		//this.$el.append('<p>Страница изменена, сохранить?</p>');


		this.$el.append(jQuery('<textarea>').attr('name', 'content').css('display','none').val(text));
		this.$el.append(jQuery('<input>').attr('name', 'type').attr('type', 'hidden').val(pageType));
		this.$el.append(jQuery('<input>').attr('name', 'url').attr('type', 'hidden').val(_.template(Defaceit.Page.urlTemplate,{'pageName':pageName})));
		this.$el.append(jQuery('<input>').attr('name', 'title').attr('type', 'hidden').val(Defaceit.Page.name));
		this.$el.append(jQuery('<input>').attr('name', 'site').attr('type', 'hidden').val(Defaceit.Page.namespace));
		jQuery('.center').html('').append(this.$el);

		/*var b = new Blocks.Article.PanelButtonsView().render();
		b.on('done', this.save, this);
		b.on('cancel', this.cancel, this);*/
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
		Defaceit.Variable.preload(namespace());
		/*this.pages = {
			'thumbnails_page': new Defaceit.BlockManager('thumbnails_page')
			//'content_page': new Defaceit.BlockManager('content_page')
		}*/
	},

	done: function(pageName) {
		//alert(pageName);
		var a = new Defaceit.BlockManager(pageName);
		a.done();
		//this.pages[pageName].done();
	},
  	render: function() {
  		if(this.template.status() == 'ready'){
			$('body').html(this.template.render({}));
  			
  			button = new Defaceit.Page.BigButtonView();
  			button.render();
  			button.on('done', this.done, this)
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
 * +StatusCollection
 */

 Defaceit.StatusCollection = function() {
 	this.initialize();
 }


_.extend(Defaceit.StatusCollection.prototype, {
	initialize: function() {
		this.status('wait');
		this.collection = [];
	},

	add: function(o) {
		this.collection.push(o);
		o.on('status:change', this.check_status, this);
		return this;
	},

	fetch: function() {
		var last = null;
		_.each(this.collection, function(item){
			item.fetch();
			/*if (item.queueStore.status() == 'start') {
				last = item;
			}*/
		});

		/*if (last){
			last.fetch();
		}*/
	},

	status: function(status) {
			
			if (status) {
				var statusChanged = this.myStatus != status;
				this.myStatus = status;
				
				if (statusChanged) {
					this.trigger('status:change');
				}

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
			//this.fetch();
			this.status(flawless_status(this.collection));
		}

}, Backbone.Events);
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
				var statusChanged = this.myStatus != status;
				this.myStatus = status;
				
				if (statusChanged) {
					this.trigger('status:change');
				}

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
		this.trigger('hide', this.attributes.page);
	},

	render: function(x,y){
		this.$el.attr('src', 'http://defaceit.ru/images/templates/'+this.attributes.page+'.png').css({'width':'100px', 'position':'absolute', 'left': x, 'top': y}).appendTo('body');
		return this;
	}
});

Defaceit.Page.BigButtonView = Backbone.View.extend({
	tagName: 'div',
	className: 'centerLayer',


	events: {
		'click': 'show'
	},


	hide: function(pageName) {
		for(var i = 0; i < this.elements.length;i++) {
			this.elements[i].hide();
		}
		this.$el.css({'display': 'none'});
		this.trigger('done', pageName);
	},
	show: function() {

		this.elements = [];
		this.elements.push(new Defaceit.Page.ButtonView({attributes: {page:"thumbnails_page", logo:"promo_page"}}));
		this.elements.push(new Defaceit.Page.ButtonView({attributes: {page:"content_page", logo:"content_page"}}));
		this.elements.push(new Defaceit.Page.ButtonView({attributes: {page:"js_page", logo:"promo_page"}}));


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
	if (!Defaceit.Page.name) {
		var pagename = null;
		do{	pagename = prompt('Введите имя страницы');
		}while(pagename === null);
		Defaceit.Page.name = pagename.toLowerCase().translit();
		Defaceit.Page.urlTemplate = 'http://defaceit.ru/page/content/{{pageName}}';
	}
	mainPage = new Defaceit.MainPageView();
}
	

