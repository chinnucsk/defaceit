-module(edefaceit_main_controller, [Req]).
-compile(export_all).


index(Get, []) ->
	[Owner] = defaceit:get_owner_script_for("main"),
	Referent = defaceit:get_referent_script_for("main"),
	ActiveReferent = defaceit:get_active_referent_script_for(Referent,  Req:header(referer)),
	{ok, [{owner, Owner}, {referents, Referent}, {active_referent, ActiveReferent}]}.
	
		