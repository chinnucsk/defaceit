-module(edefaceit_page_controller, [Req]).
-compile(export_all).



content(Get, [Url]) ->
    case boss_db:find(page, [url, 'equals', Url]) of
	[] ->
	    {redirect, "/page/create/" ++ Url};
	Messages ->
	    {ok, [{messages, Messages}]}
end.


create(Get, [Url]) ->
    {ok, [{url, Url}]}.


save(Post, []) ->
	Content = Req:post_param("content"),
	Url = Req:post_param("url"),
	drop(Url),
	NewPage = page:new(id, Url, Content),
	{ok, Saved} = NewPage:save(),
	{redirect, "/page/content/" ++ Url}.


drop(Url) ->
    case boss_db:find(page, [url, 'equals', Url]) of
	[] ->
          {ok, "nothing to do"};
        [Message] ->
    	    boss_db:delete(Message:id())
    end.
    