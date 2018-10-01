const WebSocketServer = new require('ws');
const fs = require('fs');
// подключенные клиенты
const clients = {};
const history = [];
// WebSocket-сервер на порту 8081
const webSocketServer = new WebSocketServer.Server({
  port: 8081
});
webSocketServer.on('connection', function(ws) {
  const id = Math.floor(Math.random() * 10000000);
  let typingTimer;
  clients[id]= ws;
  console.log("новое соединение ", id);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message + ' от ' + id);
    const data = JSON.parse(message);
    clearTimeout(typingTimer);

    if (data.hasOwnProperty('typing')) {
        if (data['typing'] === true) {
            typingTimer = setTimeout(function() {
                const result = {
                    name: data.name,
                    typing: false
                };
                for (client in clients) {
                    clients[client].send(JSON.stringify(result));
                }
                return;
            }, 5000);
            const result = {
                name: data.name,
                typing: true
            };
            for (client in clients) {
                clients[client].send(JSON.stringify(result));
            }
            return;
        }
    } else if (data.hasOwnProperty('sticker')) {
        var result = {
            name: data.name,
            hsl: Math.floor(Math.random() * 1000),         
            sticker: true,
            src: data.src
        };
        for (client in clients) {
            clients[client].send(JSON.stringify(result));
        }
        return;
    }
    var result = {
        name: data.name,
        message: data.message,
        typing: false,
        hsl: Math.floor(Math.random() * 1000)
    };
    history.push(result);
    try {
        for (client in clients) {
            clients[client].send(JSON.stringify(result));
        }
    } catch (e) {
        console.log(e);
        fs.writeFileSync('history.json', history);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });
});