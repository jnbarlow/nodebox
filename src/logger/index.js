const loglevel = require('loglevel');
const loglevelPrefix = require('loglevel-plugin-prefix');
const colors = require('colors/safe');

/**
 * logger - exports instance of a loglevel object
 *
 * available log levels: trace, debug, info, warn, error
 *
 * usage:
 *      const log = require('logger')(<loglevel>, <component name>);
 *      log.debug('log');
 *      log.warn('some more logs);
 *
 * output:
 *      given a component name of 'Main':
 *      [Main] DEBUG: log
 *      [Main] WARN: some more logs
 */
module.exports = (level, component) => {
	const outputColors = {
		TRACE: colors.magenta,
		DEBUG: colors.cyan,
		INFO: colors.blue,
		WARN: colors.yellow,
		ERROR: colors.red
	};

	loglevelPrefix.reg(loglevel);
	loglevelPrefix.apply(loglevel, {
		levelFormatter: level => {
			return level.toUpperCase();
		},
		format: (level, name) => {
			return `[${colors.blue(name)}] ${outputColors[level](level)}:`;
		}
	});
	const log = loglevel.getLogger(component);

	log.setLevel(level);
	return log;
};
