Defaceit.CrossDomainRequest = function(url) {
    this.url = url;
    this.create_iframe();
    this.create_form(url);
}


Defaceit.CrossDomainRequest.prototype = {
  
    create_iframe: function() {
        if (document.getElementById('coaframe')) {
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
    
        var form = document.getElementById('coaform');
    
        if (form) {
            while (form.firstChild) {
                form.removeChild(form.firstChild);
            }
            this.form = form;
            return;
        }else{
                form = this.form = document.createElement("form")       
        }
    
        
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
  
    request: function(callback, scope) {
        this.form.submit();
        var intervalId = setInterval(checkForMessages, 200);
        function checkForMessages(){
          
          if (location.hash!='' && location.hash!='#none') {
            callback.call(scope, location.hash);
            location.hash='none';
            clearInterval(intervalId);
          }
        }
    }
}

