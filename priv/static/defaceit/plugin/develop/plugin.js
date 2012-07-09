if (!window.jQuery) {
	Defaceit.load.js('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
}

loader = {
    load: function(key) {
	var test = {
		"defaceit.plugin.menu" : ["это текст №1.1", "это текст №2.1"],
	        "defaceit.plugin.content": ["Это какой-то контент"]
	}
	return test[key];
    }
}

content = {
    load: function(content) {
	return content;
    }
}

Defaceit.Page = {
    brand: [content, "Плагины"],
    menu: [loader, "defaceit.plugin.menu"], // на один и тот же ключ можно повесить несколько значений, частный случай - одно значение в массиве
    content: [Defaceit.loader, "defaceit.plugin.content"] // content - может содержать объект который занимается построением контента или ID объекта из базы контента
    
}







Defaceit.load.js('http://sandbox.defaceit.ru/defaceit/plugin/page.js');



/*plugin = function(name){
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
Defaceit.wait("jQuery", plugin, this, ["jQuery"]);*/