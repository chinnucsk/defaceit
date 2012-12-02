<!DOCTYPE html>
<head>
        <title>{{Article.title}}</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="description" content="Страница разработчиков фейверка шаров" />

        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script type="text/javascript" src="http://defaceit.ru/defaceit/tools.js"></script>

        <link href="/bootstrap/css/my.css" rel="stylesheet">
        <link href="/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
        <link href="http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=cyrillic-ext" rel="stylesheet" type="text/css">
        
        <script src="/bootstrap/js/bootstrap.js"></script>
        
        <script>
            url = "{{PageUrl}}";
    	    commentsQueue = "comments." + url;
    	</script>
    
</head>
<body>
<div class="container defaceit-page">

<div class="row-fluid ">
        <div class="span2 defaceit-page-left-bar">
<br /><a href="/">{{Defaults.logo}}</a><br/><br/>

<h3>Комментарии</h3>
	<a onclick="Defaceit.Window.Manager.create('InputBox', {title: 'Комментарий', geometry: ['width:400', 'center', 'show'], handler:function(){Defaceit.Queue(commentsQueue).push(this.message()); this.hide();}});return false;" href="#" class="add-comment">&nbsp;</a>

	<ul id="comments" class="list">
	</ul>
	</div>

        <div class="span10 defaceit-page-content">
            <h1>{{Article.title}}</h1>
    		<div>{{Article.content}}</div>

            {{Thumbnails}}
        </div>
</div>

<hr>

     <footer>{{Footer}}</footer>


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
