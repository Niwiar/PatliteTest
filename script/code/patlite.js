$(document).ready(function () {
    //Patlite Table
    function fill_Patlite() {
        tablePatlite = $('#tablePatlite').DataTable({
            "bDestroy": true,
            "scrollY": "300px",
            "scrollCollapse": true,
            "ajax": {
                "url": '/patlite_master/list',
                "dataSrc": ""
            },
            "columns": [
                {
                    "data": "index"
                },
                {
                    "data": "PatliteName"
                },
                {
                    "data": "PatliteIp"
                },
                {
                    "data": "PatlitePort"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group' role='group' aria-label='Basic mixed styles example'><button type='button' class='btn btn-primary p-1' id='btnEditPatlite' style='width: 2rem;'><i class='fa fa-pencil-square-o'></i></button><button type='button' style='width: 2rem;' class='btn btn-danger p-1 ' id='btnDelPatlite'><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "PatliteId"
                }
            ],
            "columnDefs": [
                {
                    "targets": [5],
                    "visible": false
                },
            ],
        });
    }
    fill_Patlite()

    //Create Patlite
    $("#addPatlite").on("click", function () {
        $('#modalPatliteMaster').modal('show');

        $("#formPatlite").trigger("reset");
        $(".modal-title").text("Add Patlite");

        $("#modalSavePatlite").unbind();
        $("#modalSavePatlite").click(function () {
            let PatliteName = $.trim($('#modalInpPatliteName').val());
            let PatliteIp = $.trim($('#modalInpPatliteIp').val());
            let PatlitePort = $.trim($('#modalInpPatlitePort').val());
            if (PatliteName !== null && PatliteIp !== null && PatlitePort !== null) {
                $.ajax({
                    url: "/patlite_master/add",
                    method: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        PatliteName: PatliteName,
                        PatliteIp: PatliteIp,
                        PatlitePort: PatlitePort
                    }),
                    success: function (success) {
                        successText = success.message;
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Created',
                            text: successText,
                            showConfirmButton: false,
                            timer: 1500
                        })
                        tablePatlite.ajax.reload(null, false);
                        $('#modalPatliteMaster').modal('hide');
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
                });
            }
        })
        $(".close,.no").click(function () {
            $('#modalPatliteMaster').modal('hide');
        })
    });

    //Edit Patlite
    $(document).on("click", "#btnEditPatlite", function () {
        $('#modalPatliteMaster').modal('show');

        $(".modal-title").text("Edit Patlite");
        rows = $(this).closest("tr");
        let PatliteId = tablePatlite.rows(rows).data()[0].PatliteId;
        let PatliteName = tablePatlite.rows(rows).data()[0].PatliteName;
        let PatliteIp = tablePatlite.rows(rows).data()[0].PatliteIp;
        let PatlitePort = tablePatlite.rows(rows).data()[0].PatlitePort;

        $('#modalInpPatliteName').val(PatliteName);
        $('#modalInpPatliteIp').val(PatliteIp);
        $('#modalInpPatlitePort').val(PatlitePort);

        $("#modalSavePatlite").unbind();
        $("#modalSavePatlite").click(function () {
            let PatliteName = $.trim($('#modalInpPatliteName').val());
            let PatliteIp = $.trim($('#modalInpPatliteIp').val());
            let PatlitePort = $.trim($('#modalInpPatlitePort').val());

            $.ajax({
                url: "/patlite_master/edit/" + PatliteId,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    PatliteName: PatliteName,
                    PatliteIp: PatliteIp,
                    PatlitePort: PatlitePort
                }),
                success: function (success) {
                    successText = success.message;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: successText,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tablePatlite.ajax.reload(null, false);
                    $('#modalPatliteMaster').modal('hide');
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
            });
        })
        $(".close,.no").click(function () {
            $('#modalPatliteMaster').modal('hide');
        })
    });

    //Delete Patlite
    $(document).on("click", "#btnDelPatlite", function () {
        $('#modalDeleteConfirm').modal('show');

        rows = $(this).closest('tr');
        let PatliteId = tablePatlite.rows(rows).data()[0].PatliteId;
        $(".modal-title").text("Confirm Delete");
        $("#btnYes").unbind();
        $("#btnYes").click(function () {
            $.ajax({
                url: "/patlite_master/delete/" + PatliteId,
                method: 'delete',
                contentType: 'application/json',
                success: function (success) {
                    successText = success.message;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: successText,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tablePatlite.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
        $(".close,.no").click(function () {
            $('#modalDeleteConfirm').modal('hide');
        })
    });
});