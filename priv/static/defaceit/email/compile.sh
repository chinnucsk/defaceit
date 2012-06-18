#!/bin/bash

tr -d '\r\n' < ../../css/ext-all.css > temp.css
sed -i 's/^M//g' temp.css
sed -i "s/'/\\\\'/g" temp.css
sed -i 's/"/\\"/g' temp.css



echo "\$('<style>" > 1.js
cat temp.css >> 1.js
echo "</style>').appendTo('head');" >> 1.js
tr -d '\n' < 1.js > ./develop/css.js

rm 1.js
rm temp.css

java -jar /vagrant/compiler.jar --js /vagrant/development/edefaceit/priv/static/defaceit/tools.js /vagrant/development/edefaceit/priv/static/js/ext-base.js /vagrant/development/edefaceit/priv/static/js/ext-all.js /vagrant/development/edefaceit/priv/static/defaceit/email/develop/email.js --js_output_file /vagrant/development/edefaceit/priv/static/defaceit/email/email.js