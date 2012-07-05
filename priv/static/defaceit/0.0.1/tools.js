
Defaceit = window.Defaceit || {}

Defaceit.wait = function(object, callback, scope, args) {
	scope = scope || this;
	args = args || [];

	var idi = setInterval(check, 100);

	function check() {
		if (window[object]) {
			callback.call(scope, args);
			clearInterval(idi);
		}

	}
}

Defaceit.load ={
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
	}
}





if(console) {
	console.debug('Defaceit tools load - ok');
}