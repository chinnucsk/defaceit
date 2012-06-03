


Ext.onReady(function(){

    var currentAction = '';
    var categories = [
            [[12, 'Общие вопросы HTML'], [11, 'Верстка'], [13, 'CSS'], [6, 'Общие вопросы по JavaScript'],[4, 'AJAX'],[5, 'Вопросы по популярным фреймовркам JS'], [9, 'Общие вопросы PHP'],[8, 'Фреймворки PHP']],
            [[4, 'Этажи красноярского края'],[5, 'Соседи']],
            [['Моя жизнь', 'Моя жизнь']],
            [['Вопрос/Ответ', 'Вопрос/Ответ'],['Главная', 'Главная'],['Идеи', 'Идеи'], ['Обзоры', 'Обзоры'], ['Статьи', 'Статьи']],
            [['jQuery', 'jQuery'],['ExtJS', 'ExtJS'], ['Dojo', 'Dojo'], ['Prototype', 'Prototype'], ['JavaScript', 'JavaScript']],
            [['Основы HTML', 'Основы HTML'], ['Примеры верстки', 'Примеры верстки'], ['HTML Теги', 'HTML Теги'], ['Рецепты HTML', 'Рецепты HTML'], ['Сайт своими руками', 'Сайт своими руками']]
    ];

    var users = [
        [
            ['greenfox', 'greenfox', 'greenfox'],
            ['paramon', 'paramon', 'paramon'],
            ['zetta0', 'zetta0', 'zetta0'],
            ['veronika', 'veronika', 'veronika'],
            ['beconz', 'beconz', 'beconz']
        ],
        [[ 'fact0rial', 'fact0rial', 'esergeev']],
        [['root', 'root', '280f3f']],
        [['admin', 'admin', '280f3f']],
        [['admin', 'admin', 'ki3q03n1'], ['OZZ', 'ozz', 'lhfqdth']],
        [['admin', 'admin', 'ki3q03n1']]
    ]


    var combo = new Ext.form.ComboBox({
        hiddenName:'fid',
        fieldLabel: 'Категории',
        name: 'fid',
        anchor:'95%',
        triggerAction: 'all',
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['myId','displayText']
        }),
        valueField: 'myId',
        displayField: 'displayText'
    });

    var user = new Ext.form.ComboBox({
        fieldLabel: 'Пользователи',
        hiddenName:'username',
        anchor:'95%',
        triggerAction: 'all',
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['myId','displayText', 'password'],
            data: [['fact0rial', 'Fact0rial', 'esergeev']]
        }),
        valueField: 'myId',
        displayField: 'displayText',
        listeners:{
            //scope: yourScope,
            'select': function(a,b,i){
                top.getForm().setValues({
                        password:b.data.password
                    });
            }
        }

    });


    var forums = new Ext.form.ComboBox({
        fieldLabel: 'Сайты',
        hiddenName:'furl',
        anchor:'95%',
        triggerAction: 'all',
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['myId','displayText', 'action'],
            data: [
                        ['http://www.pragmaticweb.ru', 'PragmaticWeb', '/phpbb_publish.cgi'],
                        ['http://www.etagi24.ru', 'Этажи', '/phpbb_publish.cgi'],
                        ['esergeev.ru', 'Блог Жени Сергеева', '/wp_publish.cgi'],
                        ['www.codeart.ru', 'CodeArt', '/wp_publish.cgi'],
                        ['www.ajaxtips.ru', 'AjaxTips', '/ls_publish.cgi'],
                        ['www.htmltips.ru', 'HTMLTips', '/ls_publish.cgi']
                  ]
        }),
        valueField: 'myId',
        displayField: 'displayText',
        listeners:{
            //scope: yourScope,
            'select': function(a,b,i){
                combo.clearValue();
                combo.store.loadData(categories[i]);
                user.clearValue();
                user.store.loadData(users[i]);
                currentAction = b.data.action
            }
        }

    });

  
    var top = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        title: 'Добавление топика в форум',
        bodyStyle:'padding:5px 5px 0',
        width: 600, 
        reader : new Ext.data.XmlReader({
            record : 'post',
            success: '@success'
        }, ['postid', 'title']
	  
        ),
        errorReader: new Ext.form.XmlErrorReader(),
	
        items: [ forums, combo, user,
        {
            xtype:'textfield',
            fieldLabel: 'Пароль:',
            name: 'password',
            anchor:'95%'
        },
        {

            xtype:'textfield',
            fieldLabel: 'Тема:',
            name: 'title',
            anchor:'95%'
        },{
            xtype:'textfield',
            fieldLabel: 'Номер поста:',
            name: 'postid',
            anchor:'95%'
        },{
            xtype:'htmleditor',
            id:'message',
            fieldLabel:'Сообщение',
            height:200,
            anchor:'98%'
        }],

        buttons: [{
            text: 'Отправить сообщение',
            handler: function() {
                if (!currentAction) {
                    alert('Не выбран Блог');
                    return;
                }
                top.getForm().submit({
                    success:function(form, result){
                        v =/<postid>(.*)<\/postid>/.exec(result.response.responseText);
                        form.setValues({
                            postid:v[1]
                            });
                    },
                    //url:'/phpbb_publish.cgi',
                    url:currentAction,
                    waitMsg:'Публикую сообщение...'
                })
                }
        }]
    });
    
    top.render(document.body);
    
    
    
});

Ext.form.XmlErrorReader = function(){
    Ext.form.XmlErrorReader.superclass.constructor.call(this, {
        record : 'field',
        success: '@success'
    }, [
    'id', 'msg'
    ]
    );
};
Ext.extend(Ext.form.XmlErrorReader, Ext.data.XmlReader);