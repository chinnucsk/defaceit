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
	var r = this.template;
	for(var i in collection) {
	    var block = collection[i].defaults.block,
		data = collection[i].data;
	    if (data == '') {
		data = prompt('Введите текст для ' + block);
		Defaceit.Queue(i).push(data);
	    }
	    
	    r = r.replace(new RegExp(block, 'g'), data);

	}
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

bookshelf('bookshelf.template.sandbox.defaceit.ru', function(o) {
	    q(o, pages)
	        .on('empty', 'error')
	        .on('message', 'parse');

	    Defaceit.Queue(o).last();
	    this.wnd.hide();
	});
}



var defaceitDevelopMode = !!(new RegExp('http://sandbox.defaceit.ru/defaceit/pages/develop/')).test(document.location);

if (defaceitDevelopMode) {
    run('template.babywonder.ru');
}