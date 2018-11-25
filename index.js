if (!window.WebSocket) {
	document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var ID = randomIntFromInterval(0,500)

var CHAT_ID = "";

// создать подключение
var socket = new WebSocket("ws://80.252.155.65:5003");

function auth(){
  data = {
    Type: 'auth',
    data: {
      auth_id: ID,
    }
  }
  return JSON.stringify(data);
};

socket.onopen = function(){
  socket.send(auth());
  // alert("wtf");
};

function make_chat(){
  data = {
    type: 'make_chat',
    data: ID
  }
  return JSON.stringify(data);
};


function post_msg(chat_id, message){
  data = {
    type: 'post_msg',
    chat_id: chat_id,
    profile_id: ID,
    message: message
  }
  return JSON.stringify(data);
}

// publish

document.forms.publish.onsubmit = function() {
  var outgoingMessage = this.message.value;
  var chat_id_input = this.chat_id.value;
  msg = post_msg(chat_id_input, outgoingMessage);
  socket.send(msg);
  return false;
};


// отправить сообщение из формы publish
document.forms.make_chat.onsubmit = function() {
  msg = make_chat();
  socket.send(msg);
  return false;
};


function proxy(msg){
  data = JSON.parse(msg);
  switch (data.type){
    case "make_chat":
      CHAT_ID = data.data;
      document.getElementById("chat_id_hidden") = CHAT_ID;
      showMessage("Это ID твоего чата: " + CHAT_ID + " вставь его в поле присоединиться, чтобы початиться", "chat_id")
      break;
    case "post_msg":
      showMessage(msg, "subscribe"); 
      break;
    
      default:
        break;
  
  }
}

// обработчик входящих сообщений
socket.onmessage = function(event) {
  var incomingMessage = event.data;
  proxy(incomingMessage);
};

// показать сообщение в div#subscribe
function showMessage(message, element) {
  var messageElem = document.createElement('div');
  messageElem.appendChild(document.createTextNode(message));
  document.getElementById(element).appendChild(messageElem);
  //subscribe
}
