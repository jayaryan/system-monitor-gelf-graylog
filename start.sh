
kill $(ps aux | grep system_monitor_gg | awk '{print $2}') || true

STDOUT_PATH="$HOME/sys_monit_graylog.out"
nohup node start system_monitor_gg  >> $STDOUT_PATH 2>&1&

echo "Daemon logs going to: $STDOUT_PATH"
