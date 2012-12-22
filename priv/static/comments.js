jQuery(function(){Defaceit.Queue(commentsQueue ).client({
                queue_message: function(message) {
                    $("#comments").append("<li><div class=\"comment\">"+message+"</div></li>");
                },
                queue_status: function(message) {Defaceit.Queue(commentsQueue).top();}
            });
            Defaceit.Queue(commentsQueue).list();
            
            
    jQuery(document).keypress(function(e){
        if (e.which == "126") {
    	    _.each(window.thumbnails.blockList, function(item){
    		item.interactive_edit && item.interactive_edit();
    	    });
    	    jQuery('.edit').show();
        }
    });
    
    
    window.thumbnails = new Defaceit.BlockManager('thumbnails_page');
    
    jQuery('.edit').hide().click(function(e){

/*    w = Defaceit.Window.Manager.create('Simple', {
    content: '<div class="center"></div>',
    buttons: [{text: "Расчитать", handler: function(){}}],
    geometry:['width:750', 'center', 'show']
    });*/
    
    
    var el = window.thumbnails.name(jQuery(e.target).attr('id'));
    window.thumbnails.blockList[el].edit();
    setTimeout(function(){w.center();},1000);
    });
});
