const socket = io();

socket.emit('mensaje', 'Hola mundo, soy un socket');