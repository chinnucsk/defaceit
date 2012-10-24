Defaceit.load.css('http://defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/home.css');


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
    'load_default_template': function(){ Defaceit.Queue('default.template.defaceit.ru').last();},
    'parse': function(template){
	this.template = template;
	var words=template.match(/\{\{([^}]*)\}\}/g);
	
	var c = new Collection(this.blocks, this);
	
	for(var i=0, r=template; i < words.length; i++){
	    var queue = words[i].replace('{{', '').replace('}}', '');
	    c.add(queue + '.' + this.defaultQueue, {'block':words[i]});
	}
	c.load();
    },
    
    'save': function(r) {
	alert(r);
    },
    
    'blocks': function(collection) {
	var r = this.template, 
	    that = this;
	
	
	function create_wnd(x) {
	    Defaceit.Window.Manager.create('InputBox', {title: x, geometry: ['width:600', 'center', 'show'], handler: function(){
    			var r = that.page;
    			Defaceit.Queue(i).push(this.message());
    			r = r.replace(new RegExp(x, 'g'), this.message());
    			that.page = r;
    			that.save(r);
    			this.hide();
    		    }});
	}
	
	for(var i in collection) {
	    var block = collection[i].defaults.block,
		blockName = block.replace('{{', '').replace('}}', ''),
		data = collection[i].data;
		
	    if (Defaceit.Blocks[blockName]) {
		new Defaceit.Blocks[blockName](this.defaultQueue);
	    }else if (data == '') {
    		create_wnd(block);
//		data = prompt('Введите текст для ' + block);
		
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


/*q('default.template.defaceit.ru', pages)
    .on('empty', 'error')
    .on('message', 'parse');*/

bookshelf('bookshelf.template.defaceit.ru', function(o) {
	    q(o, pages)
	        .on('empty', 'error')
	        .on('message', 'parse');

	    Defaceit.Queue(o).last();
	    this.wnd.hide();
	});
}


Defaceit.Blocks = {}

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
	this.fields.add('template.article.defaceit.ru', {'name': 'template', 'type': 'template'});
	this.fields.load();

    },
    
    
    
    onFields_Ready: function(fields) {
	var that = this;
       this.wnd = Defaceit.Window.Manager.create('Simple', {
    	    content: fields['template.article.defaceit.ru'].data,
	    buttons: [ {text: "Закрыть", handler: function(){this.wnd_handler.remove(); return false;}}, {text: "Опубликовать", handler: function(){that.save();this.hide()}}],
            geometry:['width:800', 'center', 'show']
        });
        
        for(var i in fields) {
    	    var d = fields[i];
    	    if (d.defaults.type == 'field'){
    		jQuery('#defaceit-article-'+d.defaults.name).val(d.data);
    	    };
        }
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

var defaceitDevelopMode = !!(new RegExp('http://defaceit.ru/defaceit/pages/develop/')).test(document.location);

if (defaceitDevelopMode) {
    run('template.babywonder.ru');
}