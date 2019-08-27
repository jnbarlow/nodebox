const middleware = require('./src/middleware');
const Renderer = require('./src/render');

class NodeBox {
    constructor(options){
        this.options = {
            loglevel: 'warn',
            ...options
        }
    }

    getMiddleware() {
        return middleware(this.options.loglevel);
    }

    getRenderer(res) {
        return new Renderer(res, {loglevel: this.options.loglevel});
    }
}

module.exports = NodeBox;