#! /bin/bash

PWD=`pwd`
NODE_LOG_DIR="$PWD/log"
if [ ! -d "$NODE_LOG_DIR" ]; then
    mkdir $NODE_LOG_DIR
fi

NCMD="forever start"
NCMD="$NCMD -a"
NCMD="$NCMD -l $NODE_LOG_DIR/forever.log"
NCMD="$NCMD -o $NODE_LOG_DIR/out.log"
NCMD="$NCMD -e $NODE_LOG_DIR/err.log"
NCMD="$NCMD bcms_docpad_app.js run"

$NCMD
