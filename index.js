const middleware = require('./src/middleware');
const Renderer = require('./src/render');

class Nodebox {
    constructor(options){
        this.options = {
            loglevel: 'info',
            ...options
        }
    }

    getMiddleware(app) {
        return middleware(this.options.loglevel, app);
    }

    getRenderer(res) {
        return new Renderer(res, {loglevel: this.options.loglevel});
    }
}

class NodeboxHandler {
    constructor(req, res, loglevel) {
        this.req = req;
        this.res = res;
        this.nbr = new Nodebox({loglevel:loglevel || 'info'}).getRenderer(res);
    }
}

module.exports = {
    Nodebox,
    NodeboxHandler
};