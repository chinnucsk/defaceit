#!/bin/bash

JS_DEF_DIR=/home/sal/development/edefaceit/priv/static/defaceit
JS_DEF_PROJECT_DIR=$JS_DEF_DIR/queue

java -jar /home/sal/app/closure/compiler.jar --js \
$JS_DEF_DIR/tools.js \
$JS_DEF_PROJECT_DIR/develop/queue.js \
--js_output_file $JS_DEF_PROJECT_DIR/queue.js
