const http = require('http');

http.createServer((request, response) => {
    return response.end('hello node!!!')
}).listen(8000, console.log('rodando'));