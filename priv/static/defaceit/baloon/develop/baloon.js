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



baloons = function(name){
	$ = window[name];
	$(document).ready(function(){

			if (/sandbox.defaceit.ru\/baloon/.test(document.location)) {
				$('body').css({padding:0, margin: 0, "background-color": "#E8F3FF"});
			}
			
			if (/sandbox.defaceit.ru/.test(document.location) || window.baloonMessage){
				Defaceit.Baloons.show_window(Defaceit.Baloons.message());
			}

	});
}
Defaceit.wait("jQuery", baloons, this, ["jQuery"]);
