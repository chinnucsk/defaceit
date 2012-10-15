#!/bin/bash

IFS=$'\n'       # make newlines the only separator
set -f          # disable globbing

for i in $(cat templates.txt); do
    curl -F "message_text=$i" http://eservices.sandbox.defaceit.ru/queue/push/default.template.defaceit.ru/2
done




    
