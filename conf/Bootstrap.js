import {series} from 'async';
/**
 * Bootstrap, called at time of app initializing.
 * */

class Bootstrap {
    constructor(callback) {
        series([
            this.print.bind(this),
            this.initGelfService.bind(this),
            this.initMonitor.bind(this),
            this.resumeInputStream.bind(this),
        ], callback);
    }

    print(callabck) {
        log.debug('Running', this.constructor.name);
        callabck();
    }

    initGelfService(callback) {
        services.GELFService.connect(callback);
    }

    initMonitor(callback) {
        services.MonitorService.monitor(stats => {
            services.GELFService.log('System Health Log', 'Logs in the system health report for the current scan interval.', undefined, {
                uptime: stats.uptime,
                freeMem: stats.freemem,
                totalMem: stats.totalmem,
                usedMem: stats.totalmem - stats.freemem,
                cpuLoadAvg1Min: stats.loadavg.shift(),
                cpuLoadAvg5Min: stats.loadavg.shift(),
                cpuLoadAvg15Min: stats.loadavg.shift(),
            });
        }, callback);
    }

    resumeInputStream(callback) {
        process.stdin.resume();
        callback();
    }
}

export default Bootstrap;
