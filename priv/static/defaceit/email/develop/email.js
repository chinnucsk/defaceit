Defaceit.load.css('http://defaceit.ru/css/ext-all.css');



Ext.onReady(function(){

    hash =/\/email\/([0-9abcdef]{32})$/.exec(document.location);

    if (hash) {
        var send_message_form = create_send_message_form();
        var send_message_window = create_send_message_window(send_message_form);
        send_message_form.getForm().setValues({
            email_hash: hash[1]
        });
        
        send_message_window.show();
    }else{
        var form = create_email_form();
        var send_message_form = create_send_message_form();
        var send_message_window = create_send_message_window(send_message_form);
        var window = create_email_window(form, send_message_window, send_message_form);
        window.show();
    }

});


function create_email_form() {
    return new Ext.form.FormPanel({
        baseCls: 'x-plain',
        labelWidth: 55,
        defaultType: 'textfield',
        items: [{
            xtype: 'component',
            html: 'Для того чтобы воспользоваться сервисом отправки почтовых сообщений ' +
            'укажите ваш электронный почтовый адрес.',
            style: 'margin-bottom: 20px;'
        },{
            fieldLabel: 'Email',
            name: 'email',
            id: 'email',
            anchor:'100%'
        }]
    });
}


function create_link_form(hash) {
    return new Ext.form.FormPanel({
        baseCls: 'x-plain',
        defaultType: 'textfield',
        items: [{
            xtype: 'component',
            html: 'Для того чтобы перейти на вашу форму обратной связи используйте данную ссылку',
            style: 'margin-bottom: 20px;'
        },{
            xtype: 'textarea',
            hideLabel: true,
            name: 'email_link',
            id: 'email_link',
            anchor:'100%',
            value: '<a href="http://defaceit.ru/email/'+hash+'">Обратная связь</a>'
        }]
    });

}

function create_link_window(hash) {
    return new Ext.Window({
        title: 'Ссылка на вашу форму обратной связи',
        width: 500,
        height:150,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        bodyStyle:'padding:5px;',
        buttonAlign:'center',
        items: create_link_form(hash)
    });
}

function create_send_message_form() {
    return new Ext.form.FormPanel({
        baseCls: 'x-plain',
        labelWidth: 85,
        url:'http://services.defaceit.ru/email/send_message',
        defaultType: 'textfield',
        errorReader: {
            read: function(response) {
                Ext.MessageBox.alert('Подтверждение', 'Ваше сообщение успешно отправлено. Сейчас вы будете возвращены на предыдущую страницу.');
                document.location = document.referrer;
            }
        },
        items: [{
            xtype: 'hidden',
            name: 'email_hash',
            id: 'email_hash',
            anchor:'100%'  // anchor width by percentage
        },
        {
            fieldLabel: 'От (email)',
            name: 'from',
            id: 'from',
            anchor:'100%'  // anchor width by percentage
        },
        {
            fieldLabel: 'Тема',
            name: 'title',
            id: 'title',
            anchor:'100%'  // anchor width by percentage
        }, {
            xtype: 'textarea',
            hideLabel: true,
            name: 'message',
            id: 'message',
            anchor:'100% 100%'  // anchor width by percentage
        }]
    });
}


function create_email_window(form, send_message_window, send_message_form) {
    return new Ext.Window({
        title: 'Добавить почтовый адрес',
        width: 500,
        height:150,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        bodyStyle:'padding:5px;',
        buttonAlign:'center',
        items: form,

        buttons: [{
            text: 'Отправить тестовое сообщение',
            handler: function() {
                form_fields = form.getForm().getValues();
                //for(key in form_fields) {
//                    sender.add(key, form_fields[key]);
  //              }
//                sender.request();
                 var success = function(response){
                        send_message_form.getForm().setValues({
                            email_hash: response.email.email_hash
                        });
                        this.hide();
                        send_message_window.show();
                   }
                   
                Snappy.data.JSONP.register('uniqkey', success, this)
                Snappy.data.JSONP.request("http://services.defaceit.ru/email/email_add?key=uniqkey&email=" + form_fields['email'])
                /*Ext.Ajax.request({
                    url: '/service/mail/email_add',
                    params: form.getForm().getValues(),
                    success: function(response){
                        v =/<email-hash>(.*)<\/email-hash>/.exec(response.responseText);
                        send_message_form.getForm().setValues({
                            email_hash:v[1]
                        });

                        this.hide();
                        send_message_window.show();
                    },
                    failure: function(){
                        alert('faild')
                    },
                    scope: this,
                    waitMsg:'Публикую сообщение...'
                });*/
            }
        },
        {
            text: "Получить ссылку на форму обратной связи",
            handler: function() {
                //sender = new Snappy.data.IFrameProxy("http://services.defaceit.ru:3000/email/email_add");
                form_fields = form.getForm().getValues();
                //for(key in form_fields) {
//                    sender.add(key, form_fields[key]);
  //              }
//                sender.request();
                 var success = function(response){
                        this.hide();
                        create_link_window(response.email.email_hash).show();
                   }
                   
                Snappy.data.JSONP.register('uniqkey', success, this)
                Snappy.data.JSONP.request("http://services.defaceit.ru/email/email_add?key=uniqkey&email=" + form_fields['email'])
                /*Ext.Ajax.request({
                    url: 'http://services.defaceit.ru/email/email_add?email=sal1982@list.ru',
                    params: form.getForm().getValues(),
                    success: function(response){
                        v =/<email-hash>(.*)<\/email-hash>/.exec(response.responseText);
                        send_message_form.getForm().setValues({
                            email_hash:v[1]
                        });

                        this.hide();
                        create_link_window(v[1]).show();
                    },
                    failure: function(){
                        alert('faild')
                    },
                    scope: this,
                    waitMsg:'Публикую сообщение...'
                });*/
            }

        }]
    });
}

