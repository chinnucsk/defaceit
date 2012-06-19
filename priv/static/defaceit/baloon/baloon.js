Defaceit=window.Defaceit||{};Defaceit.wait=function(a,b,c,d){var c=c||this,d=d||[],e=setInterval(function(){window[a]&&(b.call(c,d),clearInterval(e))},100)};Defaceit.load={js:function(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)},css:function(a){var b=document.createElement("link");b.rel="stylesheet";b.type="text/css";b.href=a;document.getElementsByTagName("head")[0].appendChild(b)}};
Defaceit.extend=function(a,b){b=b||{};a=a||function(){};child=function(){a.apply(this,arguments)};child.prototype={};for(var c in a.prototype)child.prototype[c]=a.prototype[c];child.prototype.parent={};for(c in b)child.prototype[c]&&(child.prototype.parent[c]=a.prototype[c]),child.prototype[c]=b[c];return child};Defaceit.merge=function(a,b){return jQuery.merge(a,b)};Defaceit.Screen={height:function(){return $(window).height()},width:function(){return $(window).width()}};Defaceit.Window={};
Defaceit.Window.Simple=function(a){this.init(a)};Defaceit.Window.Simple.create=function(a){return new Defaceit.Window.Simple(a)};
Defaceit.Window.Simple.prototype={wnd_handler:null,content_handler:null,config:{width:"400px"},init:function(a){this.configure(a);this.create_window();this.apply_content(a.content);this.apply_buttons(a.buttons);this.modify(a.geometry)},configure:function(a){this.config=a||{};this.config.plugins=this.config.plugins||{};this.config.geometry=this.config.geometry||[];this.config.buttons=this.config.buttons||[];return this.config},modify:function(a){if(!a||!a.length)return!1;for(var b=0;b<a.length;b++){var c=
a[b];jQuery.isFunction(c)&&c.call(this)||this[c]&&this[c].call(this)}},position:function(a,b){this.config.pX=a||this.config.pX;this.config.pY=b||this.config.pY;this.wnd_handler.css({left:this.config.pX,top:this.config.pY})},create_window:function(){(this.wnd_handler=$("<div>")).addClass("dtWindow").appendTo("body")},apply_content:function(a){if(!a)return!1;this.content=a;return this.content_handler&&this.content_handler.html(this.content)||(this.content_handler=$("<div>").addClass("dtWindowContent").html(a).appendTo(this.wnd_handler))},
apply_buttons:function(a){function b(a){var b=$("<a>").attr("href","#").addClass("premium-button").html("Close");a.handler&&b.click(function(){return a.handler.call(d)});a.text&&b.attr("value",a.text);return b}if(!a||!a.length)return!1;for(var c=this.button_handler=$("<div>").addClass("dtWindowButtons"),d=this,e=0;e<a.length;e++)c.append(b(a[e]));c.appendTo(this.wnd_handler)},hide:function(){this.wnd_handler.hide()},show:function(){this.wnd_handler.show()},set_width:function(){this.config.width&&
this.wnd_handler.css({width:this.config.width})},set_height:function(){this.config.height&&this.wnd_handler.css({width:this.config.height})},size:function(){this.wnd_handler.css({width:this.width,height:this.height})},center:function(){this.config.pX=Math.floor(Defaceit.Display.width()/2-this.wnd_handler.width()/2);this.config.pY=Math.floor(Defaceit.Display.height()/2-this.wnd_handler.height()/2);this.position()},activate:function(){Defaceit.Window.Manager.get_active_window().deactivate();Defaceit.Window.Manager.active=
this.nth;this.state=this.show_menu;this.wnd_handler.animate({width:this.width,height:this.height,left:this.width/2,top:this.height/2},"fast");this.wnd_handler.html(this.content)},deactivate:function(){Defaceit.Window.Manager.active=-1;this.state=this.activate;this.wnd_handler.animate({width:50,height:50,left:this.init_position_x,top:this.init_position_y},"fast");this.wnd_handler.html(this.icon)},show_menu:function(){this.menu=this.menu||$("<div>").addClass("menu").appendTo(this.wnd_handler).html('<a href="#">\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c</a><a href="#">\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c</a><a href="#">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</a>');
this.menu.animate({width:"20%"},"fast");this.state=this.hide_menu},hide_menu:function(){this.menu.animate({width:"0%"},"fast");this.state=this.show_menu}};Defaceit.Window.Manager={collection:[],create:function(a,b){return new (Defaceit.Window[a]||Defaceit.Window.Simple)(b)},add:function(a){this.collection.push(a);return this.collection.length},get:function(a){return this.collection[a]},get_active_window:function(){return 0<=Defaceit.Window.Manager.active?this.get(Defaceit.Window.Manager.active):{deactivate:function(){}}}};
Defaceit.Display={width:function(){return $(window).width()},height:function(){return $(window).height()}};Defaceit.Session=function(a){this.resource=a};Defaceit.Session.prototype={sign_in:!1,check_status:function(a){this.sign_in=!0;request(this.resource+"/show",function(b){null==b.data.key&&(this.sign_in=!1);this.data=b.data;a.call(this)},this)},signed_in:function(){return this.key?!0:!1}};callbacks=[];
function request(a,b,c){callbacks.push([b,c]);b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)}function defaceit(a){callback=callbacks[0];callback[0].call(callback[1],a)};window.jQuery||Defaceit.load.js("http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");Defaceit.load.css("http://defaceit.ru/defaceit/baloon/develop/baloon.css");function mrand(a){return Math.floor(1E4*Math.random()%(a+1))}Defaceit.home="http://defaceit.ru/defaceit/baloon/develop";
Defaceit.Baloons={show_window:function(a){Defaceit.Window.Manager.create("Baloons",{content:a,geometry:["show"]})},show:function(a){Defaceit.Baloons.show_window(decodeURIComponent(a.message_text))},add_message:function(a){a="http://defaceit.ru:8001/message/add/"+encodeURIComponent(a);Defaceit.load.js(a)},message:function(){var a="";return a=window.baloonMessage?window.baloonMessage:(a=/defaceit.ru\/baloon\/([^\/]*)$/.exec(document.location))?decodeURIComponent(a[1]):"Empty message"}};
Defaceit.Window.Baloons=Defaceit.extend(Defaceit.Window.Simple,{configure:function(a){a=this.parent.configure.call(this,a);a.buttons=Defaceit.merge([{text:"Close",handler:function(){this.hide();return!1}}],a.buttons);a.geometry=Defaceit.merge(["center"],a.geometry)},create_window:function(){this.baloon_image=$("<img>").attr("src","http://defaceit.ru/defaceit/baloon/develop/images/baloons.png").css("z-index",900).appendTo($("body"));this.create_baloons();this.parent.create_window.call(this)},
create_baloons:function(){that=this;that.baloons=[];var a=function(a,c,d){for(var e=0;e<a;e++){var f=mrand(Defaceit.Screen.width()-100),g=Defaceit.Screen.height()-170,f=Defaceit.Effects.Baloon.create({position:{start:[f,g],end:[f,"-="+g]},scale:c,duration:d,repeat:!0,modif:{top:["blink"]}});f.baloon_handle.css("opacity",0);that.baloons.push(f);(function(a,b){setTimeout(function(){a.animate()},mrand(1.5*b))})(f,d)}};a(5,0.6,5E3);a(5,0.8,3500);a(4,1,2E3)},hide:function(){for(var a=0;a<this.baloons.length;a++)this.baloons[a].hide();
this.baloon_image&&this.baloon_image.fadeOut("slow");this.parent.hide.call(this)},show:function(){this.baloon_image&&this.baloon_image.show();this.parent.show.call(this);this.animate()},center:function(){this.parent.center.call(this);this.baloon_image.css({position:"absolute",left:this.config.pX-100,top:this.config.pY-100})},animate:function(){}});Defaceit.Effects={};Defaceit.Effects.Baloon=function(a){this.init(a)};Defaceit.Effects.Baloon.create=function(a){return new Defaceit.Effects.Baloon(a)};
Defaceit.Effects.Baloon.prototype={init:function(a){this.configure(a);this.create_baloon()},configure:function(a){this.config=a;this.config.duration=this.config.duration||1E3;this.config.scale=this.config.scale||1;this.config.position=this.config.position||{start:[0,0],end:[0,0]};this.config.modif=this.config.modif||{}},create_baloon:function(){var a=this.config.position;this.baloon_handle=$("<img>");this.baloon_handle.attr("id","test").attr("src",Defaceit.home+"/images/baloon"+mrand(3)+".png").css("position",
"absolute").css("left",a.start[0]).css("top",a.start[1]).appendTo($("body"));var b=this;this.baloon_handle.load(function(){b.scale()})},animate:function(){var a=this;this.baloon_handle.animate({left:this.config.position.end[0],top:this.config.position.end[1]},{duration:this.config.duration,step:function(b,c){a.modify.call(a,b,c)},complete:function(){a.repeat.call(a)}})},repeat:function(){this.config.repeat&&(this.baloon_handle.css({left:this.config.position.start[0],top:this.config.position.start[1]}),
this.animate())},modify:function(a,b){var c=!!this.config.modif[b.prop]&&this.config.modif[b.prop];if(0<c.length)for(var d=0;d<c.length;d++)this[c[d]].call(this,a,b)},scale:function(a){this.config.scale=a||this.config.scale;var a=this.baloon_handle.width(),b=this.baloon_handle.height();this.baloon_handle.css("z-index",100*this.config.scale);this.baloon_handle.width(a*this.config.scale).height(b*this.config.scale)},blink:function(a,b){var c=(a-b.start)/(b.end-b.start),c=0.3>=c?3*c:0.7>c?1:1-3*(c-0.67),
d=0.9>this.config.scale?0.7:this.config.scale;$(b.elem).css("opacity",c>d?d:c)},hide:function(){this.config.repeat=!1;this.baloon_handle.hide()}};baloons=function(a){$=window[a];$(document).ready(function(){/defaceit.ru\/baloon/.test(document.location)&&$("body").css({padding:0,margin:0,"background-color":"#E8F3FF"});(/defaceit.ru/.test(document.location)||window.baloonMessage)&&Defaceit.Baloons.show_window(Defaceit.Baloons.message())})};Defaceit.wait("jQuery",baloons,this,["jQuery"]);
