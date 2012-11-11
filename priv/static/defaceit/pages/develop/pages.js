Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/tools/css/home.css');


Collection = function(callback, scope) {
    this.scope = scope || window;
    this.cb = callback;
    this.collection = {};
}

Collection.prototype = {

    add: function(queue, defaults) {
	this.collection[queue] = {status: 'wait', defaults: defaults, data: null, rawData: null};
    },
    
    load: function() {
	for(var i in this.collection) {
	    q(i, this)
		.on('empty', 'on_empty')
		.on('message', 'on_message');
	
	    Defaceit.Queue(i).last();
	}
    },
    
    on_empty: function(message, o) {
	this.collection[o.queue_name].data = '';
	this.collection[o.queue_name].rawData = o;
	this.collection[o.queue_name].status = 'ready';
	this.check_all();
    },
    
    on_message: function(message, o) {
	this.collection[o.queue_name].data = message;
	this.collection[o.queue_name].rawData = o;
	this.collection[o.queue_name].status = 'ready';
	this.check_all();	
    },
    
    check_all: function() {
	for(var i in this.collection) {
	    if (this.collection[i].status == 'wait') {
		return false;
	    }
	}
	this.cb.call(this.scope, this.collection);
    }
}


Block = function(blockName) {
    this.init(blockName);
}

Block.prototype = {
    init: function(blockName) {
	this.blockName = blockName;
    },

    'new_block': function() {
	this.put_block('New block for: ' + this.blockName);
    },
    'put_block': function(message) {
	pages.template = pages.template.replace( new RegExp('{{'+this.blockName+'}}'), message);
	pages.save(pages.template);
    }
}

pages = {
    'error': function(){alert('Мы не смогли загрузить дефолтный шаблон');},
    'load_default_template': function(){ Defaceit.Queue('default.template.sandbox.defaceit.ru').last();},
    'parse': function(template){
	this.template = template;
	var words=template.match(/\{\{([^}]*)\}\}/g);
	this.blocks(words);
	
/*	var c = new Collection(this.blocks, this);
	
	for(var i=0, r=template; i < words.length; i++){
	    var queue = words[i].replace('{{', '').replace('}}', '');
	    c.add(queue + '.' + this.defaultQueue, {'block':words[i]});
	}
	c.load();*/
    },
    
    'save': function(r) {
	alert(r);
    },
    
    'blocks': function(collection) {
	var r = this.template, 
	    that = this;
	
	jQuery('#help').html('Выберите в левой части блок и заполните его поля');
	
	for(var i=0; i < collection.length; i++) {
	    var block = collection[i],
		blockName = block.replace('{{', '').replace('}}', ''),
		data = '';

	    if (Defaceit.Blocks[blockName]) {
		new Defaceit.Blocks[blockName](this.defaultQueue);
	    }else if (data == '') {
	    
    		new Defaceit.Blocks['OneField'](blockName +'.'+this.defaultQueue, blockName);
	    }else{
    		r = r.replace(new RegExp(block, 'g'), data);
    	    }

	}
	r = r.replace(new RegExp('<!-- pageQueue -->', 'g'), 'pageQueue = "'+this.defaultQueue + '";');
	this.page = r;
	this.save(r);
    }

}

function run(queue){
pages.defaultQueue = queue;

q(queue, pages)
    .on('empty', 'load_default_template')
    .on('message', 'parse');


/*q('default.template.sandbox.defaceit.ru', pages)
    .on('empty', 'error')
    .on('message', 'parse');*/

/*bookshelf('bookshelf.template.sandbox.defaceit.ru', function(o) {
	    q(o, pages)
	        .on('empty', 'error')
	        .on('message', 'parse');

	    Defaceit.Queue(o).last();
	    this.wnd.hide();
	});*/
	
	jQuery('.templates').click(function(){
	    var o = 'content_page.template.sandbox.defaceit.ru';
	    jQuery('#help').html('Загружается шаблон страницы');
	    jQuery('.templates').fadeOut();
    	    q(o, pages)
	        .on('empty', 'error')
	        .on('message', 'parse');
	    
	    Defaceit.Queue(o).last();

	});
}


Defaceit.Blocks = {}



