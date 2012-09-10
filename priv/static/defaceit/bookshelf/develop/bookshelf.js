if (!window.jQuery) {
    Defaceit.load.js('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
}
Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/defaceit.css');
Defaceit.load.css('http://defaceit.ru/defaceit/bookshelf/css/bookshelf.css');


/**load template*/
Defaceit.Queue('template.bookshelf.defaceit.ru').client({queue_message: 
    function(message) {
	    Defaceit.Window.Manager.create('Simple', {
		content: message,
		buttons: [ {text: "Закрыть", handler: function(){this.wnd_handler.remove(); return false;}}],
		geometry:['width:800', 'center', 'show']
	    });
      
      Defaceit.Queue('items.bookshelf.defaceit.ru').list();
      bookshelfLoading = false;
    }
});

Defaceit.Queue('items.bookshelf.defaceit.ru')
    .client({
		queue_message: function(message) {
		
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
			this.div.append(jQuery('<img>').attr('src', src).click(function(){
				    Defaceit.Window.Manager.create('Simple', {
					content: obj,
					buttons: [ {text: "Закрыть", handler: function(){this.wnd_handler.remove(); return false;}}],
			    		geometry:['center', 'show']
					});
				    return false;
			    }));
//			bookshelfLoading = false;
		},
		
		itemCount: 0
    }
);

/**main function */
bookshelfLoading = false;
bookshelf = function() {
    if (!!jQuery('#bookshelf').length || bookshelfLoading) {return false;}
    
    bookshelfLoading = true;
    Defaceit.Queue('template.bookshelf.defaceit.ru').list();
//      Defaceit.Queue('items.bookshelf.defaceit.ru').list();
}


if (/defaceit\.ru/.test(document.location)) {
    Defaceit.wait("jQuery", bookshelf, this, ["jQuery"]);
}



