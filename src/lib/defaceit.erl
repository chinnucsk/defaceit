-module(defaceit).
-compile(export_all).

get_scripts(AppName, IsOwner) ->
	boss_db:find(widget, [{app, AppName}, {owner, IsOwner}]).

get_owner_script_for(AppName) ->
        get_scripts(AppName, 1).

get_referent_script_for(AppName) ->
	get_scripts(AppName, 0).


is_owner_candidate(AppName) ->
        case get_owner_script_for(AppName) of
                [] -> 1;
                [_] -> 0
        end.

get_active_referent_script_for([], Url) ->
	"";
get_active_referent_script_for([Referent|T], Url) ->
	case get_host_from_url(Referent:url()) == get_host_from_url(Url) of
		true ->
			Referent;
		false ->
			get_active_referent_script_for(T, Url)
	end.

get_host_from_url(undefined) ->
	empty;
get_host_from_url(Url) ->
	 case re:run(Url,"http:\/\/([^/]*)", [{capture,[1], list}]) of
	 	{match, [[]]} ->
			empty;
		{match, Host} ->
			Host;
		nomatch ->
			get_host_from_url(without_http, Url);
		_ ->
			empty
	end.

get_host_from_url(without_http, Url) ->
	case re:run(Url, "([^/]*)", [{capture, [1], list}]) of
		{match, [[]]} ->
			empty;
		{match, Host} ->
			Host;
		nomatch ->
			get_host_from_url(without_slashes, Url)
		end;
get_host_from_url(without_slashes, Url) ->
		Url.