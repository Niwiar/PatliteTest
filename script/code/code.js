$(document).ready(function () {
    //Code Table
    function fill_Code() {
        tableCode = $('#tableCode').DataTable({
            "bDestroy": true,
            "scrollY": "300px",
            "scrollCollapse": true,
            "ajax": {
                "url": '/code_master/list',
                "dataSrc": ""
            },
            "columns": [
                {
                    "data": "index"
                },
                {
                    "data": "CodeId"
                },
                {
                    "data": "CodeName"
                },
                {
                    "data": "CodeType"
                },
                {
                    "data": "Code"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group' role='group' aria-label='Basic mixed styles example'><button type='button' class='btn btn-primary p-1' id='btnEditCode' style='width: 2rem;'><i class='fa fa-pencil-square-o'></i></button><button type='button' style='width: 2rem;' class='btn btn-danger p-1 ' id='btnDelCode'><i class='fa fa-remove'></i></button></div></div>"
                }
            ]
        });
    }
    fill_Code()

    //Create Code
    $("#addCode").on("click", function () {
        $('#modalCodeMaster').modal('show');

        $("#formCode").trigger("reset");
        $(".modal-title").text("Add Code");

        $("#modalSaveCode").unbind();
        $("#modalSaveCode").click(function () {
            let CodeId = $.trim($('#modalInpCodeId').val());
            let CodeName = $.trim($('#modalInpCodeName').val());
            let CodeType = $.trim($('#modalInpCodeType').val());
            let Code = $.trim($('#modalInpCode').val());
            if (CodeId !== null && CodeName !== null && CodeType !== null && Code !== null) {
                $.ajax({
                    url: "/code_master/add",
                    method: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        CodeId: CodeId,
                        CodeName: CodeName,
                        CodeType: CodeType,
                        Code: Code
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
                        tableCode.ajax.reload(null, false);
                        $('#modalCodeMaster').modal('hide');
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
            $('#modalCodeMaster').modal('hide');
        })
    });

    //Edit Code
    $(document).on("click", "#btnEditCode", function () {
        $('#modalCodeMaster').modal('show');

        $(".modal-title").text("Edit Code");
        rows = $(this).closest("tr");
        let OldCodeId = tableCode.rows(rows).data()[0].CodeId;
        let CodeName = tableCode.rows(rows).data()[0].CodeName;
        let CodeType = tableCode.rows(rows).data()[0].CodeType;
        let Code = tableCode.rows(rows).data()[0].Code;

        $('#modalInpCodeId').val(OldCodeId);
        $('#modalInpCodeName').val(CodeName);
        $('#modalInpCodeType').val(CodeType);
        $('#modalInpCode').val(Code);

        $("#modalSaveCode").unbind();
        $("#modalSaveCode").click(function () {
            let CodeId = $.trim($('#modalInpCodeId').val());
            let CodeName = $.trim($('#modalInpCodeName').val());
            let CodeType = $.trim($('#modalInpCodeType').val());
            let Code = $.trim($('#modalInpCode').val());

            $.ajax({
                url: "/code_master/edit/" + OldCodeId,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    CodeId: CodeId,
                    CodeName: CodeName,
                    CodeType: CodeType,
                    Code: Code
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
                    tableCode.ajax.reload(null, false);
                    $('#modalCodeMaster').modal('hide');
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
            $('#modalCodeMaster').modal('hide');
        })
    });

    //Delete Code
    $(document).on("click", "#btnDelCode", function () {
        $('#modalDeleteConfirm').modal('show');

        rows = $(this).closest('tr');
        let CodeId = tableCode.rows(rows).data()[0].CodeId;
        $(".modal-title").text("Confirm Delete");
        $("#btnYes").unbind();
        $("#btnYes").click(function () {
            $.ajax({
                url: "/code_master/delete/" + CodeId,
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
                    tableCode.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
        $(".close,.no").click(function () {
            $('#modalDeleteConfirm').modal('hide');
        })
    });
});