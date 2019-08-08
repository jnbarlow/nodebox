const pathResolver = require('path');

module.exports = (loglevel) => {
    const log = require('../logger')(loglevel, 'NodeBox Middleware');
    return (req, res, next) => {
        log.debug('Processing Request');

        const path = req.path.substring(1);
        let explodedPath = path.split('/');
        
        if(explodedPath.length < 2) {
            log.info('Using default handler: main.home');
            explodedPath = ['main', 'home'];
        }

        const fcn = explodedPath.pop();
        const requirePath = `./handlers/${explodedPath.join('/')}.js`;

        try {
            log.info(`Processing ${requirePath}, ${fcn}()`);
            const Handler = require(pathResolver.resolve(requirePath));
            const handler = new Handler(req, res);
            handler[fcn]();
            
        } catch (e) {
            log.error(`Attempted ${requirePath}, ${fcn}()`);
            log.error(e);
        }
        
        next();
    };
}

