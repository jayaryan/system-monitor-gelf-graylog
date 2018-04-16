import {series} from 'async';
/**
 * Bootstrap, called at time of app initializing.
 * */

class Bootstrap {
    constructor(callback) {
        series([
            this.print.bind(this),
        ], callback);
    }

    print(callabck) {
        log.debug('Running', this.constructor.name);
        callabck();
    }
}

export default Bootstrap;
