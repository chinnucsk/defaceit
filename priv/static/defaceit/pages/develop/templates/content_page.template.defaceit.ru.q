 <!DOCTYPE html>
<head>
        <title>Widget Pages Development page</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="description" content="Страница разработчиков фейверка шаров" />
        
        <script type="text/javascript" src="http://sandbox.defaceit.ru/defaceit/tools.js"></script>
        <script type="text/javascript" src="http://sandbox.defaceit.ru/defaceit/pages/develop/pages.js"></script>
        <script>window.DefaceitDevelopMode = true;</script>
        
        


        <link href="/bootstrap/css/my.css" rel="stylesheet">
        <link href="/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
        <link href="http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=cyrillic-ext" rel="stylesheet" type="text/css">
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script src="/bootstrap/js/bootstrap.js"></script>
    
</head>
<body>
<div class="container">
<h1 class="main-title" >{{title1}}</h1>

<div class="row-fluid">
        <div class="span3">
            <div class="box-content">
        	    <ul id="comments" class="list">
					<li>
					<div class="cols">
					    <div class="comment">Мы установили виджеты на трех своих сайтах, пока полет нормальный. Спасибо! :-)</div>
					</div>
					</li>

					<li>
					<div class="cols">
					    <div class="comment">Хорошо когда есть люди, которые дают что-то даром. Мы успешно используем виджеты на своих сайтах.</div>
					</div>
					</li>



				</ul>
            </div>
        </div>

        <div class="span9">
            <div class="box-content">
        	    {{content2}}
            </div>
        </div>
</div>

<hr>

     <footer>

        <p>&copy; <a href="http://esergeev.ru/">Evgeny Sergeev</a>    2012. Сайт заряжен через <a href="http://twitter.github.com/bootstrap/index.html">Twitter Bootstrap</a>, <a href="http://www.chicagoboss.org/">ChicagoBoss (erlang)</a>
        </p>


      </footer>


    </div> <!-- /container -->
</body>
</html>