Defaceit.Blocks.OneField = function(queue, blockName) {
    this.init(queue, blockName);
}

Defaceit.Blocks.OneField.prototype = {

    init: function(queue, blockName) {
	this.blockName = blockName;
	this.queue = queue;
	this.appName = '';
	
	this.fields = new Collection(this.onField_Ready, this);
	this.fields.add(this.full_name(), {'name': 'field', 'type': 'field'});
	this.fields.load();
	
    },
    
    onField_Ready: function(fields) {
	that = this;
	jQuery('#info').append($('<div>OneField</div>').click(function(){
	    var w = Defaceit.Window.Manager.create('InputBox', {title: this.blockName, geometry: ['width:600', 'center', 'show'], handler: function(){
    			Defaceit.Queue(that.full_name()).push(this.message());
    			pages.page = pages.page.replace(new RegExp('{{'+that.blockName+'}}', 'g'), this.message());
    			pages.save(pages.page);
    			this.hide();
    		    }})
    	    w.textarea.val(fields[this.full_name()].data);
    	}));
    },
    
    full_name: function() {
	return this.queue;
    }
}



Defaceit.Blocks.Article = function(queue) {
    this.init(queue);
}

Defaceit.Blocks.Article.prototype = {
    init: function(queue) {
	this.queue = queue;
	this.appName = 'article';

	this.fields = new Collection(this.onFields_Ready, this);
	this.fields.add('title.' + this.full_name(), {'name': 'title', 'type': 'field'});
	this.fields.add('content.' + this.full_name(), {'name': 'content', 'type': 'field'});
	this.fields.add('template.article.sandbox.defaceit.ru', {'name': 'template', 'type': 'template'});
	this.fields.load();

    },
    
    
    
    onFields_Ready: function(fields) {
	var that = this;
	
        jQuery('#info').append($('<div>Article</div>').click(function(){
    	    this.wnd = Defaceit.Window.Manager.create('Simple', {
    		content: fields['template.article.sandbox.defaceit.ru'].data,
		buttons: [ {text: "Закрыть", handler: function(){this.wnd_handler.remove(); return false;}}, {text: "Опубликовать", handler: function(){that.save();this.hide()}}],
        	geometry:['width:800', 'center', 'show']
    	    });
    	    
    	            for(var i in fields) {
    	    var d = fields[i];
    	    if (d.defaults.type == 'field'){
    		jQuery('#defaceit-article-'+d.defaults.name).val(d.data);
    	    };
        }

    	}));
        
    },
    
    save: function() {
	var title = jQuery('#defaceit-article-title').val(),
	    content = jQuery('#defaceit-article-content').val();
	    
	Defaceit.Queue('title.'+this.full_name()).push(title);
	Defaceit.Queue('content.'+this.full_name()).push(content);
	
	content = content.replace(new RegExp("\n", "g"), "<br />\n");
	
	pages.page = pages.page.replace(new RegExp('{{Article}}', 'g'), '<h1 class="main-title">'+title+'</h1>'+'<div>'+content+'</div>');
	pages.save(pages.page);
    },
    full_name: function() {
	return this.appName + '.' + this.queue;
    }
}

var defaceitDevelopMode = !!(new RegExp('http://sandbox.defaceit.ru/defaceit/pages/develop/')).test(document.location);

if (defaceitDevelopMode) {
//    run('template.babywonder.ru');
}


/**
 * Base Object class
 */
Defaceit.Base = Defaceit.extend({},{

	init: function(config) {
		this.config = config;
	},


	status: function() {
		return this.status;
	},

	load: function() {
		this.store.load();
	},

	save: function() {

	}
});

/**
 * Events class
 */

Defaceit.Events = function(config) {
    this.init(config);
}

Defaceit.Events.prototype = {
    create: function() {
	return this;
    },
    
    init: function() {
	this.events = {};
    },
    
    fire: function(event, args) {
	if (this.events[event]) {
	    var cb = this.events[event][0],
		scope = this.events[event][1] || this;
	    cb.call(scope, args);
	}
    },
    
    on: function(event, cb, scope) {
	this.events[event] = [cb, scope];
	return this;
    }
}


/**
 *  Block.js
 */ 

