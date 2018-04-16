import {series, mapSeries} from 'async';
import {join} from 'path';
import fs from 'fs';
import ConfigManager from './bootloader/ConfigManager';
import Bootstrap from './conf/Bootstrap';
import Logger from './bootloader/Logger';

/**
 * Main Class to load the project.
 *
 * Starts the app.
 * Manages environments. Initialises stuff.
 *
 * */
class Main {

    /**
     * Constructor
     * */
    constructor(callback) {
        // Some app vars
        this.appBaseDir = __dirname;
        this.appEnv = process.env.NODE_ENV || 'development';
        // Notify of env
        console.log('[FRAMEWORK]'.bold.yellow, `Initialising Class '${this.constructor.name.bold}' using environment '${this.appEnv.bold}'.`.green);
        // Run bootloader tasks
        series([
            this.initializeConfig.bind(this),
            this.initializeLogger.bind(this),
            this.initialiseExportedVars.bind(this),
            this.loadServices.bind(this),
            this.bootstrapApp.bind(this)
        ], callback);
    }

    // Initialize config
    initializeConfig(callback) {
        let self = this;
        new ConfigManager({appBaseDir: this.appBaseDir, env: this.appEnv}, function (_config) {
            self.config = _config;
            callback();
        });
    }

    //Initialize Logger
    initializeLogger(callback) {
        let logOnStdOut = this.config.logger.stdout.enabled,
            self = this;
        this.addSafeReadOnlyGlobal('log', new Logger(function (message) {
            if (logOnStdOut) {
                //Print on console the fully formatted message
                console.log(message.fullyFormattedMessage);
            }
        }, self.config.logger, self.appBaseDir));
        callback();
    }

    // Initialize exports
    initialiseExportedVars(callback) {
        this.addSafeReadOnlyGlobal('_config', this.config);
        this.addSafeReadOnlyGlobal('_appEnv', this.appEnv);
        //Add noop function in global context
        this.addSafeReadOnlyGlobal('noop', function () {
            log.info('Noop Executed with params:', arguments);
        });
        //set the base dir of project in global, This is done to maintain the correct base in case of forked processes.
        this.addSafeReadOnlyGlobal('_appBaseDir', this.appBaseDir);
        callback();
    }

    //Load Service
    loadServices(callback) {
        //Inject all Singleton Services
        let services = {};
        try {
            let list = fs.readdirSync(join(this.appBaseDir, 'services'));
            list.forEach(item => {
                if (item.search(/.js$/) !== -1) {
                    let name = item.toString().replace(/\.js$/, '');
                    console.log('[FRAMEWORK]'.bold.yellow, `Loading Service: '${name.bold}'`.magenta);
                    services[name] = new (require(join(this.appBaseDir, 'services', name)).default);
                }
            });
            this.addSafeReadOnlyGlobal('services', services);
            callback();
        } catch (err) {
            callback(err);
        }
    }

    // Execute Bootstrap
    bootstrapApp(callback) {
        new Bootstrap(callback, this);
    }

    addSafeReadOnlyGlobal(prop, val) {
        console.log('[FRAMEWORK]'.bold.yellow, `Exporting safely '${prop.bold}' from ${this.constructor.name}`.cyan);
        Object.defineProperty(global, prop, {
            get: function () {
                return val;
            },
            set: function () {
                log.warn('You are trying to set the READONLY GLOBAL variable `', prop, '`. This is not permitted. Ignored!');
            }
        });
    }
}

// Time load process
console.log('[FRAMEWORK]'.bold.yellow, `Loaded main module! Took ${((+new Date() - __timers.main) / 1000).toString().bold} seconds.`.green);

// Export now
export default Main;