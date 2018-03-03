#!/bin/ash
set -ex

cd /ouc
/usr/bin/supervisord -n -c /etc/supervisord.conf
