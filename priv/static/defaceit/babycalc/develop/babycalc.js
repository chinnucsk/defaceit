if (!window.jQuery) {
    Defaceit.load.js('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
}
Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/defaceit.css');
Defaceit.load.css('http://defaceit.ru/defaceit/babycalc/css/babycalc.css');


 calc_action = function(){
		var $ = jQuery;

                location.hash='#none';

                var weight = parseFloat($('#weight').val()) || 0;
                var height = parseFloat($('#height').val()) || 0;
                var sex = $('.large_radio_group .active').html() == 'Девочка' ? 2 : 1;
                var age = parseInt($('.small_radio_group .active').html());

                var text = "<div class='calc_line'><br /><br /> <br /> <br /><p>Задачу понял! Думаю...</p><br /><br /> <br /> <br /></div>";
                $('#calc').html(text);


                var request = new Defaceit.CrossDomainRequest("http://services.defaceit.ru/babies");
                request.add("baby[sex]", sex);
                request.add("baby[age]", age);
                request.add("baby[weight_delta]", weight);
                request.add("baby[height_delta]", height);


                request.request(function(data){
            		var d=data.replace(/#/g,'').split('&');
            		var old_form = $('.calc_form').html();

                        var message_w = '';
                        grow_factor_w = weight/parseFloat(d[0]);
                        switch(true) {
                          case grow_factor_w > 1.5: message_w="<p><span style='font-style:italic;'>Вот это да! Вы отлично набрали за последний месяц.</span></p>"; break;
                          case grow_factor_w > 1: message_w="<p><span style='font-style:italic;'>Хороший результат, Ваш ребенок набрал даже больше среднего.</span></p>"; break;
                          case grow_factor_w > 0.7: message_w="<p><span style='font-style:italic;'>Вы набрали чуть меньше среднего, но это не страшно. Нужно смотреть среднее значение по нескольким месяцам.</span></p>"; break;
                          case grow_factor_w < 0.5: message_w = "<p><span style='font-style:italic;'>Вы набрали очень мало, волноваться не стоит, но желательно обратиться к врачу.</span></p>"; break;
                          case grow_factor_w < 0.7: message_w="<p><span style='font-style:italic;'>Ваш ребенок набрал не очень много, но волноваться преждевременно! Обязательно обратитесь к врачу.</span></p>"; break;
                        }

                        var message_h = '';
                        grow_factor_h = height/parseFloat(d[1]);
                        switch(true) {
                          case grow_factor_h > 1.3: message_h="<p><span style='font-style:italic;'>Ого! Ваш ребенок отлично подрос.</span></p>"; break;
                          case grow_factor_h > 1: message_h="<p><span style='font-style:italic;'>Отметим, что ребенок хорошо подрос в этом месяце.</span></p>"; break;
                          case grow_factor_h < 0.7: message_h="<p><span style='font-style:italic;'>Ваш ребенок вырос совсем немного. Но кто сказал, что все должны быть высокими?</span></p>"; break;
                          case grow_factor_h < 1: message_h = "<p><span style='font-style:italic;'>У Вас не самая большая прибавка в росте, но Вы еще все наверстаете.</span></p>"; break;
                        }

                                        var text = "<div class='calc_line'>" + message_w + "<p>В среднем дети набирают <b>"+d[0]+"</b> грамм в этом возрасте.</p>"+message_h+"<p>Обычно дети вырастают на <b>"+d[1]+"</b> см. в этом возрасте.<br /><br /></p><p><a href='http://www.babywonder.ru/blog/mothertips/85.html'>Что делать если малыш плохо набирает в весе</a></p></div>";
                                        $('#calc').html(text);
                                        this.button_handler.remove();
                                        this.apply_buttons([{'text':'Закрыть', handler: function(){this.wnd_handler.remove();}}]);

                                        $('#calc_reset').click(function(){$('.calc_form').html(old_form);$("#calc_result").click(calc_action);});
            		}, this);
	         return false;
         }


/**main function */
babycalc = function() {
var $ = jQuery;

/**load template*/
Defaceit.Queue('calc.babywonder.ru').client({queue_message: 
    function(message) {
	    Defaceit.Window.Manager.create('Simple', {
		content: message,
		buttons: [{text: "Расчитать", handler: calc_action}, {text: "Закрыть", handler: function(){this.wnd_handler.remove();}}],
		geometry:['width:750', 'center', 'show']
	    });
	    
	function deactive(group_name) {
	    jQuery(group_name + ' .button').each(function(i, b){jQuery(b).removeClass('active');});
	}

	function activate(group_name) {
	    jQuery(group_name + ' .button').each(
		function(i, b){
	    	    var el = jQuery(b);
		    el.click(function(){deactive(group_name); el.addClass('active');});
	});
}
    activate('.large_radio_group');
    activate('.small_radio_group');    
    }
});

Defaceit.Queue('calc.babywonder.ru').list();
}


Defaceit.load.image('http://babywonder.ru/templates/skin/diggstreet/images/radio_button.png');
Defaceit.load.image('http://babywonder.ru/templates/skin/diggstreet/images/small_radio_button.png');
Defaceit.load.image('http://babywonder.ru/templates/skin/diggstreet/images/calc_bg.png');


if (/defaceit.ru/.test(document.location)) {
    Defaceit.wait("jQuery", babycalc, this, ["jQuery"]);
}



