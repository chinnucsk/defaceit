-module(edefaceit_page_controller, [Req]).
-compile(export_all).



content(Get, [Title]) ->
    case boss_db:find(page, [title, 'equals', Title]) of
	[] ->
	    {redirect, "/page/create/" ++ Title};
	Messages ->
	    {ok, [{messages, Messages}]}
end.


create(Get, [Title]) ->
    {ok, [{title, Title}]}.


save(Post, []) ->
	Content = Req:post_param("content"),
	Url = Req:post_param("url"),
	Site = Req:post_param("site"),
	Title = Req:post_param("title"),
	drop_by(Url),
	NewPage = page:new(id, Title, Content, Site, Url),
	{ok, Saved} = NewPage:save(),
	{redirect, "/page/content/" ++ Url}.


drop_by(Url) ->
    case boss_db:find(page, [url, 'equals', Url]) of
	[] ->
          {ok, "nothing to do"};
        [Message] ->
    	    boss_db:delete(Message:id())
    end.


list(Get, [Site]) ->
case boss_db:find(page, [site, 'equals', Site]) of
	[] ->
	    {output, "Empty list"};	
	Articles ->
	    {ok, [{articles, Articles}]}
end.
    