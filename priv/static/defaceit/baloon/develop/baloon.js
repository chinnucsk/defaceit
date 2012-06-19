if (!window.jQuery) {
	Defaceit.load.js('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
}
Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/baloon/develop/baloon.css');

function mrand(max){
	return Math.floor(Math.random()*10000%(max+1));
}

Defaceit.home = 'http://sandbox.defaceit.ru/defaceit/baloon/develop';


Defaceit.Baloons = {


	show_window: function (message) {
		var w = Defaceit.Window.Manager.create('Baloons', {
				content: message,
				geometry: ['show']
			});
	},

	show: function(json) {
		Defaceit.Baloons.show_window(decodeURIComponent(json.message_text));
	},
	add_message: function(message){
		var url = 'http://sandbox.defaceit.ru:8001/message/add/'+encodeURIComponent(message);
		Defaceit.load.js(url);
	},

	message: function() {
			var message = '';
			if (window["baloonMessage"]) {
				message = window["baloonMessage"];
			}else if (message = /sandbox.defaceit.ru\/baloon\/([^\/]*)$/.exec(document.location)){
				message = decodeURIComponent(message[1]);
			}else{
				message = "Empty message";
			}
			return message;
	}

}

Defaceit.Window.Baloons = Defaceit.extend(Defaceit.Window.Simple, {
	configure: function(config) {
		var config = this.parent.configure.call(this, config);
		
		config.buttons = Defaceit.merge([{text:'Close', handler: function(){this.hide();return false;}}], config.buttons);

		config.geometry = Defaceit.merge(['center'], config.geometry);
 	},

	create_window: function() {
		this.baloon_image = $('<img>')
			.attr('src',  'http://sandbox.defaceit.ru/defaceit/baloon/develop/images/baloons.png')
			.css('z-index', 900)
			.appendTo($("body"));
		this.create_baloons();
		this.parent.create_window.call(this);
	},

	create_baloons: function() {
		that = this;
		that.baloons = [];
	        var baloons_create = function(num, scale, duration) {
        	        for(var i = 0; i<num; i++){
                            var x = mrand(Defaceit.Screen.width()-100),
                                y = Defaceit.Screen.height()-170;

                                var b = Defaceit.Effects.Baloon.create({
                                                position: {start:[x, y], end: [x, '-='+y]},
                                                scale: scale,
                                                duration: duration,
                                                repeat: true,
                                                modif: {'top': ['blink']}
                                        });
				b.baloon_handle.css('opacity', 0);
				that.baloons.push(b);

				(function(b, duration){setTimeout(function() {b.animate();}, mrand(duration*1.5));})(b, duration);
	               }
        	}

        	baloons_create(5, 0.6, 5000);
        	baloons_create(5, 0.8, 3500);
        	baloons_create(4, 1, 2000);
	},

	hide: function() {
		for( var i=0; i<this.baloons.length; i++) {
			this.baloons[i].hide();
		}
		this.baloon_image && this.baloon_image.fadeOut('slow');
		this.parent.hide.call(this);
	},

	show: function() {
		this.baloon_image && this.baloon_image.show();
		this.parent.show.call(this);
		this.animate();
	},
	
	center: function() {
		this.parent.center.call(this);
		this.baloon_image.css({ position:"absolute", left:this.config.pX-100, top:this.config.pY-100})
	},

	animate: function() {
	}
});

Defaceit.Effects = {};

Defaceit.Effects.Baloon = function(config){
	this.init(config);
};

Defaceit.Effects.Baloon.create = function(config) {
	return new Defaceit.Effects.Baloon(config);
}

Defaceit.Effects.Baloon.prototype = {
	init: function(config) {

		this.configure(config);
		this.create_baloon();
	},

	configure: function(config) {
		this.config = config;
		this.config.duration = this.config.duration || 1000;
		this.config.scale = this.config.scale || 1;
		this.config.position = this.config.position || {start:[0,0], end:[0,0]};
		this.config.modif = this.config.modif || {};
	},

	create_baloon: function() {	
                var position = this.config.position;

                this.baloon_handle = $('<img>');
                this.baloon_handle
                                 .attr('id', 'test')
                                 .attr('src', Defaceit.home + '/images/baloon'+mrand(3)+'.png')
                                 .css('position', 'absolute')
                                 .css('left', position.start[0])
                                 .css('top', position.start[1])
                .appendTo($('body'));

                var that = this;
                this.baloon_handle.load(function(){that.scale()});
	},

	animate: function() {
                var that = this;
                this.baloon_handle.animate(
                        {left: this.config.position.end[0], top: this.config.position.end[1]},
                        {duration: this.config.duration, step: function(now, fx){that.modify.call(that, now, fx);},
                        complete: function(){that.repeat.call(that);}}
                );

	},

	repeat: function() {
		if(this.config.repeat) {
			this.baloon_handle.css({left: this.config.position.start[0], top: this.config.position.start[1]});
			this.animate();
		}
	},
	modify: function(now, fx) {
		var r = !!this.config.modif[fx.prop] && this.config.modif[fx.prop];
	
		if (r.length > 0) {
			for(var i = 0; i < r.length; i++) {
				this[r[i]].call(this, now, fx);
			}
		}
	},

	scale: function(n) {
		this.config.scale = n || this.config.scale;
		var w = this.baloon_handle.width();
		var h = this.baloon_handle.height();
		this.baloon_handle.css('z-index', 100*this.config.scale);
		this.baloon_handle.width(w*this.config.scale).height(h*this.config.scale);
	},

	blink: function(now, fx){
		var deltaV = now - fx.start,
		    pathLength = fx.end-fx.start,
		    percent = deltaV/pathLength;

		var opacity = percent <= 0.3 ? 3*percent : percent < 0.7 ? 1 : 1-3*(percent-0.67);
		var max_opacity = this.config.scale < 0.9 ? 0.7 : this.config.scale;

		opacity = opacity > max_opacity ? max_opacity : opacity;
                $(fx.elem).css('opacity', opacity);
	},
	
	hide: function() {
		this.config.repeat = false;
		this.baloon_handle.hide();
	}
}


baloons = function(name){
	$ = window[name];
	$(document).ready(function(){
			
			if(/sandbox.defaceit.ru/.test(document.location)){
				Defaceit.Baloons.show_window(Defaceit.Baloons.message());
			}

	});
}
Defaceit.wait("jQuery", baloons, this, ["jQuery"]);
