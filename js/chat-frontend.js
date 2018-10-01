// создать подключение
var socket = new WebSocket("ws://192.168.0.66:8081");

var name = '';
var nameForm = document.getElementById('nameForm');
var messageInput = document.getElementById('message');
var stickerButton = document.getElementById('sticker');
var typerName = document.getElementById('typerName');

stickerButton.addEventListener('click', function(e) {
  e.preventDefault();
  var imageSrc = prompt('Ссылка на картинку?');
  var message = {
    name,
    sticker: true,
    src: imageSrc
  };
  socket.send(JSON.stringify(message));
});

nameForm.addEventListener('submit', function(e) {
  e.preventDefault();
  name = nameForm.querySelector('#name').value;
  document.querySelector('.chatik').classList.remove('invisible');
  nameForm.classList.add('invisible');
})

messageInput.addEventListener('keydown', function() {
  var message = { name, 'typing': true };
  socket.send(JSON.stringify(message));
});

document.querySelector('.chatik').addEventListener('submit', function(e) {
  e.preventDefault();
  // var outgoingMessage = this.message.value;
  var outgoingMessage = {
    name,
    message: this.message.value
  };
  document.getElementById('message').value = '';

  socket.send(JSON.stringify(outgoingMessage));
  return false;
});

// обработчик входящих сообщений
socket.onmessage = function(event) {
  var incomingMessage = event.data;
  showMessage(incomingMessage);
};

socket.onclose = function(event) {
  console.log('FUCK', event);
  window.location.reload();
}

socket.onopen = function(event) {
  console.log('OPENED', event);
}

// показать сообщение в div#subscribe
const color = {};
function showMessage(data) {
  const message = JSON.parse(data);
  if (!color.hasOwnProperty(message.name) || color[message.name] === undefined) {
    color[message.name] = message.hsl;
    console.log(color);

  }
  if (message.hasOwnProperty('typing')) {
    if (message['typing'] === true && message.name !== name) {
      document.querySelector('.typer').classList.remove('invisible');
      typerName.innerHTML = message.name;
      return;
    } else if (!message.hasOwnProperty('message')) {
      document.querySelector('.typer').classList.add('invisible');
      return;
    } else {
      document.querySelector('.typer').classList.add('invisible');
    }
  }
  if (message.hasOwnProperty('sticker')) {
    $('#subscribe').append(`<div class="message ${message.name === name ? 'message--mine' : ''}" style="background-color: hsl(${color[message.name]}, 50%, 50%)">
    <img src="${message.src}" width="200" />
    </div>`);
    return;
  }
  $('#subscribe').append(`<div class="message ${message.name === name ? 'message--mine' : ''}" style="background-color: hsl(${color[message.name]}, 50%, 50%)">
    <span class="name">${message.name}:</span>
    <span class="text">${message.message}</span>
  </div>`);
  window.scrollTo(0, document.body.scrollHeight);
}