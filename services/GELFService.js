/**
 * GELF Service
 * */

import request from 'request';

export default class GELFService {

    constructor() {
        this.gelf = null; // Should populate on successful connection
        this.state = GELFService.STATES.OFFLINE;
    }

    static get STATES() {
        return {
            CONNECTED: 'CONNECTED',
            OFFLINE: 'OFFLINE'
        };
    }

    connect(callback) {
        this.state = GELFService.STATES.CONNECTED;
        this.log('Monitor Daemon Connected', 'Daemon to monitor server was started.', undefined, undefined, undefined, undefined, undefined, undefined, err => {
            if (err) {
                log.error(err);
                this.state = GELFService.STATES.OFFLINE;
                callback(new Error('Unable to send message to configured Graylog server GELF collector.'));
            } else {
                callback();
            }
        });
    }

    log(heading, description, level = 1, params = {}, facility = _config.facility, timestamp = Date.now() / 1000, file = null, line = null, callback = () => null) {
        if (this.state !== GELFService.STATES.CONNECTED) return log.warn('Logging without gelf connection! Log ignored.');
        const message = {
            "version": "1.0",
            "host": _config.host,
            "short_message": heading,
            "full_message": description,
            "timestamp": timestamp,
            "level": level,
            "facility": facility,
            "file": file,
            "line": line
        };
        Object.keys(params || {}).forEach(param => message[`_${param}`] = params[param]);
        request({
            method: 'post',
            url: `${_config.graylogProtocol}://${_config.graylogHostname}:${_config.graylogPort}/gelf`,
            json: message
        }, (e, r, b) => {
            if (e) {
                log.error(e);
                callback(e);
            } else {
                callback();
            }
        });
    }

}