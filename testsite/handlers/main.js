const NodeBox = require('../../index');

class Main {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.nbr = new NodeBox({loglevel:"debug"}).getRenderer(res);
    }

    home() {
        this.nbr.set({
            view: 'home.html',
            layout: 'layout.main.html',
            useLayout: true,
            vars: {
                subtitle: 'varSubtitle',
                view:{
                    viewvar: 'varviewvar!'
                }
            }
        })
        this.nbr.render();
        
    }
}

module.exports = Main;