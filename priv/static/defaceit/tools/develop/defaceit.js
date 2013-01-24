DefaceitHome = window.DefaceitHome || false;

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
	alert(url);
		var s =document.createElement('script');
  		s.setAttribute('src', url);
  		document.getElementsByTagName('head')[0].appendChild(s);
	},

	css: function(url) {
		var c = document.createElement('link');
		c.rel = 'stylesheet';
		c.type = 'text/css';
		c.href = url;
		document.getElementsByTagName('head')[0].appendChild(c);
	},
	
	image: function(url) {
                   alert(url);
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
	var child = function(){this.initialize.apply(this, arguments);};
	
	child.prototype = _.extend({}, mammy.prototype, o);
	child.prototype.parent = mammy.prototype;
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

Defaceit.Model = Backbone.Model.extend({

	status: function(status, propagate) {
		propagate = propagate === undefined ? true : propagate;

		if (status) {
			this.myStatus = status;
			if (propagate) {
				this.trigger('status:change');
			}
			return;
		}

		return this.myStatus;
	}
});

/**
 Global Changes
 */


String.prototype.translit = (function(){
    var L = {
'А':'A','а':'a','Б':'B','б':'b','В':'V','в':'v','Г':'G','г':'g',
'Д':'D','д':'d','Е':'E','е':'e','Ё':'Yo','ё':'yo','Ж':'Zh','ж':'zh',
'З':'Z','з':'z','И':'I','и':'i','Й':'Y','й':'y','К':'K','к':'k',
'Л':'L','л':'l','М':'M','м':'m','Н':'N','н':'n','О':'O','о':'o',
'П':'P','п':'p','Р':'R','р':'r','С':'S','с':'s','Т':'T','т':'t',
'У':'U','у':'u','Ф':'F','ф':'f','Х':'Kh','х':'kh','Ц':'Ts','ц':'ts',
'Ч':'Ch','ч':'ch','Ш':'Sh','ш':'sh','Щ':'Sch','щ':'sch','Ъ':'"','ъ':'"',
'Ы':'Y','ы':'y','Ь':"'",'ь':"'",'Э':'E','э':'e','Ю':'Yu','ю':'yu',
'Я':'Ya','я':'ya'
        },
        r = '',
        k;
    for (k in L) r += k;
    r = new RegExp('[' + r + ']', 'g');
    k = function(a){
        return a in L ? L[a] : '';
    };
    return function(){
        return this.replace(r, k);
    };
})();