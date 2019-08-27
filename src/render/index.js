
const pathResolver = require('path');
const _ = require('lodash');
const fs = require('fs');

class Renderer {
    constructor(res, options){
        this.options = {
            loglevel: 'warn',
            ...options
        }

        this.layout = 'layout.main.html';
        this.view = '';
        this.useLayout = true;
        this.log = require('../logger')(this.options.loglevel, 'NodeBox Renderer');
        this.res = res;
        this.vars = {};

        if (!res){
            throw('The express response object must be passed to getRenderer().');
        }
    }

    /**
     * Sets the local template vars. Anything inside of the view key gets passed to the view.
     *  {
     *      var1: 'foo',
     *      var2: 'bar',
     *      view: {
     *          viewvar1: 'viewfoo'
     *      }
     *  }
     * @param {} vars 
     */
    setVars(vars){
        this.log.debug('Setting vars');
        this.vars = vars;
    }

    /**
     * Sets the layout to use for this render (located in <sitehome>/layouts). Default layout is layout.main.html
     * You may also include directories.
     * @param {*} layout 
     */
    setLayout(layout){
        this.log.debug(`Setting layout to ${layout}.`);
        this.layout = layout;
    }

    /**
     * Sets the useLayout flag
     * @param {*} useLayout 
     */
    setUseLayout(useLayout){
        this.log.debug(`Setting useLayout to ${useLayout}.`);
        this.useLayout = useLayout
    }

    /**
     * Sets the view for this render (located in <sitehome>/views). 
     * You may also include directories
     * @param {*} view 
     */
    setView(view){
        this.log.debug(`Setting view to ${view}.`);
        this.view = view;
    }

    /**
     * set all options with one call
     * @param {} vars 
     */
    set(vars){
        if(!_.isUndefined(vars.view)){
            this.setView(vars.view);
        }
        if(!_.isUndefined(vars.layout)){
            this.setLayout(vars.layout);
        }
        if(!_.isUndefined(vars.useLayout)){
            this.setUseLayout(vars.useLayout);
        }
        if(!_.isUndefined(vars.vars)){
            this.setVars(vars.vars);
        }
    }


    /**
     * renders the request with the given layout and view.
     */
    render(){
        this.log.info(`Rendering ${this.view} ${(this.useLayout)? `with layout ${this.layout}.` : '.'}`);
        let view;
        let layout;

        // if we don't have a json layout, try to load all ththings
        if(this.layout.toLowerCase() != 'json'){
            //load the view
            try {
                view = _.template(
                    fs.readFileSync(pathResolver.resolve(`./views/${this.view}`), { encoding: 'utf-8' })
                );
            } catch (e) {
                this.log.error(e);
            }

            //load the layout
            if(this.useLayout){
                try {
                    layout = _.template(
                        fs.readFileSync(pathResolver.resolve(`./layouts/${this.layout}`), { encoding: 'utf-8' })
                    );
                } catch (e) {
                    this.log.error(e);
                }
            }

            //try to fill in the layout and view templates, and render them where appropriate.
            try {
                if(this.useLayout){
                    this.res.send(layout({
                        ...this.vars,
                        view: view(this.vars.view)
                    }));
                } else{
                    this.res.send(view(this.vars.view));
                }
            } catch (e){
                this.log.error(e);
                this.res.send('not found');
            }
        } else {
            this.res.json(this.vars);
        }

    }

}

module.exports = Renderer;