var RdIntegration = (function(){
  var token_rdstation = "",
      identifier = "",
      custom_params = {},
      form,
      REJECTEDFIELDS = ['captcha','_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
      COMMONEMAILFIELDS = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
      $,
  
  _integrate = function(token_rdstation, identifier, custom_params) {
    setToken_rdstation(token_rdstation);
    setIdentifier(identifier);
    setCustom_params(custom_params);
    if(typeof jQuery == "undefined"){
     loadScript("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", prepareData);
    }else{
      prepareData();
    }
    // loadScript("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", prepareData);
  },
  
  setToken_rdstation = function(token) {
    token_rdstation = token;
  };
 
  setIdentifier = function(ident) {
    identifier = ident;
  };
 
  setCustom_params = function(params) {
    custom_params = params;
  };
 
  loadScript = function(scriptSource, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSource;
    // most browsers
    script.onload = callback;
    // IE 6 & 7
    script.onreadystatechange = function() {
      if (this.readyState == 'complete') {
        callback();
      }
    };
    head.appendChild(script);
  };
  
  prepareData = function() {
    $ = jQuery;
    $(':submit').click(function(event) {
      var inputs;
      form = findForm(this);
      if (!form) {
        return;
      }
      inputs = getClearInputs();
      inputs = getClearFields(inputs);
      if (!findEmail(inputs)){
        return;
      }
      accountSetttings = getAccountSettings(); 
      inputs.push(accountSetttings.identifier, accountSetttings.token, accountSetttings.c_utmz);
      _post(inputs);
      event.preventDefault();
      return;
    });
  };

  findForm = function(button) {
    return $(button).closest('form');
  };
 
  getNotAllowedInputs = function() {
    return REJECTEDFIELDS;
  };

  getCommonEmailFields = function() {
    return COMMONEMAILFIELDS;
  };

  isHidden = function(element) { 
    return $(element).is("input[type=hidden]"); 
  };

  isPassword = function(element) {
    return $(element).is("input[type=password]"); 
  };

  getClearInputs = function(){
    var inputs = $(form).find('input'); 
    inputs = inputs.map(function() {
      if (!(isHidden(this) || isPassword(this))) { return this; }
    });
    return inputs;
  };

  getClearFields = function(inputs) {
      var notAllowedInputs = getNotAllowedInputs(),
          currentInput,
          fields = [];
      inputs = inputs.serializeArray();

      for (var i in inputs) {
        currentInput = inputs[i].name.toLowerCase();
        if (inputs.hasOwnProperty(i)) {
          if (notAllowedInputs.indexOf(currentInput) == -1){
            fields.push(inputs[i]);
          }
        }
      }
      return fields;
  };

  getAccountSettings = function() { 
     return { 
      identifier: {
        name : 'identificador',
        value: identifier
      },
      token: {
        name: 'token_rdstation',
        value: token_rdstation
      },        
      c_utmz: {
        name: 'c_utmz',
        value: read_cookie('__utmz')
      }
    };
  };

  findEmail = function(fields) {
    var commonEmailFields = getCommonEmailFields(),
        currentField;
    for (var j in fields) {
      currentField = fields[j].name.toLowerCase();
      if (fields.hasOwnProperty(j)) {
        if(commonEmailFields.indexOf(currentField) != -1){
          fields[j].name = 'email';
          return true;
        }
      }
    }
    return false;
  };

  var read_cookie = function(name) {
    name = name + '=';
    var cookies = document.cookie.split(';');
    for (var d = 0; d < cookies.length; d++) {
      var cookie = cookies[d];
      while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  };

  _post = function(formData) {
    $.ajax({
      type: 'POST',
      url: 'https://www.rdstation.com.br/api/1.2/conversions',
      data: formData,
      crossDomain: true,
      error: function(response) {
        console.log(response);
      },
      complete: function() {
        form.submit();
      }
    });
  };

  return {
    Integrate: _integrate,
    Post: _post,
  };
 
})();
 
// function RdJsIntegration(token_rdstation, identificador){
//   var $jQueryRD;
//   var self = this;
//   this.token_rdstation = token_rdstation;
//   this.identificador = identificador;

//   this.doIt = function(){
//     if(typeof jQuery == "undefined"){
//      // loadScript("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", prepareData);
//      // RdIntegration.Integrate();
//     }else{
//       prepareData();
//     }
//   };

//   function loadScript(sScriptSrc, oCallback) {
//     var oHead = document.getElementsByTagName('head')[0];
//     var oScript = document.createElement('script');
//     oScript.type = 'text/javascript';
//     oScript.src = sScriptSrc;
//     // most browsers
//     oScript.onload = oCallback;
//     // IE 6 & 7
//     oScript.onreadystatechange = function() {
//       if (this.readyState == 'complete') {
//         oCallback();
//       }
//     };
//     oHead.appendChild(oScript);
//   }

//   //GOOGLE ANALYTICS
//   function read_cookie(a) {
//     var b = a + '=';
//     var c = document.cookie.split(';');
//     for (var d = 0; d < c.length; d++) {
//       var e = c[d];
//       while (e.charAt(0) == ' ') e = e.substring(1, e.length);
//       if (e.indexOf(b) === 0) {
//         return e.substring(b.length, e.length);
//       }
//     }
//     return null;
//   }
//   //

//   function prepareData() {
//     $jQueryRD = jQuery;
//     $jQueryRD(':submit').click(function(event) {
//       var inputPassword = ['captcha','_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
//           inputEmail = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
//           form_data_original = [],
//           form_data = [],
//           form;
//       form = $jQueryRD(this).closest('form');
//       if (!form) {
//         return;
//       }
//       function isHidden(element) { return $jQueryRD(element).is("input[type=hidden]"); }
//       function isPassword(element) { return $jQueryRD(element).is("input[type=password]"); }
//       var inputs = $jQueryRD(form).find('input');
//       inputs = inputs.map(function() {
//         if (!(isHidden(this) || isPassword(this))) { return this; }
//       });
//       form_data_original = inputs.serializeArray();
//       for (var i in form_data_original) {
//         if (form_data_original.hasOwnProperty(i)) {
//           if(inputPassword.indexOf(form_data_original[i].name.toLowerCase()) == -1){
//             form_data.push(form_data_original[i]);
//           }
//         }
//       }
//       var identificador_obj = {
//         'name': 'identificador',
//         'value': self.identificador
//       },
//       token_obj = {
//         'name': 'token_rdstation',
//         'value': self.token_rdstation
//       },
//       c_utmz_obj = {
//         'name': 'c_utmz',
//         'value': read_cookie('__utmz')
//       };
//       form_data.push(identificador_obj, token_obj, c_utmz_obj);
//       for (var j in form_data) {
//         if (form_data.hasOwnProperty(j)) {
//           if(inputEmail.indexOf(form_data[j].name.toLowerCase()) != -1){
//             form_data[j].name = 'email';
//             postData(form, form_data);
//             event.preventDefault();
//             return;
//           }
//         }
//       }
//     });
//   }

//   function postData(form, form_data) {
//     $jQueryRD.ajax({
//       type: 'POST',
//       url: 'https://www.rdstation.com.br/api/1.2/conversions',
//       data: form_data,
//       crossDomain: true,
//       error: function(response) {
//         console.log(response);
//       },
//       complete: function() {
//         form.submit();
//       }
//     });
//   }
// }

// /**
//   @param {string} token_rdstation - RD Station API Token
//   @param {string} identificador - Conversion's event name which will be posted to RD Station
// */
// function RDStationFormIntegration(token_rdstation, identificador) {
//   var integration = new RdJsIntegration(token_rdstation, identificador);
//   integration.doIt();
// }