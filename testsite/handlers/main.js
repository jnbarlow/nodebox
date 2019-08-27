const NodeBox = require('../../index');

class Main {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.nbr = new NodeBox({loglevel:"debug"}).getRenderer(res);
    }

    preEvent() {
        console.log('preEvent happens here!');
    }

    postEvent() {
        console.log('postEvent happens here!');
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

    json() {
        this.nbr.set({
            layout: 'json',
            vars: {
                foo:'foo',
                bar:'bar'
            }
        })
        this.nbr.render();
    }
}

module.exports = Main;