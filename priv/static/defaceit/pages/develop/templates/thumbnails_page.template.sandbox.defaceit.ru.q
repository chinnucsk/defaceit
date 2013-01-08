<!DOCTYPE html>
<head>
        <title>{{Article.title}}</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="description" content="Страница разработчиков фейверка шаров" />



        <link href="/bootstrap/css/my.css" rel="stylesheet">
        <link href="/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
        <link href="http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=cyrillic-ext" rel="stylesheet" type="text/css">
        
        <script src="http://defaceit.ru/defaceit/pages/pages.js"></script>
        <script src="/bootstrap/js/bootstrap.js"></script>

        <script src="http://defaceit.ru/comments.js"></script>


        <!--DefaultValues-->

        <style type="text/css">
       
        .blockMenuItem, .page{
            background: url("http://defaceit.ru/images/bg.png") repeat scroll 0 0 #FFFFFF !important;
            border: 1px solid #FFFFFF;
            border-radius: 6px 6px 6px 6px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
            
            margin: 0 0 10px 10px;
            padding: 10px;
            text-align: center;
        }

        .page{
            overflow: hidden;
        }

        .blockMenuItem {
            cursor: pointer;
            /*float: left;*/
    	    display:block;
        }
    </style>
    
</head>
<body>
<div class="container defaceit-page">

<div class="row-fluid ">
        <div class="span2 defaceit-page-left-bar">
            <br /><div class="logo_container">{{Logo}}</div><br/><br/>
            <h3>Комментарии</h3>
                <a href="#" class="add-comment">&nbsp;</a>

                <ul id="comments" class="list"></ul>
        </div>

        <div class="span10 defaceit-page-content">
            <div class="article_container">
                <h1>{{Article.title}}</h1>
    	        <div>{{Article.content}}</div>
            </div>

            <div class="thumbnails_container">{{Thumbnails}}</div>
        </div>
</div>

<hr>

     <footer><div class="footer_container">{{Footer}}</div></footer>


    </div> <!-- /container -->
</body>
</html>
