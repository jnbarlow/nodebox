const middleware = require('./src/middleware');
const render = require('./src/render');

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

    render() {
        return render;
    }
}

module.exports = NodeBox;