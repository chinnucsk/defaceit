


if (window.urls.length > 0) {
  $.each(window.urls, function(i,url) {
  var host_name = url.split( '/' )[2],
      deface_id = "deface"+i,
      menu_item = $("<li>"),
      url_link = menu_item.append($("<a>").attr('id',deface_id).attr("href", "#").click(function(){$("#defaces-list").removeClass("open"); menu_item.addClass("active");Defaceit.load.js(url); return false;}).html(host_name));
  $('#defaces').prepend(url_link);
  });
}


user = new Defaceit.Session('http://services.defaceit.ru/sessions');
user.check_status(function(){
    $('#login_name').html(this.sign_in ? this.data.key.split('/')[3] : "Yandex OpenID");
    $('#login').html(this.sign_in ?'<a href="http://services.defaceit.ru/sessions/destroy">Выйти</a>':'<a href="http://services.defaceit.ru/sessions/new">Войти</a>');
});
