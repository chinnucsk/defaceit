Defaceit=window.Defaceit||{};Defaceit.wait=function(a,b,c,d){var c=c||this,d=d||[],e=setInterval(function(){if(0<Defaceit.load.wait.length)for(var f=0;f<Defaceit.load.wait.length;f++)if("Ok"!=Defaceit.load.wait[f])return;window[a]&&(b.call(c,d),clearInterval(e))},100)};
Defaceit.load={wait:[],js:function(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)},css:function(a){var b=document.createElement("link");b.rel="stylesheet";b.type="text/css";b.href=a;document.getElementsByTagName("head")[0].appendChild(b)},image:function(a){this.wait=this.wait||[];var b=this.wait.length,c=document.createElement("img");c.src=a;this.wait[b]=a;document.getElementsByTagName("head")[0].appendChild(c);var d=this;
c.onload=function(){d.wait[b]="Ok"}}};Defaceit.extend=function(a,b){b=b||{};a=a||function(){};child=function(){a.apply(this,arguments)};child.prototype={};for(var c in a.prototype)child.prototype[c]=a.prototype[c];child.prototype.parent={};for(c in b)child.prototype[c]&&(child.prototype.parent[c]=a.prototype[c]),child.prototype[c]=b[c];return child};Defaceit.merge=function(a,b){return jQuery.merge(a,b)};Defaceit.request=function(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)};
callbacks=[];function request(a){var b=document.createElement("script");b.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(b)}function defaceit(a){callback=callbacks[0];callback[0].call(callback[1],a)}Defaceit.Screen={border:10,height:function(){return $(window).height()},width:function(){return $(window).width()},scroll_top:function(){return $(window).scrollTop()}};Defaceit.Session=function(a){this.resource=a};
Defaceit.Session.prototype={sign_in:!1,check_status:function(a){this.sign_in=!0;request(this.resource+"/show",function(b){null==b.data.key&&(this.sign_in=!1);this.data=b.data;a.call(this)},this)},signed_in:function(){return this.key?!0:!1}};Defaceit.Display={width:function(){return $(window).width()},height:function(){return $(window).height()}};Defaceit.Window={};Defaceit.Window.Simple=function(a){this.init(a)};Defaceit.Window.Simple.create=function(a){return new Defaceit.Window.Simple(a)};
Defaceit.Window.Simple.prototype={wnd_handler:null,wnd_container:null,content_handler:null,config:{},init:function(a){a=this.configure(a);this.create_window();this.apply_content(a.content);this.apply_buttons(a.buttons);this.modify(a.geometry)},configure:function(a){this.config=a||{};this.config.plugins=this.config.plugins||{};this.config.geometry=this.config.geometry||[];this.config.buttons=this.config.buttons||[];return this.config},modify:function(a){if(!a||!a.length)return!1;for(var b=0;b<a.length;b++){var c=
a[b],d=c.split(":"),c=d[0],d=1<d.length?d.slice(1):[];jQuery.isFunction(c)&&c.call(this)||this[c]&&this[c].apply(this,d)}},position:function(a,b){this.config.pX=a||this.config.pX;this.config.pY=b||this.config.pY;this.wnd_handler.css({left:this.config.pX,top:this.config.pY})},create_window:function(){(this.wnd_handler=$("<div>")).addClass("dtWindow").appendTo("body");(this.wnd_container=$("<div>")).addClass("dtWindowContainer").appendTo(this.wnd_handler)},apply_content:function(a){if(!a)return!1;this.content=
a;return this.content_handler&&this.content_handler.html(this.content)||(this.content_handler=$("<div>").addClass("dtWindowContent").html(a).appendTo(this.wnd_container))},apply_buttons:function(a){function b(a){var c=$("<a>").attr("href","#").addClass("premium-button").html(a.text);a.handler&&c.click(function(){return a.handler.call(d)});a.text&&c.attr("value",a.text);return c}if(!a||!a.length)return!1;for(var c=this.button_handler=$("<div>").addClass("dtWindowButtons"),d=this,e=0;e<a.length;e++)c.append(b(a[e]));
c.appendTo(this.wnd_container)},hide:function(){this.wnd_handler.hide()},show:function(){this.wnd_handler.show()},width:function(a){this.config.width=parseInt(a||this.config.width);this.config.width&&this.wnd_container.css({width:this.config.width})},height:function(a){this.config.height=parseInt(a||this.config.height);this.config.height&&this.wnd_container.css({height:this.config.height})},size:function(){this.wnd_container.css({width:this.width,height:this.height})},center:function(){this.config.pX=
Math.floor(Defaceit.Screen.width()/2-this.wnd_handler.width()/2);this.config.pY=Math.floor(Defaceit.Screen.height()/2-this.wnd_handler.height()/2)+Defaceit.Screen.scroll_top();this.position()},deltaXY:function(a,b){a=parseInt(a||0);b=parseInt(b||0);this.config.pX+=a;this.config.pY+=b;this.position()},top:function(){this.config.pY=Defaceit.Screen.border+Defaceit.Screen.scroll_top();this.position()},right:function(){this.config.pX=Defaceit.Screen.width()-this.wnd_handler.width()-Defaceit.Screen.border;
this.position()},activate:function(){Defaceit.Window.Manager.get_active_window().deactivate();Defaceit.Window.Manager.active=this.nth;this.state=this.show_menu;this.wnd_handler.animate({width:this.width,height:this.height,left:this.width/2,top:this.height/2},"fast");this.wnd_handler.html(this.content)},deactivate:function(){Defaceit.Window.Manager.active=-1;this.state=this.activate;this.wnd_handler.animate({width:50,height:50,left:this.init_position_x,top:this.init_position_y},"fast");this.wnd_handler.html(this.icon)},
show_menu:function(){this.menu=this.menu||$("<div>").addClass("menu").appendTo(this.wnd_handler).html('<a href="#">\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c</a><a href="#">\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c</a><a href="#">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</a>');this.menu.animate({width:"20%"},"fast");this.state=this.hide_menu},hide_menu:function(){this.menu.animate({width:"0%"},"fast");this.state=this.show_menu}};
Defaceit.Window.InputBox=Defaceit.extend(Defaceit.Window.Simple,{configure:function(a){a.handler=a.handler||function(){alert("\u041e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f \u043d\u0435 \u0437\u0430\u0434\u0430\u043d")};this.textarea=$("<TEXTAREA>").addClass("dtWindowInputBoxTextarea");a.content=this.textarea;a.buttons=[{text:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c",handler:a.handler}];return this.parent.configure(a)},
message:function(){return this.textarea.text()}});Defaceit.Window.Manager={collection:[],create:function(a,b){return new (Defaceit.Window[a]||Defaceit.Window.Simple)(b)},add:function(a){this.collection.push(a);return this.collection.length},get:function(a){return this.collection[a]},get_active_window:function(){return 0<=Defaceit.Window.Manager.active?this.get(Defaceit.Window.Manager.active):{deactivate:function(){}}}};
Defaceit.Queue=function(a){if(this==Defaceit)return a=a||"",Defaceit.Queue.list[a]=Defaceit.Queue.list[a]||new Defaceit.Queue(a),Defaceit.Queue.list[a];this.queue=a;return this};
Defaceit.Queue.prototype={queue:"",clients:[],call_id:1,next_call_id:function(){return this.call_id++},list:function(){Defaceit.request("http://sandbox.defaceit.ru:8002/queue/list/"+this.queue+"/"+this.next_call_id());return this},push:function(a){var b=this.next_call_id();Defaceit.request("http://sandbox.defaceit.ru:8002/queue/push/"+this.queue+"/"+b+"/"+encodeURIComponent(a));return b},top:function(){Defaceit.request("http://sandbox.defaceit.ru:8002/queue/top/"+this.queue+"/"+this.next_call_id());
return this},client:function(a){this.clients=this.clients||[];this.clients.push(a)},client_callback:function(a){switch(a.type){case "messages":for(var b=0;b<a.data.length;b++)this.send_message(a.data[b].message_text,a.data[b]);break;case "message":this.send_message(a.data.message_text,a.data);break;case "status":this.send_status_message(a)}},send_status_message:function(a){for(var b=0;b<this.clients.length;b++){var c=this.clients[b];c.queue_status&&c.queue_status(a)}},send_message:function(a,b){for(var a=
decodeURIComponent(a),c=0;c<this.clients.length;c++){var d=this.clients[c];d.queue_message&&d.queue_message(a,b)}}};Defaceit.Queue.list={};Defaceit.Queue.callbacks=[];Defaceit.Queue.response=function(a){Defaceit.Queue.list[a.queue_name].client_callback(a)};window.Defaceit=window.Defaceit||{};Defaceit.Effects=Defaceit.Effects||{};Defaceit.Effects.Salut=function(){};
Defaceit.Effects.Salut=function(){var a=function(a){this.init(a)};a.create=function(c){return new a(c)};a.prototype={init:function(a){this.configure(a);this.create_baloon()},configure:function(a){this.config=a;this.config.duration=this.config.duration||1E3;this.config.scale=this.config.scale||1;this.config.position=this.config.position||this.calculate_position();this.config.modif=this.config.modif||{}},calculate_position:function(){var a=mrand(Defaceit.Screen.width()-100),b=Defaceit.Screen.height()-
170;return{start:[a,b+Defaceit.Screen.scroll_top()],end:[a,"-="+b]}},create_baloon:function(){var a=this.config.position;this.baloon_handle=$("<img>");this.baloon_handle.attr("id","test").attr("src",this.config.url).css("position","absolute").css("left",a.start[0]).css("top",a.start[1]).appendTo($("body"));this.scale()},animate:function(){var a=this;this.baloon_handle.animate({left:this.config.position.end[0],top:this.config.position.end[1]},{duration:this.config.duration,step:function(b,e){a.modify.call(a,
b,e)},complete:function(){a.repeat.call(a)}})},repeat:function(){this.config.repeat&&(this.config.position=this.calculate_position(),this.baloon_handle.css({left:this.config.position.start[0],top:this.config.position.start[1]}),this.animate())},modify:function(a,b){var e=!!this.config.modif[b.prop]&&this.config.modif[b.prop];if(0<e.length)for(var f=0;f<e.length;f++)this[e[f]].call(this,a,b)},scale:function(a){this.config.scale=a||this.config.scale;var a=this.baloon_handle.width(),b=this.baloon_handle.height();
this.baloon_handle.css("z-index",100*this.config.scale);this.baloon_handle.width(a*this.config.scale).height(b*this.config.scale)},blink:function(a,b){var e=(a-b.start)/(b.end-b.start),e=0.3>=e?3*e:0.7>e?1:1-3*(e-0.67),f=0.9>this.config.scale?0.7:this.config.scale;$(b.elem).css("opacity",e>f?f:e)},hide:function(){this.config.repeat=!1;this.baloon_handle.hide()}};var b=function(a){this.init(a)};b.create=function(a){return new b(a)};b.prototype={init:function(b){that=this;that.elements=[];var d=function(e,
d,h){for(var i=0;i<e;i++){var g=a.create({url:b.elements[mrand(b.elements.length-1)],scale:d,duration:h,repeat:!0,modif:{top:["blink"]}});g.baloon_handle.css("opacity",0);that.elements.push(g);(function(a,b){setTimeout(function(){a.animate()},mrand(1.5*b))})(g,h)}};d(5,0.6,5E3);d(5,0.8,3500);d(4,1,2E3)},hide:function(){for(var a=0;a<this.elements.length;a++)this.elements[a].hide()}};return b}();window.jQuery||Defaceit.load.js("http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");Defaceit.load.css("http://sandbox.defaceit.ru/defaceit/tools/css/defaceit.css");function mrand(a){return Math.floor(1E4*Math.random()%(a+1))}Defaceit.home="http://sandbox.defaceit.ru/defaceit/baloon/develop";
Defaceit.Baloons={show_window:function(a){Defaceit.Window.Manager.create("Baloons",{content:a,geometry:["show"]})},show:function(a){Defaceit.Baloons.show_window(decodeURIComponent(a.message_text))},add_message:function(a){a="http://sandbox.defaceit.ru:8001/message/add/"+encodeURIComponent(a);Defaceit.load.js(a)},message:function(){var a="";return a=window.baloonMessage?window.baloonMessage:(a=/sandbox.defaceit.ru\/baloon\/([^\/]*)$/.exec(document.location))?decodeURIComponent(a[1]):"Empty message"},
queue_message:function(a){this.show_window(a)}};
Defaceit.Window.Baloons=Defaceit.extend(Defaceit.Window.Simple,{configure:function(a){a=this.parent.configure.call(this,a);a.buttons=Defaceit.merge([{text:"Close",handler:function(){this.hide();return!1}}],a.buttons);a.geometry=Defaceit.merge(["width:400","center"],a.geometry)},create_window:function(){this.baloon_image=$("<img>").attr("src","http://sandbox.defaceit.ru/defaceit/baloon/develop/images/baloons.png").css("z-index",900).appendTo($("body"));this.create_baloons();this.parent.create_window.call(this)},
create_baloons:function(){this.salut=Defaceit.Effects.Salut.create({elements:[Defaceit.home+"/images/baloon0.png",Defaceit.home+"/images/baloon1.png",Defaceit.home+"/images/baloon2.png",Defaceit.home+"/images/baloon3.png"]})},hide:function(){this.salut.hide();this.baloon_image&&this.baloon_image.fadeOut("slow");this.parent.hide.call(this)},show:function(){this.baloon_image&&this.baloon_image.hide()&&this.baloon_image.fadeIn("slow");this.wnd_handler.hide()&&this.wnd_handler.fadeIn("slow")},center:function(){this.parent.center.call(this);
this.baloon_image.css({position:"absolute",left:this.config.pX-100,top:this.config.pY-100})}});baloons=function(a){$=window[a];$(document).ready(function(){/sandbox.defaceit.ru\/baloon/.test(document.location)&&$("body").css({padding:0,margin:0,"background-color":"#E8F3FF"});(/sandbox.defaceit.ru/.test(document.location)||window.baloonMessage)&&Defaceit.Baloons.show_window(Defaceit.Baloons.message())})};Defaceit.load.image(Defaceit.home+"/images/baloon0.png");Defaceit.load.image(Defaceit.home+"/images/baloon1.png");
Defaceit.load.image(Defaceit.home+"/images/baloon2.png");Defaceit.load.image(Defaceit.home+"/images/baloon3.png");Defaceit.load.image(Defaceit.home+"/images/baloons.png");Defaceit.wait("jQuery",baloons,this,["jQuery"]);
