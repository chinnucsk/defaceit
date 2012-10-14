Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/tools/css/home.css');
    

pages = {
    'error': function(){alert('Мы не смогли загрузить дефолтный шаблон');},
    'load_default_template': function(){ Defaceit.Queue('default.template.defaceit.ru').last();},
    'parse': function(template){
	var words=template.match(/(\{\{[^}]*\}\})/g);
	for(var i=0, r=template; i < words.length; i++){
	    var newValue = prompt();
	    r = r.replace(new RegExp(words[i],'g'), newValue);
	}
	this.save(r);  
    },
    'save': function(r) {
	alert(r);
    }

}



function run(){
q('template.babywonder.ru', pages)
    .on('empty', 'load_default_template')
    .on('message', 'parse');


q('default.template.defaceit.ru', pages)
    .on('empty', 'error')
    .on('message', 'parse');



Defaceit.Queue('template.babywonder.ru').last();
}