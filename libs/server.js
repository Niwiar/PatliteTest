const app = require('../app');
const http = require('http');
const socketio = require('socket.io');

const PORT = 3000;

const server = http.createServer(app);
server.listen(PORT, () => console.log(`App listening on ${PORT}`));
const io = socketio(server);

io.on('connection', socket => {
    console.log('user connected')

    socket.on('patliteError', data => {
        console.log('Error:',data)
        io.emit('patErr', data)
    })

    socket.on('redLight', data => {
        console.log('Red:',data)
        io.emit('patRed', data)
    })
    socket.on('yellowLight', data => {
        console.log('Yellow:',data)
        io.emit('patYellow', data)
    })
    socket.on('greenLight', data => {
        console.log('Green:',data)
        io.emit('patGreen', data)
    })
    socket.on('buzzer', data => {
        console.log('Buzzer:',data)
        io.emit('patBuzzer', data)
    })
})
