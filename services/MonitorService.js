/**
 * Monitor Service
 * */
import monitor from 'os-monitor';

export default class MonitorService {

    monitor(listener, callback) {
        monitor.on('monitor', function (event) {
            listener(event);
        });
        monitor.start({
            delay: monitor.seconds(_config.pollSeconds),
            silent: false,
            stream: false,
            immediate: true
        });
        callback();
    }

}