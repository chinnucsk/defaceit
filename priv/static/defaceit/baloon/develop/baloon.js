if (!window.jQuery) {
	Defaceit.load.js('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
}

Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/defaceit.css');

function mrand(max){
	return Math.floor(Math.random()*10000%(max+1));
}

Defaceit.home = 'http://defaceit.ru/defaceit/baloon/develop';


Defaceit.Baloons = {


	show_window: function (message, title) {
		var w = Defaceit.Window.Manager.create('Baloons', {
				content: message,
				title: title,
				geometry: ['show']
			});
	},

	show: function(json) {
		Defaceit.Baloons.show_window(decodeURIComponent(json.message_text));
	},
	add_message: function(message){
		var url = 'http://defaceit.ru/message/add/'+encodeURIComponent(message);
		Defaceit.load.js(url);
	},

	message: function() {
			var message = '';
			if (window["baloonMessage"]) {
				message = window["baloonMessage"];
			}else if (message = /defaceit.ru\/baloon\/([^\/]*)$/.exec(document.location)){
				message = decodeURIComponent(message[1]);
			}else{
				message = "Empty message";
			}
			return message;
	},
	
	queue_message:function(message, full) {
	    this.show_window(message);
	}

}

Defaceit.Window.Baloons = Defaceit.extend(Defaceit.Window.Simple, {
	configure: function(config) {
		var config = this.parent.configure.call(this, config);
		
		config.buttons = Defaceit.merge([{text:'Закрыть', handler: function(){this.hide();return false;}}], config.buttons);

		config.geometry = Defaceit.merge(['width:400', 'center'], config.geometry);
		return config;
 	},

	create_window: function() {
		this.baloon_image = jQuery('<img>')
			.attr('src',  'http://defaceit.ru/defaceit/baloon/develop/images/baloons.png')
			.css('z-index', 900)
			.appendTo(jQuery("body"));
		this.create_baloons();
		this.parent.create_window.call(this);
	},

	create_baloons: function() {
		this.salut =  Defaceit.Effects.Salut.create({
                                    elements: [
                                            Defaceit.home + '/images/baloon0.png',
                                            Defaceit.home + '/images/baloon1.png',
                                            Defaceit.home + '/images/baloon2.png',
                                            Defaceit.home + '/images/baloon3.png']
                                });
	},

	hide: function() {
		this.salut.hide();
		this.baloon_image && this.baloon_image.fadeOut('slow');
		this.parent.hide.call(this);
	},

	show: function() {
		this.baloon_image && this.baloon_image.hide() && this.baloon_image.fadeIn('slow');
		this.wnd_handler.hide() && this.wnd_handler.fadeIn('slow');
	},
	
	center: function() {
		this.parent.center.call(this);
		this.baloon_image.css({ position:"fixed", left:this.config.pX-100, top:this.config.pY-100})
	}
	
});



baloons = function(name){
	var $ = window[name];
	$(document).ready(function(){
	

			if (/defaceit.ru\/baloon/.test(document.location)) {
				$('body').css({padding:0, margin: 0, "background-color": "#E8F3FF"});
			}
			
			if (/defaceit.ru/.test(document.location) || window.baloonMessage){
				Defaceit.Baloons.show_window(Defaceit.Baloons.message());
			}

	});
}



Defaceit.load.image(Defaceit.home + '/images/baloon0.png');
Defaceit.load.image(Defaceit.home + '/images/baloon1.png');
Defaceit.load.image(Defaceit.home + '/images/baloon2.png');
Defaceit.load.image(Defaceit.home + '/images/baloon3.png');
Defaceit.load.image(Defaceit.home + '/images/baloons.png');


Defaceit.wait("jQuery", baloons, this, ["jQuery"]);
