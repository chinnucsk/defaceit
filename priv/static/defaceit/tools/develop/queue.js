
if (!Defaceit.Queue) {
Defaceit.Queue = function(queue) {

    if (this==Defaceit) {
	queue = queue || '';
	Defaceit.Queue.list[queue] = Defaceit.Queue.list[queue] || new Defaceit.Queue(queue);
	return Defaceit.Queue.list[queue];
    }
    
    this.init(queue);
    return this;
}

Defaceit.Queue.prototype = {
	queue: '',
//        clients: [],
	call_id: 1,
	init: function(queue) {
	    this.queue = queue;
	},
	next_call_id: function() {
	    return this.call_id++;
	},
	
	list: function() {
	    this.request('list');
	    return this;
	},
    
	push: function(message, callback) {
	    return this.request('push', encodeURIComponent(message));
	},
	
	top: function() {
	    this.request('top');
	    return this;
	},
	
	last: function() {
	    return this.request('last');
	},
	
	
	request: function(action, message) {
		message = message || '';
		var cid = this.next_call_id();
		
		if (message.length > 1024) {
		    cors_post('http://eservices.defaceit.ru/queue/'+action+'/'+this.queue+'/'+cid, 'message_text='+encodeURIComponent(message));
		}else{
		    Defaceit.request('http://eservices.defaceit.ru/queue/'+action+'/' + this.queue + '/'  + cid + '/' + message);
		}
		
		return cid;
	},
	
	client: function(client) {
	    this.clients = this.clients || [];
	    this.clients.push(client);
	},
	
	client_callback: function(data) {
		data.call_id = parseInt(data.call_id);
	    switch(data.type) {
	    
		case 'messages':
		    for(var i = 0; i < data.data.length; i++) this.send_message(data.data[i].message_text, data.data[i]);
		break;
		
		case 'message':
		    this.send_message(data.data.message_text, data.data, data);
		break;
		
		case 'status': 
		    this.send_status_message(data);
		break;
	    }
	},
	
	send_status_message: function(status) {
	    for(var i = 0; i < this.clients.length; i++) {
		    var client = this.clients[i];
		    client.queue_status && client.queue_status(status);
	    }
	},
	
	send_message: function(message, full_message, raw) {
		message = decodeURIComponent(message);
		for(var i = 0; i < this.clients.length; i++) {
		    var client = this.clients[i];
		    client.queue_message && client.queue_message(message, full_message, raw);
		}

	}
}


Defaceit.Queue.list = Defaceit.Queue.list || {};

Defaceit.Queue.callbacks = Defaceit.Queue.callbacks || [];

Defaceit.Queue.response =  function(data) { Defaceit.Queue.list[data.queue_name].client_callback(data); }
}


/**Experemental**/

actions = {};

fire = function(queue, event, message, o) {

    if (!actions[queue] || !actions[queue][event] || !actions[queue][event][0]) { return; }

    var cb = actions[queue][event][0],
        scope = actions[queue][event][1];

    cb.call(scope, message, o);
}

function q(queue, obj) {

    Defaceit.Queue(queue).client({
        queue_message: function(message, o) {
            fire(queue, 'message', message, o);
        },

        queue_status: function(message) {
            fire(queue, message.result, message, message);
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


function cors_post(url, params) {
	function createCORSRequest(method, url) {
	  var xhr = new XMLHttpRequest();
	    if ("withCredentials" in xhr) {
	        // Check if the XMLHttpRequest object has a "withCredentials" property.
	        // "withCredentials" only exists on XMLHTTPRequest2 objects.
	        xhr.open(method, url, true);
	     } else if (typeof XDomainRequest != "undefined") {
	        // Otherwise, check if XDomainRequest.
	        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	         xhr = new XDomainRequest();
	         xhr.open(method, url);
	     } else {
	        // Otherwise, CORS is not supported by the browser.
	        xhr = null;
	     }
	    return xhr;
	}
	
	var xhr = createCORSRequest('POST', url);
	if (!xhr) {
	     throw new Error('CORS not supported');
	}

	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Content-length", params.length);
	xhr.setRequestHeader("Connection", "close");
                                                      
	xhr.onload = function() {
        	var responseText = xhr.responseText;
        	eval(responseText);
	};
                                                         
	xhr.onerror = function() {
      		console.log('There was an error!');
	};
                                                           
	xhr.send(params);
}

