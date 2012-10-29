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
<div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">Defaceit</a>

            <div class="nav-collapse">
                <ul class="nav nav-pills">
		    {{menu}}
                </ul>
          </div><!--/.nav-collapse -->

        </div>
      </div>
    </div>


<div class="container">

<div class="hero-unit">

        <div class="row">
                <h1 class="hero-title">Бесплатные виджеты для вашего сайта<br>просто, быстро, удобно</h1><br><br>
                <div class="span7" >

                        <p>{{hero_overview}}</p><br>
                        <p>
                    	    {{hero_buttons}}
                        </p>
                </div>
                <div class="span3">
                        <img src="/images/widgets.png" alt="Виджеты">
                </div>
        </div>
    </div>
<h1 class="main-title" >{{title1}}</h1>

<div class="row-fluid">
        <div class="span4">
            <div class="box-content">
        	    {{content1}}
            </div>
        </div>

        <div class="span4">
            <div class="box-content">
        	    {{content2}}
            </div>
        </div>

        <div class="span4">
            <div class="box-content">
        	    {{content3}}
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
