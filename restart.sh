#! /bin/bash

PWD=`pwd`
NODE_LOG_DIR="$PWD/log"
if [ ! -d "$NODE_LOG_DIR" ]; then
    mkdir $NODE_LOG_DIR
fi

NCMD="forever restart"
NCMD="$NCMD bcms_docpad_app.js"

$NCMD
