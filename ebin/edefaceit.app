{application,edefaceit,
    [{description,"Defaceit application for chnageable interfaces"},
     {vsn,"0.0.1"},
     {modules,
<<<<<<< HEAD
         [defaceit,edefaceit_incoming_mail_controller,
          edefaceit_outgoing_mail_controller,edefaceit_app_controller,
          edefaceit_page_controller,edefaceit_hello_controller,
          edefaceit_main_controller,page,widget,edefaceit_view_lib_tags,
          edefaceit_custom_filters,edefaceit_custom_tags,
          edefaceit_view_main_index_html,edefaceit_view_app_edit_html,
          edefaceit_view_page_list_html,edefaceit_view_page_content_html,
          edefaceit_view_page_create_html,edefaceit_view_hello_lost_html]},
=======
         [defaceit,uri,edefaceit_incoming_mail_controller,
          edefaceit_outgoing_mail_controller,edefaceit_app_controller,
          edefaceit_hello_controller,edefaceit_main_controller,
          edefaceit_page_controller,page,widget,edefaceit_view_lib_tags,
          edefaceit_custom_filters,edefaceit_custom_tags,
          edefaceit_view_app_edit_html,edefaceit_view_hello_lost_html,
          edefaceit_view_main_index_html,edefaceit_view_page_content_html,
          edefaceit_view_page_create_html,edefaceit_view_page_list_html]},
>>>>>>> 2d6d6d1ff479fe9a59874fc7c52c198548a6c92c
     {registered,[]},
     {applications,[kernel,stdlib,crypto,boss]},
     {env,
         [{test_modules,[]},
          {lib_modules,[defaceit,uri]},
          {mail_modules,
              [edefaceit_incoming_mail_controller,
               edefaceit_outgoing_mail_controller]},
          {controller_modules,
<<<<<<< HEAD
              [edefaceit_app_controller,edefaceit_page_controller,
               edefaceit_hello_controller,edefaceit_main_controller]},
=======
              [edefaceit_app_controller,edefaceit_hello_controller,
               edefaceit_main_controller,edefaceit_page_controller]},
>>>>>>> 2d6d6d1ff479fe9a59874fc7c52c198548a6c92c
          {model_modules,[page,widget]},
          {view_lib_tags_modules,[edefaceit_view_lib_tags]},
          {view_lib_helper_modules,
              [edefaceit_custom_filters,edefaceit_custom_tags]},
          {view_modules,
<<<<<<< HEAD
              [edefaceit_view_main_index_html,edefaceit_view_app_edit_html,
               edefaceit_view_page_list_html,edefaceit_view_page_content_html,
               edefaceit_view_page_create_html,
               edefaceit_view_hello_lost_html]}]}]}.
=======
              [edefaceit_view_app_edit_html,edefaceit_view_hello_lost_html,
               edefaceit_view_main_index_html,
               edefaceit_view_page_content_html,
               edefaceit_view_page_create_html,
               edefaceit_view_page_list_html]}]}]}.
>>>>>>> 2d6d6d1ff479fe9a59874fc7c52c198548a6c92c
