#!/bin/bash

if [ -e build ]
then
    echo 'Build directory already exists. Stop.'
    exit
fi
mkdir build

read -p 'Include moderator-only userscripts? [yn] ' -n 1 -r
echo

if [[ $REPLY =~ ^[Yy] ]]
then
    cp mod/*/*.user.js build
fi

cp nonmod/*/*.user.js build
