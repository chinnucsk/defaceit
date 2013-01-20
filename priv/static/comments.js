jQuery(function(){
        commentsQueue = "comments." + Defaceit.Page.name + '.' + Defaceit.Page.namespace;
        Defaceit.Page.urlTemplate = 'http://defaceit.ru/page/content/{{pageName}}';

        jQuery(".add-comment").click(
                function(){
                    Defaceit.Window.Manager.create('InputBox', {title: 'Комментарий', geometry: ['width:400', 'center', 'show'], handler:function(){Defaceit.Queue(commentsQueue).push(this.message()); this.hide();}});return false;
                });

        Defaceit.Queue(commentsQueue ).client({
                queue_message: function(message) {
                    $("#comments").append("<li><div class=\"comment\">"+message+"</div></li>");
                },
                queue_status: function(message) {Defaceit.Queue(commentsQueue).top();}
            });
        
        Defaceit.Queue(commentsQueue).list();
            
            
    jQuery(document).keypress(function(e){
        if (e.which == "126" || e.which == "91") {
            Defaceit.Cache([Defaceit.Page.namespace]).wizard();
            InteractiveEditPageWizard.start({
                pageType: Defaceit.Page.type
            });
            /*
    	    _.each(window.thumbnails.items, function(item, blockName){
                var editName = blockName+'Edit';
                if (Defaceit.Page.View[editName]) {
                    var t = new Defaceit.Page.View[editName]({attributes:{data:item}});
                    t.interactive_edit();
                }else{
                    new Defaceit.Page.View.DefaultEdit({attributes:{data:item}}).interactive_edit();
                }
    		//item.interactive_edit && item.interactive_edit();
    	    });
    	    jQuery('.edit').show();*/

        }
    });
    
    
   
    
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
