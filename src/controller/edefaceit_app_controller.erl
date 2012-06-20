-module(edefaceit_app_controller, [Req]).
-compile(export_all).



edit(GET, []) ->
	{output, "Please, specify application"};
edit(GET, [App]) ->
	{ok, [{app_name, App}]}.

add(POST, []) ->
	Referer = "http://" ++ defaceit:get_host_from_url(Req:post_param("url")) ++ "/defaceit/" ++ Req:post_param("app") ++ "/" ++ Req:post_param("app") ++ ".js",
	AppName = Req:post_param("app"),
	Owner = defaceit:is_owner_candidate(AppName),

	App = widget:new(id, AppName, Referer, Owner),
	{ok, Saved} = App:save(),
	
	%Save data to file because used memory DB, when defaceit restarted it shoul be run!
	Data = [AppName, Referer],
	file:write_file("/home/sal/log/app_list.sh", io_lib:fwrite("wget -q --post-data 'app=~s&url=~s' http://sandbox.defaceit.ru/app/add -O /dev/null~n", [AppName, Referer]), [append]),

	{redirect, "/" ++ AppName}.

list(GET, []) ->
	All = boss_db:find(widget, []),
	{json, All};
list(GET, [App]) ->
	All = boss_db:find(widget, [{app, App}]),
	{json, All}.
