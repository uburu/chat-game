var http = require('http');
var Static = require('node-static');
var WebSocketServer = new require('ws');


// создать подключение
var socket = new WebSocketServer("ws://80.252.155.65:4999");

function make_private_chat(input){
  type = 'make_private_chat';
  data = [input.idfrom, input.idto];
  return JSON.stringify({type: type, data: data});
};

get_chats = {
  type: 'get_chats',
  data: 1,
}

// socket.onopen = function() {
//   socket.send(JSON.stringify(make_private_chat));
// };

// подключенные клиенты
var clients = {};


function parseMessage(input){
  data = JSON.parse(input);
  console.log("parsed data ", data);
  return data;
}

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({port: 4999});
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    data = parseMessage(message);


    for(var key in clients) {
      clients[key].send(make_private_chat(data));
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });

});


// обычный сервер (статика) на порту 8080
var fileServer = new Static.Server('.');
http.createServer(function (req, res) {
  
  fileServer.serve(req, res);

}).listen(5000);

console.log("Сервер запущен на портах 5000");

