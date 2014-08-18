    var token = '96c58d10dfe995a47d8c8fa8426b2396'; //token da conta do Luciano;
    var identificador = 'Teste JS-integration';
    var inputEmail = ['email', 'e-mail', 'e_mail', 'email_lead'];
    var form_data = [];

    searchEmailField();

    function searchEmailField(){
      $(document).ready(function() {
        form_data = $('form').serializeArray();
        for(var i in form_data){
          for(var j in inputEmail){
            if(form_data[i].name.toLowerCase() == inputEmail[j]){
              postData();
            }
          }
        }
      });
    }


    function postData(){
        $(':submit').click(function(event){
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
          form_data.push(identificador_obj);
          form_data.push(token_obj);
          form_data.push(c_utmz_obj);
          console.log(form_data);
          $.ajax({
            type: 'POST',
            url: 'http://www.rdstation.com.br/api/1.2/conversions',
            data: form_data,
            success: alert('posted!')
          });
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
