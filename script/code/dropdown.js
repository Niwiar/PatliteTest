async function LightDropDown() {
    // Set Light
    $.ajax({
        url: "/dropdown/light",
        method: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            response.forEach(Light => {
                $("#LightDropdown").append("<option value=" + Light.Code + "><span>" + Light.CodeName + "</span></option>");
            });
        }
    })
}
async function BuzzerDropDown() {
    // Set Buzzer
    $.ajax({
        url: "/dropdown/buzzer",
        method: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            response.forEach(Buzzer => {
                $("#BuzzerDropdown").append("<option value=" + Buzzer.Code + "><span>" + Buzzer.CodeName + "</span></option>");
            });
        }
    })
}
async function FlashDropDown() {
    // Set Flash
    $.ajax({
        url: "/dropdown/flash",
        method: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            response.forEach(Flash => {
                $("#FlashDropdown").append("<option value=" + Flash.Code + "><span>" + Flash.CodeName + "</span></option>");
            });
        }
    })
}

async function PatliteDropDown() {
    // Set Patlite
    $.ajax({
        url: "/dropdown/patlite",
        method: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            response.forEach(Patlite => {
                $("#PatliteDropdown").append("<option value=" + Patlite.PatliteId + "><span>" + Patlite.PatliteName + "</span></option>");
            });
        }
    })
}

LightDropDown();
BuzzerDropDown();
FlashDropDown();
PatliteDropDown();