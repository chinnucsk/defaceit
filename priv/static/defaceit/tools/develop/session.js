

Defaceit.Session = function(url) {
    this.resource = url;

}

Defaceit.Session.prototype = {
  sign_in: false,


  check_status: function(callback) {
    this.sign_in = true;
    var condition = function(response){
        if (response.data.key == null) {
          this.sign_in = false;
          
        }
        this.data = response.data;
        callback.call(this);
      }
    request(this.resource+'/show', condition, this);
   
  },

  signed_in: function() {
    return this.key ? true : false;
  }
}

