Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/tools/css/home.css');
    

actions = {};

fire = function(queue, event, message) {

    if (!actions[queue] || !actions[queue][event] || !actions[queue][event][0]) { return; }
    
    var cb = actions[queue][event][0],
	scope = actions[queue][event][1];
    
    cb.call(scope, message);
}

function q(queue, obj) {

    Defaceit.Queue(queue).client({
	queue_message: function(message) {
	    fire(queue, 'message', message);
	},
	
	queue_status: function(message) {
	    fire(queue, message.result);
	}
    });
    
    
    actions[queue] = actions[queue] || {};
    return {
	    on: function(action,method){
		    actions[queue][action] = [obj[method], obj];
		    return this;
	    }
    }
}




pages = {
    'error': function(){alert('Мы не смогли загрузить дефолтный шаблон');},
    'load_default_template': function(){ Defaceit.Queue('default.template.defaceit.ru').last();},
    
    'parse': function(template){
	var words=template.match(/(\{\{[^}]*\}\})/g);
	for(var i=0, r=template; i < words.length; i++){
	    var newValue = prompt();
	    r = r.replace(new RegExp(words[i],'g'), newValue);
	    jQuery('body').html(r);  
	}
	jQuery('body').html(r);  
    },

}


q('template.babywonder.ru', pages)
    .on('empty', 'load_default_template')
    .on('message', 'parse');


q('default.template.defaceit.ru', pages)
    .on('empty', 'error')
    .on('message', 'parse');



Defaceit.Queue('template.babywonder.ru').last();