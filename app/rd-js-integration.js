function RdJsIntegration(token_rdstation, identificador){
  var $jQueryRD;
  var self = this;
  this.token_rdstation = token_rdstation;
  this.identificador = identificador;

  this.doIt = function(){
    if(typeof jQuery == "undefined"){
     loadScript("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", prepareData);
    }else{
      prepareData();
    }
  };

  function loadScript(sScriptSrc, oCallback) {
    var oHead = document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = sScriptSrc;
    // most browsers
    oScript.onload = oCallback;
    // IE 6 & 7
    oScript.onreadystatechange = function() {
      if (this.readyState == 'complete') {
        oCallback();
      }
    };
    oHead.appendChild(oScript);
  }

  //GOOGLE ANALYTICS
  function read_cookie(a) {
    var b = a + '=';
    var c = document.cookie.split(';');
    for (var d = 0; d < c.length; d++) {
      var e = c[d];
      while (e.charAt(0) == ' ') e = e.substring(1, e.length);
      if (e.indexOf(b) === 0) {
        return e.substring(b.length, e.length);
      }
    }
    return null;
  }
  //

  function prepareData() {
    $jQueryRD = jQuery;
    $jQueryRD(':submit').click(function(event) {
      var inputPassword = ['captcha','_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
          inputEmail = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
          form_data_original = [],
          form_data = [],
          form;
      form = $jQueryRD(this).closest('form');
      if (!form) {
        return;
      }
      function isHidden(element) { return $jQueryRD(element).is("input[type=hidden]"); }
      function isPassword(element) { return $jQueryRD(element).is("input[type=password]"); }
      var inputs = $jQueryRD(form).find('input');
      inputs = inputs.map(function() {
        if (!(isHidden(this) || isPassword(this))) { return this; }
      });
      form_data_original = inputs.serializeArray();
      for (var i in form_data_original) {
        if (form_data_original.hasOwnProperty(i)) {
          if(inputPassword.indexOf(form_data_original[i].name.toLowerCase()) == -1){
            form_data.push(form_data_original[i]);
          }
        }
      }
      var identificador_obj = {
        'name': 'identificador',
        'value': self.identificador
      },
      token_obj = {
        'name': 'token_rdstation',
        'value': self.token_rdstation
      },
      c_utmz_obj = {
        'name': 'c_utmz',
        'value': read_cookie('__utmz')
      };
      form_data.push(identificador_obj, token_obj, c_utmz_obj);
      for (var j in form_data) {
        if (form_data.hasOwnProperty(j)) {
          if(inputEmail.indexOf(form_data[j].name.toLowerCase()) != -1){
            form_data[j].name = 'email';
            postData(form, form_data);
            event.preventDefault();
            return;
          }
        }
      }
    });
  }

  function postData(form, form_data) {
    $jQueryRD.ajax({
      type: 'POST',
      url: 'https://www.rdstation.com.br/api/1.2/conversions',
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
}

/**
  @param {string} token_rdstation - RD Station API Token
  @param {string} identificador - Conversion's event name which will be posted to RD Station
*/
function RDStationFormIntegration(token_rdstation, identificador) {
  var integration = new RdJsIntegration(token_rdstation, identificador);
  integration.doIt();
}
