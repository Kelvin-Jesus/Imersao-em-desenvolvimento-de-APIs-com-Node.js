const http = require('http');

http.createServer((request, response) => {
    return response.end('hello node!!!')
}).listen(process.env.PORT, process.env.HOST, console.log('rodando'));