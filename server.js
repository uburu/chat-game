var http = require('http');
var Static = require('node-static');
var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 4999
var webSocketServer = new WebSocketServer.Server({port: 4999});
webSocketServer.on('connection', function(ws) {

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    // fetchModule.doGet("/chats", {idfrom: message.idfrom, idto: message.idto, authtoken:message.authtoken})

    // for(var key in clients) {
    //   clients[key].send(message);
    // }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' );
  });

});


// обычный сервер (статика) на порту 8080
var fileServer = new Static.Server('.');
http.createServer(function (req, res) {
  
  fileServer.serve(req, res);

}).listen(5000);

console.log("Сервер запущен на портах front: 5000, back: 4999");
