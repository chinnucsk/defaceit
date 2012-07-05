#!/bin/bash

JS_DEF_DIR=/vagrant/development/edefaceit/priv/static/defaceit
JS_DEF_PROJECT_DIR=$JS_DEF_DIR/baloon

java -jar /vagrant/compiler.jar --js \
$JS_DEF_DIR/tools.js \
$JS_DEF_DIR/plugin/salut.js \
$JS_DEF_PROJECT_DIR/develop/baloon.js \
--js_output_file $JS_DEF_PROJECT_DIR/baloon.js
