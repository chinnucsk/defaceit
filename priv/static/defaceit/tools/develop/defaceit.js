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
            'À': 'A', 'à': 'a', 'Á': 'B', 'á': 'b', 'Â': 'V', 'â': 'v', 'Ã': 'G', 'ã': 'g',
            'Ä': 'D', 'ä': 'd', 'Å': 'E', 'å': 'e', '¨': 'Yo', '¸': 'yo', 'Æ': 'Zh', 'æ': 'zh',
            'Ç': 'Z', 'ç': 'z', 'È': 'I', 'è': 'i', 'É': 'Y', 'é': 'y', 'Ê': 'K', 'ê': 'k',
            'Ë': 'L', 'ë': 'l', 'Ì': 'M', 'ì': 'm', 'Í': 'N', 'í': 'n', 'Î': 'O', 'î': 'o',
            'Ï': 'P', 'ï': 'p', 'Ð': 'R', 'ð': 'r', 'Ñ': 'S', 'ñ': 's', 'Ò': 'T', 'ò': 't',
            'Ó': 'U', 'ó': 'u', 'Ô': 'F', 'ô': 'f', 'Õ': 'Kh', 'õ': 'kh', 'Ö': 'Ts', 'ö': 'ts',
            '×': 'Ch', '÷': 'ch', 'Ø': 'Sh', 'ø': 'sh', 'Ù': 'Sch', 'ù': 'sch', 'Ú': '', 'ú': '',
            'Û': 'Y', 'û': 'y', 'Ü': "", 'ü': "", 'Ý': 'E', 'ý': 'e', 'Þ': 'Yu', 'þ': 'yu',
            'ß': 'Ya', 'ÿ': 'ya', ' ': '-', '_': '-', 
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