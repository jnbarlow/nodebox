# Nodebox
Lightweight Node/Express framework based on Coldbox

## What is Nodebox?
Nodebox is a lightweight framework for Node that acts as an Express middleware to quickly set up routes based on file system paths.  Nodebox handles all of your routing, and follows simple rules to translate urls into object and function calls so you can worry about creating your project instead of how to wire everything up.

## Installation
Pull Nodebox into your project:

```
npm install nodebox-framework
```

Then add it as middleware:

```
const  express  =  require('express');
const  app  =  express();
const  NodeBox  =  require('../index');
const  nodeBox  =  new NodeBox({loglevel:'debug'});
	
app.use(nodeBox.getMiddleware());

// Listen to port 3000
app.listen(3000, function () {
	console.log('Dev app listening on port 3000!');
});
```
The different loglevels available are:
- TRACE
- DEBUG
- INFO
- WARN
- ERROR

## How it works
Nodebox translates your urls into system calls.  For example, if you went to the url:
```
<site>/home/about
```
Nodebox translates that call to load a handler named `home` (that returns a class), and call the `about` method. (which renders things).  The handlers are stored in the `/handlers` folder of your project.

For the above example, the directory structure would look like:
```
/
  - handlers/
    - home.js
  - views/
  - layouts/
``` 

Nodebox also supports more complex urls by nesting the directory structure.  A url like `/home/foo/bar` would be supported by a directory structure like:
```
/
  - handlers/
    - home/
      -foo.js
    - home.js
  - views/
  - layouts
```
## Views, Layouts, and Handlers
Views and layouts are composed using the template functionality of lodash.  As you can probably guess, these are located in the `views` and `layouts` folders respectively.  A handler doesn't necessarily need a layout, but it does need a view to know HOW to render.  

There are a couple of different ways to assign views, layouts, and variables but the easiest is to initialize the Nodebox router with a config object that contains everything it needs.

Below is an example handler:
```
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
}

module.exports = Main;
```
The first thing to note is that your handler must take the express `req` and `res` objects.  Next, you need an instance of the Nodebox Renderer, so initialize a Nodebox object and grab it's renderer (the same logging rules apply here):
```
this.nbr = new NodeBox({loglevel:"debug"}).getRenderer(res);
```
Finally, set up your handler method (in this case, I'm writing one for the default event: `main/home`:
```
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
```

### The Nodebox Renderer
Let's break down the config object above.  

- view: the view you want to render (located relative to `/views`)
- layout: the layout you want to render (located relative to `/layouts`) 
      - NOTE: There is a special built-in `json` layout you can use to render json data
 - useLayout: directs the renderer to use a layout or to just render the view
- vars: template variables for replacement (lodash template).  All the variables in the `view` object are passed directly into the view template.

Finally, call render on the Nodebox renderer to send a response back through express.

### Example Layout
```
<h1> Layout!</h1>
<h3><%= subtitle %></h3>
<div style='padding:40px;border:1px solid black';>
    <%= view %>
</div>
```
In the example above, you can see some of lodash's template engine at work.  You can reference any variable passed in the var structure here.  Also of note, the special `view` variable is the location in the page that the view is rendered.

### Example View
```
<h2>text from home.html</h2>
<p>view var: <%= viewvar %></p>
```
Much in the same way the layout works, the view also uses the lowdash templating.   In addition, you can see the `viewvar` variable from the original structure being used here.

### Rendering JSON
Here is an example of a handler method that returns json.  Note, what ever is in the vars object gets sent to the browser:
```
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
```

## Pulling it all together
The directory structure for the examples above would ultimately end up looking like this:
```
/
  - handlers/
    - home.js
  - views/
    - home.html
  - layouts/
    - layout.main.html
``` 

## Advanced concepts
As you might have noticed, there are `preEvent` and `postEvent` functions in the handler.  This is a special interface that Nodebox looks for in every handler that lets you run arbitrary code before and after a handler function is executed.  You can use this for things like checking to see if a user is authenticated before executing anything in that handler.


