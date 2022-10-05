const io = require('socket.io-client');
const Net = require('net');
const Domain = require('domain');
// const PATLITE_PORT = 10000;
// const PATLITE_HOST = '192.168.10.1';
const { Style, log } = require('./log');
const { checkStatus, HextoBinary, BuffertoAscii } = require('./utils')

const sendData = (PatliteHost, PatlitePort, data) => {
    const socket = io.connect('http://localhost:3000');

    const d = Domain.create();
    d.on('error', err => {
        log(Style.fg.red,`Connection Error; ${err.message}`);
        socket.emit('patliteError', err.message)
    })

    d.run(() => {
        const client = Net.connect(PatlitePort, PatliteHost, () => {
            // client.setEncoding('ascii')
            // client.setKeepAlive(true);
            const address = client.address();
            let { port } = address;
            console.log(`Connect Patlite on ${port}`);
            socket.emit('patliteError', 'none')
    
            log(Style.fg.magenta, `Client; ${data}`);
            client.write(data);
        
            client.on('data', chunk => {
                let Hex = chunk.toString('hex')
                if (BuffertoAscii(Hex)[0].includes('R')) {
                    let Bin = HextoBinary(chunk, 1)
                    let status = checkStatus(Bin);
                    log(Style.fg.cyan, `Server; ${chunk}:${Bin}:${status}`);
                    if (!status.includes('R')) socket.emit('redLight', 'off')
                    if (!status.includes('Y')) socket.emit('yellowLight', 'off')
                    if (!status.includes('G')) socket.emit('greenLight', 'off')
                    if (!status.includes('B')) socket.emit('buzzer', 'off')
                    for (let char of status.split(' ')) {
                        console.log(char)
                        let showStatus = "on"
                        if (char.includes('R')){
                            if (char.includes('F')) showStatus = 'flash'
                            socket.emit('redLight', showStatus)
                        }else if (char.includes('Y')){
                            if (char.includes('F')) showStatus = 'flash'
                            socket.emit('yellowLight', showStatus)
                        }else if (char.includes('G')){
                            if (char.includes('F')) showStatus = 'flash'
                            socket.emit('greenLight', showStatus)
                        }else if (char.includes('B')){
                            if (char.includes('F')) showStatus = 'flash-fast'
                            else showStatus = 'flash'
                            socket.emit('buzzer', showStatus)
                        }
                    }
                }else{
                    log(Style.fg.cyan, `Server; ${chunk}`);
                }
                
                client.end()
            });
            
            client.on('end', () => {
                log(Style.fg.yellow, `Disconnect from Patlite;`);
            })
        });
    })
}

module.exports = sendData