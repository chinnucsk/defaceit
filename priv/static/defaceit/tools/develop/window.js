Defaceit.Window = {}


Defaceit.Window.Simple = function(config) {
  this.init(config);
}

Defaceit.Window.Simple.create = function(config) {
    return new Defaceit.Window.Simple(config);
}

Defaceit.Window.Simple.prototype = {
    wnd_handler: null,
    content_handler: null,
    config: {width: '400px'},

    init: function(config) {
	this.configure(config);

        this.create_window();

        this.apply_content(config.content);
        this.apply_buttons(config.buttons);

	this.modify(config.geometry);
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

          (jQuery.isFunction(builder) && builder.call(this)) ||
          (this[builder] && this[builder].call(this));

        }
    },

    
    position: function(pX, pY) {
        this.config.pX = pX || this.config.pX;
	this.config.pY = pY || this.config.pY;

	this.wnd_handler.css({left:this.config.pX, top: this.config.pY});
    },
    
    create_window: function() {
        var wnd = this.wnd_handler = $("<div>");
        wnd.addClass('dtWindow').appendTo('body');
    },

    apply_content: function(content) {
      if (!content) {
        return false;
      }      

      this.content = content;
      return (this.content_handler && this.content_handler.html(this.content)) 
             || (this.content_handler = $("<div>").addClass('dtWindowContent').html(content).appendTo(this.wnd_handler));
    },

    apply_buttons: function(buttons) {

      if (!buttons || !buttons.length) {
        return false;
      }

      var bh = this.button_handler = $("<div>").addClass('dtWindowButtons');
      var that = this;

      function create_button(button) {
          var b = $('<a>').attr('href', '#').addClass('premium-button').html('Close');
          

          button.handler ? b.click(function() {return button.handler.call(that)}) : false;
          button.text ? b.attr('value', button.text) : false;
          return b;
      }

      for(var i=0; i<buttons.length; i++) {
        bh.append(create_button(buttons[i]));
      }
      
      bh.appendTo(this.wnd_handler);
    },

    hide: function() {
      this.wnd_handler.hide();
    },
    show: function() {
	this.wnd_handler.show();
    },

    set_width: function() {
    	if (this.config.width) {
    		this.wnd_handler.css({width: this.config.width});
    	}
    },

    set_height: function() {
		if (this.config.height) {
    		this.wnd_handler.css({width: this.config.height});
    	}
    },

    size: function() {
    	this.wnd_handler.css({width:this.width, height: this.height});
    },

    center: function() {
    	this.config.pX = Math.floor(Defaceit.Display.width() / 2 - this.wnd_handler.width() / 2);
    	this.config.pY = Math.floor(Defaceit.Display.height() / 2 - this.wnd_handler.height() / 2) + Defaceit.Screen.scroll_top();
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
  		this.menu = this.menu || $('<div>').addClass('menu').appendTo(this.wnd_handler).html('<a href="#">Добавить</a><a href="#">Редактировать</a><a href="#">Удалить</a>');
  		this.menu.animate({width:'20%'}, 'fast');
  		this.state = this.hide_menu;
    },
    
    hide_menu: function() {
  		this.menu.animate({width:'0%'}, 'fast');
  		this.state = this.show_menu;
    }
}


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


