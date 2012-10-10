DefaceitHome = DefaceitHome || false;

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
