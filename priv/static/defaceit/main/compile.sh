#!/bin/bash

JS_DEF_DIR=/vagrant/development/edefaceit/priv/static/defaceit
JS_DEF_PROJECT_DIR=$JS_DEF_DIR/main

java -jar /vagrant/compiler.jar --js \
$JS_DEF_DIR/tools.js \
$JS_DEF_PROJECT_DIR/develop/main.js \
--js_output_file $JS_DEF_PROJECT_DIR/main.js