if (!window.jQuery) {
    Defaceit.load.js('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js');
}

queue = function() {

        var messages = "";
        var queueName = /\/queue\/(.*)$/.exec(document.location);
        queueName = queueName[1] || "default";
        
        Defaceit.Queue(queueName).client({
            queue_message: function(message){
                $("#messages").append($("<xmp>").css({'font-size':'12px', 'line-height': '12px', 'background-color': 'lightgoldenrodyellow', 'padding':'15px', 'border':'1px solid palegoldenrod',  'box-shadow': '0 0 16px -16px #000000 inset'}).html(message));
            },
            queue_status: function(message) {
                Defaceit.Queue(queueName).top();
            }
        });
        Defaceit.Queue(queueName).list();
        
        Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/tools/css/defaceit.css');
        
        Defaceit.Window.Manager.create('Simple', {
            content: $("<div>").attr('id', 'messages'),
            title: "очередь: " + queueName,
            geometry: ['fit_to_screen', 'top', 'left','show'],
            buttons: [{text:'Добавить', handler: function() {
                    Defaceit.Window.Manager.create('InputBox', { 
                        geometry: ['width:400', 'center', 'show'],
                        handler: function() {Defaceit.Queue(queueName).push(this.message()); this.hide();}
                    });
                
                }}]
            });
 }
 
 
 Defaceit.wait("jQuery", queue, this, ["jQuery"]);