function create_send_message_window(send_message_form) {
    return new Ext.Window({
        title: 'Отправка сообщения',
        width: 500,
        height: 300,
        layout: 'fit',
        plain:true,
        bodyStyle:'padding:5px;',
        buttonAlign:'center',
        items: send_message_form,
        buttons: [{
            text: 'Отправить',
            handler: function() {
                sender = new Snappy.data.IFrameProxy("http://services.defaceit.ru/email/send_message");
                form_fields = send_message_form.getForm().getValues();
                for(key in form_fields) {
                    sender.add(key, form_fields[key]);
                }
                
                var check_send_result = function() {
		  
		  
		  switch(document.location.hash){
		    case '#status=ok': 
		      alert('Сообщение успешно отправлено');
		      document.location = document.referrer
		    break;
		  
		    case '#status=error':
		      alert('Во время отправки сообщения произошла ошибка. Попробуйте позже.');
		      document.location = document.referrer;
		    break;
		    
		    default: 
		      setTimeout(check_send_result, 200);
		  }
		}
		setTimeout(check_send_result, 200);
		
		sender.request();
                //send_message_form.getForm().submit();
            },
            scope: this
        }]
    });
}





//TODO: you must remove it in separate file later
Snappy = {};
Snappy.data = {};

Snappy.data.IFrameProxy = function(url) {
    this.url = url;
    this.create_iframe();
    this.create_form(url);
}

Snappy.data.IFrameProxy.prototype = {
	
    create_iframe: function() {
        if (Ext.get('coaframe')) {
            return;
        }
		
        var iframe = document.createElement("iframe");
        iframe.name = "coaframe";
		
        iframe.style.visibility = "hidden";
        iframe.style.position = "absolute";
        iframe.style.left = iframe.style.top = "0px";
        iframe.height = width = "1px";

        iframe.id = 'coaframe';
        var h = document.getElementsByTagName("body")[0]
        h.appendChild(iframe);
    },
	
    create_form: function(url) {
		
        var form = Ext.get('coaform');
		
        if (form) {
            while (form.dom.firstChild) {
                form.dom.removeChild(form.dom.firstChild);
            }
            this.form = form.dom;
            return;
        }
		
        form = this.form = document.createElement("form")
        form.style.display = "none"
        form.id = "coaform";
        form.enctype = "multipart/form-data"
        form.method = "POST"
        form.action = url;
        form.target = 'coaframe';
        form.setAttribute("target", 'coaframe');
        document.body.appendChild(form);	
    },
	
    add: function(name, value) {
        var element = document.createElement('input');
        element.type="hidden";
        element.name=name;
        element.value=value;
        this.form.appendChild(element);
    },
	
    request: function() {
        this.form.submit();
    }
}
Snappy.data.JSONP = {
    callbacks: { 
        undefined: {callback: function(){alert('You should return uniq "key" in your data response!!!');}, scope: this},
        'null': {callback: function(){alert('You should return uniq "key" in your data response!!!');}, scope: this}
    },
    request: function (url) {
    var script = document.createElement("script");
        script.src = url;
        var h = document.getElementsByTagName("body")[0]
        h.appendChild(script);
     },

    register: function(key, callback, scope) {
        Snappy.data.JSONP.callbacks[key] = {callback: callback, scope: scope}
    }

}

function defaceit_callback(data) {
    func = Snappy.data.JSONP.callbacks[data.key];
    func.callback.call(func.scope, data);
}