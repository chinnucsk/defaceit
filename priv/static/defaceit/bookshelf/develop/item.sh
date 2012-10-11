#!/bin/bash

IFS=$'\n'       # make newlines the only separator
set -f          # disable globbing

for i in $(cat item.txt); do
    curl -F "message_text=$i" http://eservices.sandbox.defaceit.ru/queue/push/items.bookshelf.sandbox.defaceit.ru/2
done

for i in $(cat template.txt); do
    curl -F "message_text=$i" http://eservices.sandbox.defaceit.ru/queue/push/template.bookshelf.sandbox.defaceit.ru/2
done



    
