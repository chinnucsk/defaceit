if (!window.jQuery) {
	Defaceit.load.js('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
}

plugin = function(name){
	$ = window[name];
	$(document).ready(function(){
			plugins = [
				{title: "Салют", text: "Салют - это эффект, который создает элементы всплывающие снизу окна и постепенно взлетающие наверх"}
			];
			$("body").html("<h2>Список плагинов</h2><div id='plugins'></div>");
			$.each(plugins, function(i, o){
				$("#plugins").append($("<p>").html("<h1>"+o.title+"</h1><p>"+o.text+"</p>"));
			});

	});
}
Defaceit.wait("jQuery", plugin, this, ["jQuery"]);