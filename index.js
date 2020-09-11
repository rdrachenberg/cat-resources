const http = require('http');
const port = 3000;
const handlers = require('./handlers');

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    
    // res.write('Hello JS WORLD');

    for(let handler of handlers){
        if(!handler(req, res)) {
            break;
        }
    }
    // res.end();
    
}).listen(port);
console.log(`server started`);