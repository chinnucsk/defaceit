Defaceit.Window = {}

Defaceit.Window.Simple = function(config) {
  this.init(config);
}

Defaceit.Window.Simple.create = function(config) {
    return new Defaceit.Window.Simple(config);
}

Defaceit.Window.Simple.prototype = {
    wnd_handler: null,
    wnd_container: null,
    content_handler: null,
    config: {},

    init: function(config) {
	config = this.configure(config);

        this.create_window();
        this.apply_title(config.title);
        this.apply_content(config.content);
        this.apply_buttons(config.buttons);

	this.modify(config.geometry); // TODO: может быть лучше wishes?
  		//wnd.click(function(){that.state.call(that)});
    },
    configure: function(config) {
        this.config = config || {};

        this.config.plugins = this.config.plugins || {};
        this.config.geometry = this.config.geometry || [];
	this.config.buttons =  this.config.buttons || [];
	return this.config;
	},

    modify: function(builders) {
      if (!builders || !builders.length) return false;

      for(var i = 0; i < builders.length; i++) {
          var builder = builders[i];
          
          var params = builder.split(':');
          builder = params[0];
          params = params.length > 1 ? params.slice(1) : [];
          
          (jQuery.isFunction(builder) && builder.call(this)) ||
          (this[builder] && this[builder].apply(this, params));

        }
    },

    
    position: function(pX, pY) {
        this.config.pX = pX || this.config.pX;
	this.config.pY = pY || this.config.pY;
	this.wnd_handler.css({left:this.config.pX, top: this.config.pY});
    },
    
    create_window: function() {
        var wnd = this.wnd_handler = jQuery("<div>");
        wnd.addClass('dtWindow').appendTo('body');
        
	var container = this.wnd_container = jQuery("<div>");
    	container.addClass("dtWindowContainer").appendTo(this.wnd_handler);

    },

    apply_title: function(title) {
	if (!title) {
	    return false;
	}
	
	this.title = title;
	var title = jQuery('<div>').html(title).addClass('dtWindowTitle');
	title.appendTo(this.wnd_container);
    },
    
    apply_content: function(content) {
      if (!content) {
        return false;
      }      

      this.content = content;
      return (this.content_handler && this.content_handler.html(this.content)) 
             || (this.content_handler = jQuery("<div>").addClass('dtWindowContent').html(content).appendTo(this.wnd_container));
    },

    apply_buttons: function(buttons) {

      if (!buttons || !buttons.length) {
        return false;
      }

      var bh = this.button_handler = jQuery("<div>").addClass('dtWindowButtons');
      var that = this;

      function create_button(button) {
          var b = jQuery('<a>').attr('href', '#').addClass('dtWindowButton').html(button.text);
          

          button.handler ? b.click(function() {button.handler.call(that); return false;}) : false;
          button.text ? b.attr('value', button.text) : false;
          return b;
      }

      for(var i=0; i<buttons.length; i++) {
        bh.append(create_button(buttons[i]));
      }
      
      bh.appendTo(this.wnd_container);
    },

    hide: function() {
      this.wnd_handler.hide();
    },
    show: function() {
	this.wnd_handler.show();
    },

    width: function(width) {
	this.config.width = parseInt(width || this.config.width);
    	if (this.config.width) {
    		this.wnd_handler.css({width: this.config.width});
    	}
    },

    height: function(height) {
	this.config.height = parseInt(height || this.config.height);
	if (this.config.height) {
    		this.wnd_handler.css({height: this.config.height});
    	}
    },
    
    fit_to_screen: function(border) {
	this.height(Defaceit.Screen.height() - (Defaceit.Screen.border * 2));
	this.width(Defaceit.Screen.width() - (Defaceit.Screen.border * 2));

	this.wnd_container.css({height: this.wnd_handler.height() - 40, padding: 20});
	
	var buttons_height = this.button_handler ? this.button_handler.height() : 0;
	
	this.content_handler.css({height: this.wnd_container.height() - buttons_height});

    },

    size: function() {
    	this.wnd_container.css({width:this.width, height: this.height});
    },

    center: function() {
    	this.config.pX = Math.floor(Defaceit.Screen.width() / 2 - this.wnd_handler.width() / 2);
    	this.config.pY = Math.floor(Defaceit.Screen.height() / 2 - this.wnd_handler.height() / 2);// + Defaceit.Screen.scroll_top();
	this.position();
    },
    
    deltaXY: function(x, y) {
	x = parseInt(x || 0);
	y = parseInt(y || 0);

    	this.config.pX = this.config.pX + x;

    	this.config.pY = this.config.pY + y;
	this.position();
    },
    
    top: function() {
	this.config.pY = Defaceit.Screen.border;// + Defaceit.Screen.scroll_top();
	this.position();
    },
    
    right: function() {
	this.config.pX = Defaceit.Screen.width() - this.wnd_handler.width() - Defaceit.Screen.border;
	this.position();
    },
    
    left: function() {
	this.config.pX = Defaceit.Screen.border;
	this.position();
    },
    
    
    

    activate: function() {
  		Defaceit.Window.Manager.get_active_window().deactivate();
  		Defaceit.Window.Manager.active = this.nth;
        this.state = this.show_menu;
        this.wnd_handler.animate({width:this.width, height: this.height, left:this.width / 2, top: this.height / 2}, 'fast');
  		this.wnd_handler.html(this.content);
    },
    deactivate: function() {
        Defaceit.Window.Manager.active = -1;
        this.state = this.activate;
        this.wnd_handler.animate({width:50, height:50, left: this.init_position_x, top: this.init_position_y}, 'fast');
  		this.wnd_handler.html(this.icon);
    },
    
    show_menu: function() {
  		this.menu = this.menu || jQuery('<div>').addClass('menu').appendTo(this.wnd_handler).html('<a href="#">Добавить</a><a href="#">Редактировать</a><a href="#">Удалить</a>');
  		this.menu.animate({width:'20%'}, 'fast');
  		this.state = this.hide_menu;
    },
    
    hide_menu: function() {
  		this.menu.animate({width:'0%'}, 'fast');
  		this.state = this.show_menu;
    }
}


Defaceit.Window.InputBox = Defaceit.extend(Defaceit.Window.Simple, {

    configure: function(config) {
	config.handler = config.handler || function(){alert('Обработчик сообщения не задан')};

	this.textarea = jQuery("<TEXTAREA>").addClass("dtWindowInputBoxTextarea");
	config.content = this.textarea;
	
	config.buttons = [{text: "Отправить", handler: config.handler}, {text: "Закрыть", handler: function(){this.wnd_handler.remove();}}];
	return this.parent.configure(config);
    },
    
    message: function() {
	return this.textarea.val();
    }

});

Defaceit.Window.Manager = {
  collection: [],

  create: function(type, config) {
	var wnd = Defaceit.Window[type] || Defaceit.Window.Simple;
	return new wnd(config);
  },
  
  add: function(wnd) {
    this.collection.push(wnd);
    return this.collection.length;
  },
  
  get: function(nth) {
     return this.collection[nth];
  },
  
  get_active_window: function() {
      if( Defaceit.Window.Manager.active >= 0)
  return this.get(Defaceit.Window.Manager.active);
      return {deactivate: function(){}};
  }
}


