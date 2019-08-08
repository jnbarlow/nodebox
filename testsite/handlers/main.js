class Main {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    home() {
        this.res.send('Hello from main.');
    }
}

module.exports = Main;