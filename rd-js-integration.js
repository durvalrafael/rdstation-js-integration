    getSubmit();

    function getSubmit(){
      var inputEmail = ['email', 'e-mail', 'e_mail', 'email_lead'];
      var form_data = [];
      var form;
      $(':submit').click(function(event){
        form = $(this).closest('form');
        form_data = form.serializeArray();
        for(var i in form_data){
          for(var j in inputEmail){
            if(form_data[i].name.toLowerCase() == inputEmail[j]){
              form_data[i].name = 'email';
              postData(form, form_data);
            }
          }
        }
        event.preventDefault();
      });
    }

    function postData(form, form_data){
      var identificador_obj = {
        'name': 'identificador',
        'value': identificador
      };
      var token_obj = {
        'name': 'token_rdstation',
        'value': token
      };
      var c_utmz_obj = {
        'name': 'c_utmz',
        'value': read_cookie('__utmz')
      };
      form_data.push(identificador_obj, token_obj, c_utmz_obj);
      $.ajax({
        type: 'POST',
        url: 'http://www.rdstation.com.br/api/1.2/conversions',
        data: form_data,
        success: function() {
          form.submit();
        },
        error: function(response){console.log(response)}
      });
    }


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
