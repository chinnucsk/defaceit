Defaceit.Queue = function(queue) {
    if (this==Defaceit) {
	queue = queue || '';
	Defaceit.Queue.list[queue] = Defaceit.Queue.list[queue] || new Defaceit.Queue(queue);
	return Defaceit.Queue.list[queue];
    }
    this.queue = queue;
    return this;
}

Defaceit.Queue.prototype = {
	queue: '',
//        clients: [],
	call_id: 1,
	
	
	next_call_id: function() {
	    return this.call_id++;
	},
	
	list: function() {
	    Defaceit.request('http://eservices.defaceit.ru/queue/list/' + this.queue + '/' + this.next_call_id());
	    return this;
	},
    
	push: function(message, callback) {
	    var cid = this.next_call_id();
	    
	    Defaceit.request('http://eservices.defaceit.ru/queue/push/' + this.queue + '/'  + cid +'/'+ encodeURIComponent(message));
	    return cid;
	},
	
	top: function() {
	    Defaceit.request('http://eservices.defaceit.ru/queue/top/' + this.queue + '/'  + this.next_call_id());
	    return this;
	},
	
	client: function(client) {
	    this.clients = this.clients || [];
	    this.clients.push(client);
	},
	
	client_callback: function(data) {

	    switch(data.type) {
	    
		case 'messages':
		    for(var i = 0; i < data.data.length; i++) this.send_message(data.data[i].message_text, data.data[i]);
		break;
		
		case 'message':
		    this.send_message(data.data.message_text, data.data);
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
	
	send_message: function(message, full_message) {
	
		message = decodeURIComponent(message);
		for(var i = 0; i < this.clients.length; i++) {
		    var client = this.clients[i];
		    client.queue_message && client.queue_message(message, full_message);
		}

	}
}

Defaceit.Queue.list = {};

Defaceit.Queue.callbacks = [];

Defaceit.Queue.response =  function(data) { Defaceit.Queue.list[data.queue_name].client_callback(data); }

