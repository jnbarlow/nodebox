const NodeboxHandler = require('nodebox-framework').NodeboxHandler;

class Main extends NodeboxHandler {
    preEvent() {
        console.log('preEvent happens here!');
    }

    postEvent() {
        console.log('postEvent happens here!');
    }

    home() {
        this.log.info('In Home');
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