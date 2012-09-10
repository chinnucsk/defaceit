#!/bin/bash

IFS=$'\n'       # make newlines the only separator
set -f          # disable globbing

for i in $(cat item.txt); do
    curl -F "message_text=$i" http://eservices.defaceit.ru/queue/push/items.bookshelf.defaceit.ru/2
done

for i in $(cat template.txt); do
    curl -F "message_text=$i" http://eservices.defaceit.ru/queue/push/template.bookshelf.defaceit.ru/2
done



    
