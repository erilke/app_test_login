var userHandler = {
    username : '',
    status : ''
}

$(document).on('pagecontainershow', function (e, ui) {
    var activePage = $(':mobile-pagecontainer').pagecontainer('getActivePage');
    if(activePage.attr('id') === 'login') {
        $(document).on('click', '#submit', function() { // catch the form's submit event
            if($('#username').val().length > 0 && $('#password').val().length > 0){

                userHandler.username = $('#username').val();

                // Send data to server through the Ajax call
                // action is functionality we want to call and outputJSON is our data
            //$.ajax({url: 'login.php',

                $.ajax({url: 'http://idmon.com.mx/encuesta_casa/pruebas/login.php',


                    //data: {action : 'authorization', formData : $('#check-user').serialize()},
                data: {action : 'authorization', username : $('#username').val(), password:$('#password').val() },

                    type: 'post',
                    async: 'true',
                    dataType: 'json',
                    beforeSend: function() {
                        // This callback function will trigger before data is sent
                        $.mobile.loading('show'); // This will show Ajax spinner
                    },
                    complete: function() {
                        // This callback function will trigger on data sent/received complete
                        $.mobile.loading('hide'); // This will hide Ajax spinner
                    },
                    success: function (result) {
                        // Check if authorization process was successful
                        if(result.status == 'success') {
                            userHandler.status = result.status;
                            $.mobile.changePage("#second");
                        } else {
                            alert('Logon unsuccessful!');
                        }
                    },
                    error: function (request,error) {
                        // This callback function will trigger on unsuccessful action
                        alert('Error en la red, intenta de nuevo!');
                    }
                });
            } else {
                alert('Llena todos los campos');
            }
            return false; // cancel original event to prevent form submitting
        });
    } else if(activePage.attr('id') === 'second') {
        activePage.find('.ui-content').text('Bienvenido ' + userHandler.username);
    }
});

$(document).on('pagecontainerbeforechange', function (e, ui) {
    var activePage = $(':mobile-pagecontainer').pagecontainer('getActivePage');
    if(activePage.attr('id') === 'second') {
        var to = ui.toPage;

        if (typeof to  === 'string') {
            var u = $.mobile.path.parseUrl(to);
            to = u.hash || '#' + u.pathname.substring(1);

            if (to === '#login' && userHandler.status === 'success') {
                alert('No puedes regresar a la página de acceso si ya has accedido!');
                e.preventDefault();
                e.stopPropagation();

                // remove active status on a button if a transition was triggered with a button
                $('#back-btn').removeClass('ui-btn-active ui-shadow').css({'box-shadow':'0 0 0 #3388CC'});
            }
        }
    }
});
