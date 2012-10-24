<!DOCTYPE html>
<head>
        <title>{{Title}}</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="description" content="Страница разработчиков фейверка шаров" />
        
        <script type="text/javascript" src="http://defaceit.ru/defaceit/tools.js"></script>
        <script type="text/javascript" src="http://defaceit.ru/defaceit/pages/develop/pages.js"></script>
        <script>window.DefaceitDevelopMode = true;</script>
        
        


        <link href="/bootstrap/css/my.css" rel="stylesheet">
        <link href="/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
        <link href="http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=cyrillic-ext" rel="stylesheet" type="text/css">
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script src="/bootstrap/js/bootstrap.js"></script>
        <script>
            <!-- pageQueue -->
    	    commentsQueue = "comments." + pageQueue;
    	</script>
    
</head>
<body>
<div class="container defaceit-page">

<div class="row-fluid ">
        <div class="span2 defaceit-page-left-bar">
<br /><a href="/"><img src="http://defaceit.ru/images/logos/logo64.png" /></a><br/><br/>

<h3>Комментарии</h3>
	<a onclick="Defaceit.Window.Manager.create('InputBox', {title: 'Комментарий', geometry: ['width:400', 'center', 'show'], handler:function(){Defaceit.Queue(commentsQueue).push(this.message()); this.hide();}});return false;" href="#" class="add-comment">&nbsp;</a>

	<ul id="comments" class="list">
		<li><div class="comment">Мы установили виджеты на трех своих сайтах, пока полет нормальный. Спасибо! :-)</div></li>
	</ul>
	</div>

        <div class="span10 defaceit-page-content">
    		{{Article}}
        </div>
</div>

<hr>

     <footer>

        <p>&copy; <a href="http://esergeev.ru/">Evgeny Sergeev</a>    2012. Сайт заряжен через <a href="http://twitter.github.com/bootstrap/index.html">Twitter Bootstrap</a>, <a href="http://www.chicagoboss.org/">ChicagoBoss (erlang)</a>
        </p>


      </footer>


    </div> <!-- /container -->
<script>
Defaceit.Queue(commentsQueue ).client({
		queue_message: function(message) {
		    $("#comments").append("<li><div class=\"comment\">"+message+"</div></li>");
		},
		queue_status: function(message) {Defaceit.Queue(commentsQueue).top();}
	    });
	    Defaceit.Queue(commentsQueue).list();
</script>
</body>
</html>
