window.Defaceit = window.Defaceit || {};
Defaceit.Effects = Defaceit.Effects || {};

Defaceit.Effects.Salut = function() {}


Defaceit.Effects.Salut = (function(){

    var Element = function(config){this.init(config);};
    Element.create = function(config) {return new Element(config);}
    
    Element.prototype = {
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
                                 .attr('src', this.config.url)
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


	var Salut = function(config) {
		this.init(config);
	}
	Salut.create =  function(config) {
		return new Salut(config);
	}

	Salut.prototype = {

		init: function(config) {
	                that = this;
        	        that.elements = [];
                	var baloons_create = function(num, scale, duration) {
                        	for(var i = 0; i<num; i++){
	                            var x = mrand(Defaceit.Screen.width()-100),
        	                        y = Defaceit.Screen.height()-170;

                	                var b = Element.create({
                	            			url: config.elements[mrand(config.elements.length-1)], //Defaceit.home + '/images/baloon'+mrand(3)+'.png',
                        	                        position: {start:[x, y], end: [x, '-='+y]},
                                	                scale: scale,
                                        	        duration: duration,
                                                	repeat: true,
	                                                modif: {'top': ['blink']}
        	                                });
                	                b.baloon_handle.css('opacity', 0);
		        	        that.elements.push(b);

	                                (function(b, duration){setTimeout(function() {b.animate();}, mrand(duration*1.5));})(b, duration);
        	               }
                	}

	                baloons_create(5, 0.6, 5000);
        	        baloons_create(5, 0.8, 3500);
	                baloons_create(4, 1, 2000);
		},
		
		hide: function() {
		    for( var i=0; i<this.elements.length; i++) {
			this.elements[i].hide();
		    }
		
		}
	}
	return Salut;
})();
