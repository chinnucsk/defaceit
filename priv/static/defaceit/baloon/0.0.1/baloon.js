Defaceit=window.Defaceit||{};Defaceit.wait=function(a,b,c,d){var c=c||this,d=d||[],e=setInterval(function(){window[a]&&(b.call(c,d),clearInterval(e))},100)};Defaceit.load={js:function(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)},css:function(a){var b=document.createElement("link");b.rel="stylesheet";b.type="text/css";b.href=a;document.getElementsByTagName("head")[0].appendChild(b)}};console&&console.debug("Defaceit tools load - ok");window.jQuery||Defaceit.load.js("http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");Defaceit.load.css("http://sandbox.defaceit.ru/defaceit/baloon/develop/baloon.css");function mrand(a){return Math.floor(1E4*Math.random()%(a+1))}Defaceit.home="http://sandbox.defaceit.ru/defaceit/baloon/develop";
Defaceit.Baloons={num:70,map:[],init_baloon:function(){for(var a=Defaceit.Baloons.map,b=0;b<Defaceit.Baloons.num;b++){var c=mrand(4);a[b]=Defaceit.Baloons.choise(c);$("<img>").attr("id","baloon"+b).attr("src",Defaceit.home+"/images/baloon"+mrand(3)+".png").css("position","absolute").css("left",Math.floor(1E4*Math.random()%$(window).width()-100)).css("top",$(window).height()-(-3200+Math.floor(1E4*Math.random()%3200))).css("height",a[b].height).css("width",a[b].width).appendTo($("body"))}return a},
show_window:function(a){var b=$(window).width(),c=$(window).height(),b=Math.floor(b/2-200),c=Math.floor(c/2-100);$("<img>").css({position:"absolute",left:b-100,top:c-100}).attr("src",Defaceit.home+"/images/baloons.png").appendTo($("body"));$("<div>").attr("id","baloon-message").css({"font-size":"2em",padding:20,opacity:0.8,position:"absolute",left:b,top:c,width:400,height:200,"background-color":"#fff"}).appendTo($("body")).html(a)},choise:function(a){return[{width:100,height:158,speed:4200},{width:100/
a,height:158/a,speed:4300},{width:100/a,height:158/a,speed:4400},{width:100/a,height:158/a,speed:4500},{width:100/a,height:158/a,speed:4600}][a]},message:function(){var a="";return a=window.baloonMessage?window.baloonMessage:(a=/sandbox.defaceit.ru\/baloon\/([^\/]*)$/.exec(document.location))?decodeURIComponent(a[1]):"Empty message"},animate:function(){for(var a=Defaceit.Baloons.map,b=0;b<Defaceit.Baloons.num;b++)$("#baloon"+b).fadeIn("slow").animate({top:"-658px"},a[b].speed)}};
baloons=function(a){$=window[a];$(document).ready(function(){Defaceit.Baloons.init_baloon();Defaceit.Baloons.show_window(Defaceit.Baloons.message());Defaceit.Baloons.animate()})};Defaceit.wait("jQuery",baloons,this,["jQuery"]);
