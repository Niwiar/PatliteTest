const AsciitoBinary = (str) => str.split('').map(i => i.charCodeAt().toString(2)).join(' ')
const HextoBinary = (str, order) => parseInt(str.toString('hex').substr(order*2, 2), 16).toString(2);

const BitoAscii = (str) => str.split('').map(i => String.fromCharCode(parseInt(i, 2)).toString(10)).join('')
const HextoAscii = (str) => str.split(' ').map(i => String.fromCharCode(parseInt(i, 16)).toString(10)).join('')
const BuffertoAscii = (str) => str.toString('hex').match(/.{1,2}/g).map(i => String.fromCharCode(parseInt(i, 16)).toString(10)).join('')

const AsciitoHex = (str) => str.split('').map(i => i.charCodeAt().toString(16)).join('')
const BitoHex = (str) => parseInt(str, 2).toString(16);

// const reverseStr = (str) => str.split('').reverse();
const checkCode = (order) => {
    let status = ""
    switch(order){
        case 0:
            status = "R "
            break;
        case 1:
            status = "Y "
            break;
        case 2:
            status = "G "
            break;
        case 3:
            status = "FB "
            break;
        case 4:
            status = "SB "
            break;
        case 5:
            status = "RF "
            break;
        case 6:
            status = "YF "
            break;
        case 7:
            status = "GF "
            break;
    }
    return status;
}
const checkStatus = (data) => {
    let code = data.split('').reverse();
    let status = "";
    for (let i = 0; i<code.length; i++) {
        if (code[i] == 1){
            status+=checkCode(i);
        }
    }
    if (status === "") status = 'None'
    return status
}


module.exports = {
    AsciitoBinary,
    HextoBinary,
    BitoAscii,
    HextoAscii,
    BuffertoAscii,
    AsciitoHex,
    BitoHex,
    checkCode,
    checkStatus
}