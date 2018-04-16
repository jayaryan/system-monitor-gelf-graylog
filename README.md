# System Monitor for Graylog / GELF

Monitors the system and sends in the logs to the Graylog server using the GELF interface.


### Setup

**Clone this repo**
> git clone git@github.com:kushal-likhi/system-monitor-gelf-graylog.git

**Install Dependencies**
> npm install


### Configurations
You can configure the system for different environments in the `conf/AppConfig.json` file. Alternatively you can also pass the env variables.

### Start Daemon

1. With configuration via `env vars`

```bash
> HOST=<host identifier> FACILITY=<facility name> GRAYLOG_PORT=<port for gelf> GRAYLOG_HOSTNAME=<IP or domain of gelf> GRAYLOG_PROTOCOL=<http or https> ./start.sh
```

2. With pulling in configurations from `config/AppConfig.json` file.

```bash
> ./start.sh
```


### Stop Daemon

```bash
> ./stop.sh
```

