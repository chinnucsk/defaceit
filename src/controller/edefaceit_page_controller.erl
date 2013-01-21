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
    {ok, [{title, Title}, {'pageName', "{{pageName}}"}]}.


save(Post, []) ->
	Content = Req:post_param("content"),
	
	case re:run(Content,"<title>(.*)<\/title>", [{capture,[1], list}]) of
	 	{match, [[]]} ->
			Name = "";
		{match, PageName} ->
			Name = PageName;
		nomatch ->
			Name = "";
		_ ->
			Name = ""
	end,

	Url = Req:post_param("url"),
	Site = Req:post_param("site"),
	Title = Req:post_param("title"),
	Type = Req:post_param("type"),
	ContentScript = re:replace(Content, "<!--DefaultValues-->", "<script>" ++ v("Defaceit.Page.type", Type) ++ v("Defaceit.Page.name", Title) ++ v("Defaceit.Page.namespace", Site)++ v("url", Url) ++ "</script>", [global, {return, list}]),
	drop_by(Url),
	NewPage = page:new(id, Title, ContentScript, Site, Url, Name),
	{ok, Saved} = NewPage:save(),
	{redirect, Url}.
v(N,V) ->
	N ++ " = '" ++ V ++ "';".

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
    