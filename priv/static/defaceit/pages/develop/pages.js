
(function(){
Defaceit.load.css('http://defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/home.css');

Defaceit.Page = {};
namespace = function() {
	return Defaceit.Page.name + '.' + Defaceit.Page.namespace;
}

var Blocks = {};

/**
 * +PanelButtonsView
 */

Blocks.Article = {};
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
Defaceit.BlockManager = {};


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

	
	render: function(text, pageName, pageType, pageUrlTemplate) {
		this.$el.append(jQuery('<textarea>').attr('name', 'content').css('display','none').val(text));
		this.$el.append(jQuery('<input>').attr('name', 'type').attr('type', 'hidden').val(pageType));
		this.$el.append(jQuery('<input>').attr('name', 'url').attr('type', 'hidden').val(_.template(pageUrlTemplate.get(),{'pageName':pageName})));
		this.$el.append(jQuery('<input>').attr('name', 'title').attr('type', 'hidden').val(Defaceit.Page.name));
		this.$el.append(jQuery('<input>').attr('name', 'site').attr('type', 'hidden').val(Defaceit.Page.namespace));
		jQuery(document.body).html('').append(this.$el);
	}
});

















/**
 * +SelectPageView
 */
Defaceit.SelectPageView = Backbone.View.extend({
	el: 'body',

  	render: function(args) {
			args = args || {};
			$('body').html(this.attributes.template.render(args));
			this.trigger('done');
  	}

});


 


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
		this.$el.attr('src', 'http://defaceit.ru/images/templates/'+this.attributes.page.pageType+'.png').css({'width':'100px', 'position':'absolute', 'left': x, 'top': y}).appendTo('body');
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
		this.elements.push(new Defaceit.Page.ButtonView({attributes: {page:{'pageType':"thumbnails_page"}, logo:"promo_page"}}));
		this.elements.push(new Defaceit.Page.ButtonView({attributes: {page:{'pageType':"content_page"}, logo:"content_page"}}));
		this.elements.push(new Defaceit.Page.ButtonView({attributes: {page:{'pageType':"js_page"}, logo:"promo_page"}}));


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

	Template = function(templateName, nameInArgs) {
		var namespace = namespace || 'template.defaceit.ru';
		return _.extend({
			wizard: function() {
				this.t = Template.items[templateName] = new Defaceit.Template(templateName);
				this.t.on('status:change', this.done, this);
			},
			done: function() {
				var outArgs = {};
				outArgs[nameInArgs || templateName] = this.t;
				//outArgs.template = this.t;
				this.trigger('wizard:done', outArgs);
			}
		}, Backbone.Events);
	}

	Template.items = {};
	
	Render = function(view, data) {
	    
	    return _.extend({
		wizard: function(inArgs) {
	    	    var v = new view({attributes: {'template': Template.items[data]}});
	    	    v.on('done', function(outArgs){this.trigger('wizard:done', outArgs);}, this);
		    v.render();

		}
	    }, Backbone.Events);
	}

	shouldBeExist = function(variable, description){
		return _.extend({
			wizard: function(){
				if (variable) {
					this.trigger('wizard:done');
					return;
				}
				alert('Не задана необходимая переменная ' + description);
			}
		}, Backbone.Events);
	}


	



			
	_.extend(Defaceit.SelectPageView, Backbone.Events);

	/**
	 * Blocks
	 */
	

	Blocks.AssignStructure = function(blockName) {
		var b = {
			'Article': ['Structure', 'article', ['title', 'content'], namespace()],
			'Thumbnails': ['List', 'Thumbnail', ['title', 'content', 'url'], namespace()]
		}

		
		if (b[blockName]) {
			var v = b[blockName];
			return Defaceit[v[0]](v[1], v[2], v[3]);
		}

		return Defaceit.Variable(blockName, 'default.'+Defaceit.Page.namespace);
	}

	_.extend(Blocks.AssignStructure, Backbone.Events);

	Blocks.AssignStructure.wizard = function (inArgs) {
		var blocks = inArgs.template.get('blocks'),
			items = {};
		_.each(blocks, function(blockName){
			var block = Blocks.AssignStructure(blockName);
			block.wizard = function() {
				this.fetch();
				this.on('loaded', function(){this.trigger('wizard:done', {}[blockName] = this)});
			}
			items[blockName] = block;
		});

		Defaceit.Wizard(items).on('done', function(){Blocks.AssignStructure.trigger('wizard:done', {'blocks': items});}).start();
	}

	Blocks.save = function(args){
		var convertBlocksToObject = function() {
			var r = {};

			_.each(args.blocks, function(item, key) {
					r[key] = Defaceit.Page.View[key] ?	
						new Defaceit.Page.View[key]({attributes:{data:item}}).compile() : 
						new Defaceit.Page.View.Default({attributes:{data:item}}).compile();
			});

		return r;
		}
		

		var t = new Defaceit.BlockManager.EditView(),
			content = args.template.render(convertBlocksToObject());
				
			content = content.replace(new RegExp("\n", 'g'), "<br />\n");
			t.render(content, Defaceit.Page.name, args.pageType, args.pageUrlTemplate);
			t.save();
	}


	Blocks.Prepare = function(inArgs){
			return Defaceit.Wizard([
				shouldBeExist(inArgs.pageType, 'Defaceit.BlockManager.wizard : inArgs.pageType'),
				shouldBeExist(Defaceit.Page.name, 'Defaceit.BlockManager.wizard : Defaceit.Page.name'),
				Defaceit.Variable.FillIfEmpty('pageUrlTemplate', Defaceit.Page.namespace),
				Template(inArgs.pageType, 'template'),
				Blocks.AssignStructure
			]);
			
	}

	Blocks.InteractiveEdit =  function(inArgs) {

		return _.extend({
			wizard: function() {

				_.each(inArgs.blocks, function(item, blockName){
                	var editName = blockName+'Edit';
                	if (Defaceit.Page.View[editName]) {
                    	var t = new Defaceit.Page.View[editName]({attributes:{data:item}});
                    	t.interactive_edit();
                	}else{
                    	new Defaceit.Page.View.DefaultEdit({attributes:{data:item}}).interactive_edit();
                	}
                	item.on('saved', this.done);
    		//item.interactive_edit && item.interactive_edit();
    			}, this);

			},

			done: function() {
				this.trigger('wizard:done');
			}
		}, Backbone.Events);
	}
	
	Defaceit.SelectPageWizard = function() {
		return Defaceit.Wizard([
			shouldBeExist(Defaceit.Page.name, 'Defaceit.Page.name'),
			Template('create_page'),
			Render(Defaceit.SelectPageView, 'create_page'),
			Render(Defaceit.Page.BigButtonView, 'empty')
		]);
	}
	
	

	CreatePageWizard = Defaceit.Wizard([
			Defaceit.Variable.Set('pageType', 'js_page'),
			Defaceit.SelectPageWizard,
			Blocks.Prepare
		]).on('done', function() {
			Blocks.save(this.args);
		});

	InteractiveEditPageWizard = Defaceit.Wizard([
			Blocks.Prepare,
			Blocks.InteractiveEdit
		]).on('done', function() {
			Blocks.save(this.args);
		});
		
})();


	

