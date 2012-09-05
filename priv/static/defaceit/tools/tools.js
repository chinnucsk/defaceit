
Defaceit = window.Defaceit || {}


Defaceit.wait = function(object, callback, scope, args) {
	scope = scope || this;
	args = args || [];

	var idi = setInterval(check, 100);

	function check() {
	
		if (Defaceit.load.wait.length > 0) {
		    for( var id = 0; id < Defaceit.load.wait.length; id++){
    			if (Defaceit.load.wait[id] != 'Ok'){
			    return;
			}
		    }
		}
		if (window[object]) {
			callback.call(scope, args);
			clearInterval(idi);
		}

	}
}

Defaceit.load ={
	wait: [],
	js: function(url) {
		var s =document.createElement('script');
  		s.setAttribute('src', url);
  		document.getElementsByTagName('head')[0].appendChild(s);
	},

	css: function(url) {
	//<link rel='stylesheet' type='text/css' href='' />
		var c = document.createElement('link');
		c.rel = 'stylesheet';
		c.type = 'text/css';
		c.href = url;
		document.getElementsByTagName('head')[0].appendChild(c);
	},
	
	image: function(url) {

		this.wait = this.wait || [];
		var id= this.wait.length;
		
		var i = document.createElement('img');
		i.src = url;
		this.wait[id] = url;
		document.getElementsByTagName('head')[0].appendChild(i);
		
		var that = this;
		i.onload = function(){that.wait[id] = 'Ok'}

	}
}

Defaceit.extend = function(mammy, o) {
	o = o || {};
	mammy = mammy || function() {};
	child = function(){mammy.apply(this, arguments);}
	
	child.prototype = {};

	for( var i in mammy.prototype) {
		child.prototype[i] = mammy.prototype[i];
	}

	child.prototype.parent = {};
	for(var i in o){
		if (child.prototype[i]) {
                  	child.prototype.parent[i] = mammy.prototype[i];
		}
		child.prototype[i] = o[i];
	}
	return child;
}

Defaceit.merge = function(a, b) {
	return jQuery.merge(a, b);
}

Defaceit.Screen = {
	height: function() {
		return $(window).height();
	},

	width: function() {
		return $(window).width();
	}
}

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
    	this.config.pY = Math.floor(Defaceit.Display.height() / 2 - this.wnd_handler.height() / 2);
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


Defaceit.Display = {
   width: function() {
     return $(window).width();
   },
   height: function() {
     return $(window).height();
   }
}



Defaceit.Session = function(url) {
    this.resource = url;

}

Defaceit.Session.prototype = {
  sign_in: false,


  check_status: function(callback) {
    this.sign_in = true;
    var condition = function(response){
        if (response.data.key == null) {
          this.sign_in = false;
          
        }
        this.data = response.data;
        callback.call(this);
      }
    request(this.resource+'/show', condition, this);
   
  },

  signed_in: function() {
    return this.key ? true : false;
  }
}

/*
    Defaceit Queue fetature
*/      	

Defaceit.Queue = function(queue) {
    if (this==Defaceit) {
	queue = queue || '';
	Defaceit.Queue.list[queue] = Defaceit.Queue.list[queue] || new Defaceit.Queue(queue);
	return Defaceit.Queue.list[queue];
    }
    this.queue = queue;
    return this;
}

Defaceit.Queue.prototype = {
	queue: '',
        clients: [],
	call_id: 1,
	
	
	next_call_id: function() {
	    return this.call_id++;
	},
	
	list: function() {
	    Defaceit.request('http://defaceit.ru:8002/queue/list/' + this.queue + '/' + this.next_call_id());
	    return this;
	},
    
	push: function(message, callback) {
	    var cid = this.next_call_id();
	    
	    Defaceit.request('http://defaceit.ru:8002/queue/push/' + this.queue + '/'  + cid +'/'+ encodeURIComponent(message));
	    return cid;
	},
	
	top: function() {
	    Defaceit.request('http://defaceit.ru:8002/queue/top/' + this.queue + '/'  + this.next_call_id());
	    return this;
	},
	
	client: function(client) {
	    this.clients = this.clients || [];
	    this.clients.push(client);
	},
	
	client_callback: function(data) {

	    switch(data.type) {
	    
		case 'messages':
		    for(var i = 0; i < data.data.length; i++) this.send_message(data.data[i].message_text, data.data[i]);
		break;
		
		case 'message':
		    this.send_message(data.data.message_text, data.data);
		break;
		
		case 'status': 
		    this.send_status_message(data);
		break;
	    }
	},
	
	send_status_message: function(status) {
	    for(var i = 0; i < this.clients.length; i++) {
		    var client = this.clients[i];
		    client.queue_status && client.queue_status(status);
	    }
	},
	
	send_message: function(message, full_message) {
	
		message = decodeURIComponent(message);
		for(var i = 0; i < this.clients.length; i++) {
		    var client = this.clients[i];
		    client.queue_message && client.queue_message(message, full_message);
		}

	}
}

Defaceit.Queue.list = {};

Defaceit.Queue.callbacks = [];

Defaceit.Queue.response =  function(data) { Defaceit.Queue.list[data.queue_name].client_callback(data); }

/*End queue*/

Defaceit.request = function(url){
    (function(){var s =document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);})();

}

callbacks = [];
function request(url) {
  (function(){var s =document.createElement('script');
  s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);})();
}
function defaceit(response) {
  callback = callbacks[0];
  callback[0].call(callback[1], response);
}
