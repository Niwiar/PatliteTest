$("#setLight").on("click", function () {
    let PatliteId = $('#PatliteDropdown').val();
    let LightCode = $('#LightDropdown').val();
    let BuzzerCode = $('#BuzzerDropdown').val();
    let FlashCode = $('#FlashDropdown').val();
    $.ajax({
        url: "/patlite/set_light/"+PatliteId,
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            LightCode: LightCode,
            BuzzerCode: BuzzerCode,
            FlashCode: FlashCode
        }),
        success: function (success) {
            successText = success.message;
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Set Light',
                text: successText,
                showConfirmButton: false,
                timer: 1500
            })
        },
        error: function (err) {
            errorText = err.responseJSON.message;
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: errorText,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#FF5733'
            });
        }
        
    })
})

$(function(){
    const patliteError = $('#PatliteError')
    const redLight = $('#PatliteRed')
    const yellowLight = $('#PatliteYellow')
    const greenLight = $('#PatliteGreen')
    const buzzer = $('#PatliteBuzzer')
    const socket = io("http://localhost:3000");
    socket.on('patErr', err => {
        let msg = `<h1 class="alert alert-warning">Error: ${err}</h1>`
        if (err === 'none') msg=''
        patliteError.html(msg)
    })
        socket.on('patRed', status => {
        redLight.removeClass('on off flash')
        redLight.addClass(status)
    })
    socket.on('patYellow', status => {
        yellowLight.removeClass('on off flash')
        yellowLight.addClass(status)
    })
    socket.on('patGreen', status => {
        greenLight.removeClass('on off flash')
        greenLight.addClass(status)
    })
    socket.on('patBuzzer', status => {
        buzzer.removeClass('off flash flash-fast')
        buzzer.addClass(status)
    })
});