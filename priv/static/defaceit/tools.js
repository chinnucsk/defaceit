Defaceit=window.Defaceit||{};Defaceit.wait=function(a,b,c,d){var c=c||this,d=d||[],e=setInterval(function(){if(0<Defaceit.load.wait.length)for(var f=0;f<Defaceit.load.wait.length;f++)if("Ok"!=Defaceit.load.wait[f])return;window[a]&&(b.call(c,d),clearInterval(e))},100)};
Defaceit.load={wait:[],js:function(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)},css:function(a){var b=document.createElement("link");b.rel="stylesheet";b.type="text/css";b.href=a;document.getElementsByTagName("head")[0].appendChild(b)},image:function(a){this.wait=this.wait||[];var b=this.wait.length,c=document.createElement("img");c.src=a;this.wait[b]=a;document.getElementsByTagName("head")[0].appendChild(c);var d=this;
c.onload=function(){d.wait[b]="Ok"}}};Defaceit.extend=function(a,b){b=b||{};a=a||function(){};child=function(){a.apply(this,arguments)};child.prototype={};for(var c in a.prototype)child.prototype[c]=a.prototype[c];child.prototype.parent={};for(c in b)child.prototype[c]&&(child.prototype.parent[c]=a.prototype[c]),child.prototype[c]=b[c];return child};Defaceit.merge=function(a,b){return jQuery.merge(a,b)};Defaceit.request=function(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)};
callbacks=[];function request(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)}function defaceit(a){callback=callbacks[0];callback[0].call(callback[1],a)};Defaceit.Screen={border:10,height:function(){return $(window).height()},width:function(){return $(window).width()},scroll_top:function(){return $(window).scrollTop()}};Defaceit.Session=function(a){this.resource=a};Defaceit.Session.prototype={sign_in:!1,check_status:function(a){this.sign_in=!0;request(this.resource+"/show",function(b){null==b.data.key&&(this.sign_in=!1);this.data=b.data;a.call(this)},this)},signed_in:function(){return this.key?!0:!1}};Defaceit.Display={width:function(){return $(window).width()},height:function(){return $(window).height()}};Defaceit.Window={};Defaceit.Window.Simple=function(a){this.init(a)};Defaceit.Window.Simple.create=function(a){return new Defaceit.Window.Simple(a)};
Defaceit.Window.Simple.prototype={wnd_handler:null,wnd_container:null,content_handler:null,config:{},init:function(a){this.configure(a);this.create_window();this.apply_content(a.content);this.apply_buttons(a.buttons);this.modify(a.geometry)},configure:function(a){this.config=a||{};this.config.plugins=this.config.plugins||{};this.config.geometry=this.config.geometry||[];this.config.buttons=this.config.buttons||[];return this.config},modify:function(a){if(!a||!a.length)return!1;for(var b=0;b<a.length;b++){var c=
a[b],d=c.split(":"),c=d[0],d=1<d.length?d.slice(1):[];jQuery.isFunction(c)&&c.call(this)||this[c]&&this[c].apply(this,d)}},position:function(a,b){this.config.pX=a||this.config.pX;this.config.pY=b||this.config.pY;this.wnd_handler.css({left:this.config.pX,top:this.config.pY})},create_window:function(){(this.wnd_handler=$("<div>")).addClass("dtWindow").appendTo("body");(this.wnd_container=$("<div>")).addClass("dtWindowContainer").appendTo(this.wnd_handler)},apply_content:function(a){if(!a)return!1;this.content=
a;return this.content_handler&&this.content_handler.html(this.content)||(this.content_handler=$("<div>").addClass("dtWindowContent").html(a).appendTo(this.wnd_container))},apply_buttons:function(a){function b(a){var b=$("<a>").attr("href","#").addClass("premium-button").html(a.text);a.handler&&b.click(function(){return a.handler.call(d)});a.text&&b.attr("value",a.text);return b}if(!a||!a.length)return!1;for(var c=this.button_handler=$("<div>").addClass("dtWindowButtons"),d=this,e=0;e<a.length;e++)c.append(b(a[e]));
c.appendTo(this.wnd_container)},hide:function(){this.wnd_handler.hide()},show:function(){this.wnd_handler.show()},width:function(a){this.config.width=a||this.config.width;this.config.width&&this.wnd_container.css({width:this.config.width})},height:function(a){this.config.height=a||this.config.height;this.config.height&&this.wnd_container.css({height:this.config.height})},size:function(){this.wnd_container.css({width:this.width,height:this.height})},center:function(){this.config.pX=Math.floor(Defaceit.Screen.width()/
2-this.wnd_handler.width()/2);this.config.pY=Math.floor(Defaceit.Screen.height()/2-this.wnd_handler.height()/2)+Defaceit.Screen.scroll_top();this.position()},top:function(){this.config.pY=Defaceit.Screen.border+Defaceit.Screen.scroll_top();this.position()},right:function(){this.config.pX=Defaceit.Screen.width()-this.wnd_handler.width()-Defaceit.Screen.border;this.position()},activate:function(){Defaceit.Window.Manager.get_active_window().deactivate();Defaceit.Window.Manager.active=this.nth;this.state=
this.show_menu;this.wnd_handler.animate({width:this.width,height:this.height,left:this.width/2,top:this.height/2},"fast");this.wnd_handler.html(this.content)},deactivate:function(){Defaceit.Window.Manager.active=-1;this.state=this.activate;this.wnd_handler.animate({width:50,height:50,left:this.init_position_x,top:this.init_position_y},"fast");this.wnd_handler.html(this.icon)},show_menu:function(){this.menu=this.menu||$("<div>").addClass("menu").appendTo(this.wnd_handler).html('<a href="#">\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c</a><a href="#">\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c</a><a href="#">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</a>');
this.menu.animate({width:"20%"},"fast");this.state=this.hide_menu},hide_menu:function(){this.menu.animate({width:"0%"},"fast");this.state=this.show_menu}};Defaceit.Window.Manager={collection:[],create:function(a,b){return new (Defaceit.Window[a]||Defaceit.Window.Simple)(b)},add:function(a){this.collection.push(a);return this.collection.length},get:function(a){return this.collection[a]},get_active_window:function(){return 0<=Defaceit.Window.Manager.active?this.get(Defaceit.Window.Manager.active):{deactivate:function(){}}}};Defaceit.Queue=function(a){if(this==Defaceit)return a=a||"",Defaceit.Queue.list[a]=Defaceit.Queue.list[a]||new Defaceit.Queue(a),Defaceit.Queue.list[a];this.queue=a;return this};
Defaceit.Queue.prototype={queue:"",clients:[],call_id:1,next_call_id:function(){return this.call_id++},list:function(){Defaceit.request("http://sandbox.defaceit.ru:8002/queue/list/"+this.queue+"/"+this.next_call_id());return this},push:function(a){var b=this.next_call_id();Defaceit.request("http://sandbox.defaceit.ru:8002/queue/push/"+this.queue+"/"+b+"/"+encodeURIComponent(a));return b},top:function(){Defaceit.request("http://sandbox.defaceit.ru:8002/queue/top/"+this.queue+"/"+this.next_call_id());
return this},client:function(a){this.clients=this.clients||[];this.clients.push(a)},client_callback:function(a){switch(a.type){case "messages":for(var b=0;b<a.data.length;b++)this.send_message(a.data[b].message_text,a.data[b]);break;case "message":this.send_message(a.data.message_text,a.data);break;case "status":this.send_status_message(a)}},send_status_message:function(a){for(var b=0;b<this.clients.length;b++){var c=this.clients[b];c.queue_status&&c.queue_status(a)}},send_message:function(a,b){for(var a=
decodeURIComponent(a),c=0;c<this.clients.length;c++){var d=this.clients[c];d.queue_message&&d.queue_message(a,b)}}};Defaceit.Queue.list={};Defaceit.Queue.callbacks=[];Defaceit.Queue.response=function(a){Defaceit.Queue.list[a.queue_name].client_callback(a)};
