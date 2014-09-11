//GOOGLE ANALYTICS
function read_cookie(a) {
    var b = a + '=';
    var c = document.cookie.split(';');
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        while (e.charAt(0) == ' ') e = e.substring(1, e.length);
        if (e.indexOf(b) == 0) {
            return e.substring(b.length, e.length)
        }
    }
    return null
};
//

function checkJQuery() {
    //   if (typeof jQuery == "undefined"){
    //     var theNewScript = document.createElement("script");
    //     theNewScript.type = "text/javascript";
    //     theNewScript.src = "http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js";
    //     document.getElementsByTagName("body")[0].appendChild(theNewScript);
    //     // jQuery MAY OR MAY NOT be loaded at this stage
    //     var waitForLoad = function () {
    //         if (typeof jQuery != "undefined") {
    //             return false;
    //         } else {
    //             window.setTimeout(waitForLoad, 1000);
    //         }
    //     };
    //     window.setTimeout(waitForLoad, 1000);
    //   }
    return false;
}

function getSubmit(token_rdstation, identificador) {
    var inputEmail = ['email', 'e-mail', 'e_mail', 'email_lead'],
        form_data = [],
        form;
    $(':submit').click(function(event) {
        form = $(this).closest('form');
        if (!form) {
            return;
        }
        form_data = form.serializeArray();
        for (var i in form_data) {
          if (form_data.hasOwnProperty(i)) {
            if(inputEmail.indexOf(form_data[i].name.toLowerCase()) != -1){
              form_data[i].name = 'email';
              postData(form, form_data, token_rdstation, identificador);
            }
          }
        }
        event.preventDefault();
    });
}

function postData(form, form_data_original, token_rdstation, identificador) {
    var inputPassword = ['password', 'password_confirmation', 'senha', 'confirme_senha', 'captcha',
            '_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call'
        ],
        password_field = false;
        form_data = [];
    for (var i in form_data_original) {
      if (form_data_original.hasOwnProperty(i)) {
        if(inputPassword.indexOf(form_data_original[i].name.toLowerCase()) == -1){
          form_data.push(form_data_original[i]);
        }
      }
    }
    var identificador_obj = {
            'name': 'identificador',
            'value': identificador
        },
        token_obj = {
            'name': 'token_rdstation',
            'value': token_rdstation
        },
        c_utmz_obj = {
            'name': 'c_utmz',
            'value': read_cookie('__utmz')
        };
    form_data.push(identificador_obj, token_obj, c_utmz_obj);
    $.ajax({
        type: 'POST',
        url: 'http://www.rdstation.com.br/api/1.2/conversions',
        data: form_data,
        crossDomain: true,
        error: function(response) {
            console.log(response);
        },
        complete: function() {
            form.submit();
        }
    });
}

function RDStationFormIntegration(token_rdstation, identificador) {
    checkJQuery();
    getSubmit(token_rdstation, identificador);
}