Defaceit.Block = function(block) {
		var block_name = function(blockName) {
			r = blockName.replace('{{', '').replace('}}', '').split('.');
			return r[0] ? r[0] : blockName;
		},
		name = block_name(block);


		if (Defaceit.Block[name]) {
			return Defaceit.Block.List[name] = Defaceit.Block.List[name] || new Defaceit.Block[name]({blockName: block});
		}

		return new Defaceit.Block.Instance({blockName: block});
}

Defaceit.Block.List = {};

Defaceit.Block.Instance = Defaceit.extend(Defaceit.Events, {
	init: function(config) {
		Defaceit.Events.prototype.init.call(this, config);
		this.config = config;
		this.fields = {};
	},

	block_keyword: function(block) {
		var blockName = block || this.config.blockName,
			r = blockName.replace('{{', '').replace('}}', '').split('.');
		return r[1] ? r[1] : 'default';
	},
	
	block_name: function(block) {
		var blockName = block || this.config.blockName,
			r = blockName.replace('{{', '').replace('}}', '').split('.');
		return r[0] ? r[0] : blockName;
	},

	full_name: function() {
		return this.config.blockName;
	},

	field: function(block) {
		var fieldName = this.block_keyword(block);
		return this.fields[fieldName];
	}


});

Defaceit.Block.Article = Defaceit.extend(Defaceit.Block.Instance, {
	init: function(config) {
		Defaceit.Block.Instance.prototype.init.call(this, config);
		this.fields['content'] = 'Тестовый контент';
		this.fields['title'] = 'Тестовый заголовок';
	}
});

/**
 *	Template Class
 */

 

Defaceit.Template = function(tName) {
    return Defaceit.Template.Singleton[tName] = Defaceit.Template.Singleton[tName] || new Defaceit.Template.Instance({templateName: tName});
}

Defaceit.Template.Singleton = {};

Defaceit.Template.Instance = Defaceit.extend(Defaceit.Events, {
	    init: function(config){
		this.parent.init.call(this, config);

		this.templateName = config.templateName;
		this.blocks = [];
		this.result = '';
		
		q(this.templateName, this)
		    .on('message', 'onTemplate_load')
		    .on('empty', 'onTemplate_error');
    },
    
    load: function() {
		Defaceit.Queue(this.templateName).last();
    },
    
    onTemplate_load: function(template) {
		this.template = template;
		this.fire('loaded');
    },
    
    onTemplate_error: function() {
		alert('Произошла ошибка при загрузке шаблона ' + this.templateName);
    },
    
    parse: function() {
    	var words = this.template.match(/\{\{([^}]*)\}\}/g);
    	this.blocks = words;
		this.fire('parsed');
    },

	render: function() {
		this.result = this.template;

		_.each(this.blocks, function(b){
			var block = Defaceit.Block(b);
		    this.result = this.result.replace(new RegExp(b, 'g'), block.field(b));
		}, this);
		
		this.result = this.result.replace(new RegExp('<!-- pageQueue -->', 'g'), 'pageQueue = "";');
		this.fire('rendered');
    }
    
});

Defaceit.Template.Page = function(pageName) {
    var t = new Defaceit.Template.Instance({templateName:pageName + '_page.template.sandbox.defaceit.ru'});
	t.on('loaded', t.parse)
	 .on('parsed', t.render)
	 .on('rendered', function(){alert('Вам необходимо задать событие для события rendered');})
	 .load();
    return t;
}



/**
 *  Pages.js
 */

 Defaceit.Pages = function(){
 		return new Defaceit.Pages.Instance({});
 }

 Defaceit.Pages.Instance = Defaceit.extend({}, {
 	init: function(config) {
 		this.config = config;
 		this.default_page();
 	},

 	default_page: function() {
 		this.defaultPage = Defaceit.Template.Page('create')
				.on('parsed', this.fill_blocks)
				.on('rendered', function(){jQuery('body').html(this.result);});
 	},

 	fill_blocks: function() {
 		_.each(this.blocks, function(b){
			Defaceit.Block(b);
		});

 		console.debug(Defaceit.Block.List);
 	}
 });

 //Defaceit.Pages(); 


var object = {}
 _.extend(object, Backbone.Events);

 object.on('test', function(){alert('test');}, object);

 object.trigger('test');