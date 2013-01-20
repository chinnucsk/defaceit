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


String.prototype.translit = (function () {
        var L = {
            '�': 'A', '�': 'a', '�': 'B', '�': 'b', '�': 'V', '�': 'v', '�': 'G', '�': 'g',
            '�': 'D', '�': 'd', '�': 'E', '�': 'e', '�': 'Yo', '�': 'yo', '�': 'Zh', '�': 'zh',
            '�': 'Z', '�': 'z', '�': 'I', '�': 'i', '�': 'Y', '�': 'y', '�': 'K', '�': 'k',
            '�': 'L', '�': 'l', '�': 'M', '�': 'm', '�': 'N', '�': 'n', '�': 'O', '�': 'o',
            '�': 'P', '�': 'p', '�': 'R', '�': 'r', '�': 'S', '�': 's', '�': 'T', '�': 't',
            '�': 'U', '�': 'u', '�': 'F', '�': 'f', '�': 'Kh', '�': 'kh', '�': 'Ts', '�': 'ts',
            '�': 'Ch', '�': 'ch', '�': 'Sh', '�': 'sh', '�': 'Sch', '�': 'sch', '�': '', '�': '',
            '�': 'Y', '�': 'y', '�': "", '�': "", '�': 'E', '�': 'e', '�': 'Yu', '�': 'yu',
            '�': 'Ya', '�': 'ya', ' ': '-', '_': '-', 
            '"': '', "'": '', '.': '', ',': '', '!': '', ':': '', ';': ''
        },
        r = '',
        k;
        for (k in L) r += k;
        r = new RegExp('[' + r + ']', 'g');
        k = function (a) {
            return a in L ? L[a] : '';
        };

        return function () {
            var text_string = this.replace(r, k).replace(' ', '-').toString();

            var literals = 'QqWwEeRrTtYyUuIiOoPpAaSsDdFfGgHhJjKkLlZzXxCcVvBbNnMm-0123456789';
            var newString = '';
            for (var i = 0; i < text_string.length; i++) {
                if (!(literals.indexOf(text_string.charAt(i)) == -1)) {
                    newString += text_string.charAt(i); 
                };
            };
            return newString;
        };
    })();