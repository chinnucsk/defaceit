Defaceit.load.css('http://defaceit.ru/defaceit/bookshelf/css/bookshelf.css');

if (DefaceitHome) {
    Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/home.css');
}


Defaceit.Bookshelf = function(queue, cb, scope) {
    this.init(queue, cb, scope);
}

Defaceit.Bookshelf.prototype = {
    init: function(queue, cb, scope) {
	this.cb = cb;
	this.scope = scope || this;
	this.itemCount = 0;
	this.queue = queue;
	this.wnd = null;
    },
    
    
    render_template: function(message) {
	    this.wnd = Defaceit.Window.Manager.create('Simple', {
		content: message,
		buttons: [ {text: "Закрыть", handler: function(){this.wnd_handler.remove(); return false;}}],
		geometry:['width:800', 'center', 'show']
	    });
      
      Defaceit.Queue('items.' + this.queue).list();
      bookshelfLoading = false;
    },
    
    render_items: function(message) {
			if (this.itemCount%3 == 0) {
			    this.div = jQuery('<div>').addClass('line').appendTo(jQuery('#bookshelf .page'));
			}
			this.itemCount++;
			var  src = '',
			     obj = '',
			     r = [];
			
			if ( r = message.match(/^([^ ]*) (.*)$/) ) {
			    src = r[1];
			    obj = r[2];
			}else{
			    src = message;
			}
			var that = this;
			this.div.append(jQuery('<img>').attr('src', src).click(function(){
				    that.cb.call(that.scope, obj);
				    return false;
			    }));
//			bookshelfLoading = false;
		},
	error: function() {alert('Очередь пуста');}
}

bookshelf = function(queue, cb, scope) {

    var b = new Defaceit.Bookshelf(queue, cb, scope),
	templateQueue = 'default.bookshelf.template.defaceit.ru';
    
 
    q(templateQueue, b)
	.on('empty', 'error')
	.on('message', 'render_template');
    
    q('items.' + queue, b)
	.on('empty', 'error')
	.on('message', 'render_items');
    

    Defaceit.Queue(templateQueue).list();
}


/**main function */
bookshelfLoading = false;
function start(){
   if (!!jQuery('#bookshelf').length || bookshelfLoading) {return false;}
   bookshelfLoading = true;
   
   var cb = function(obj) {
	Defaceit.Window.Manager.create('Simple', {
	    content: obj,
	    buttons: [ {text: "Закрыть", handler: function(){this.wnd_handler.remove(); return false;}}],
	    geometry:['center', 'show']
	});
   }
   bookshelf('bookshelf.defaceit.ru', cb);
}

if (/http:\/\/.defaceit\.ru\/defaceit\/bookshelf\/develop/.test(document.location)) {
    Defaceit.wait("jQuery", start, this, ["jQuery"]);
}



