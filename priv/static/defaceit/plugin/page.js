test = {
    "defaceit.plugin.menu" : ["это текст №1", "это текст №2"],
    "defaceit.plugin.content": ["Это какой-то контент"]
}




Defaceit.load.css("http://sandbox.defaceit.ru/js/bootstrap/css/bootstrap.css");
Defaceit.load.css("http://sandbox.defaceit.ru/js/bootstrap/css/bootstrap-responsive.css");
Defaceit.load.js("http://sandbox.defaceit.ru/js/bootstrap/js/bootstrap.js");

Defaceit.Page = Defaceit.Page || {};

$("body").html("<div class=\"navbar navbar-fixed-top\"><div class=\"navbar-inner\"><div class=\"container\"></div></div></div>");

Defaceit.Page.brand && (function(){$(".navbar-inner .container").html("<a class=\"brand\" href=\"/\">"+Defaceit.Page.brand+"</a>");})();

Defaceit.Page.menu && jQuery.each(Defaceit.Page.menu[0].load(Defaceit.Page.menu[1]), function(i, o) {
	menu_container = $("<div>").addClass("nav-collapse");	
	menu = $("<ul>").addClass("nav nav-pills");
	menu.append($("<li>").addClass("dropdown").html("<a href='#'>"+o+"</a>"));
	menu_container.append(menu);
	$('.navbar-inner .container').append(menu_container);
});



/*Defaceit.load.js('...', "Defaceit").now();
Defaceit.load.js('....', "Defaceit.page").now();
Defaceit.load.css('...', "ClassName1").after("ClassName0");
Defaceit.load.img('...');*/




/*


<div class="nav-collapse">
                <ul class="nav nav-pills">
 
                    <li class="active"><a href="#">Содержание</a></li>
                    <li class="dropdown" id="services">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#services">Сервисы<b class="caret"></b></a>
                        <ul  class="dropdown-menu">
                            <li><a href="/email">Форма обратной связи</a></li>
                            <li><a href="/baloon/При формаировании адреса страницы укажите текст поздравления">Страница поздравлений</a></li>
                        </ul>
                    </li>
                    <li class="dropdown" id="defaces-list">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#defces">Дефейсы<b class="caret"></b></a>
                        <ul class="dropdown-menu" id="defaces">
 
                            <li class="divider"></li>
                            <li><a href="/app/edit/main">Добавить</a></li>
                        </ul>
                    </li>
                </ul>
          </div><!--/.nav-collapse -->
<F2>




  */