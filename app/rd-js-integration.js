var RdJsIntegration = (function($){
  var token_rdstation = "",
      identifier = "",
      custom_params = {},
      form,
      REJECTEDFIELDS = ['captcha','_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
      COMMONEMAILFIELDS = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
  
  _integrate = function() {
    setToken_rdstation(token_rdstation);
    setIdentifier(identifier);
    setCustom_params(custom_params);

  },
  
  setToken_rdstation = function(token_rdstation) {
    this.token_rdstation = token_rdstation;
  }
 
  setIdentifier = function(identifier) {
    this.identifier = identifier;
  }
 
  setCustom_params = function(custom_params) {
 
  }
 
  loadScript = function(scriptSource, callback) {
    var oHead = document.getElementsByTagName('head')[0],
      oScript = document.createElement('script');

    oScript.type = 'text/javascript';
    oScript.src = scriptSource;
    // most browsers
    oScript.onload = callback;
    // IE 6 & 7
    oScript.onreadystatechange = function() {
      if (this.readyState == 'complete') {
        callback();
      }
    };
    oHead.appendChild(oScript);
  }
  
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
  }

  prepareData = function() {
    $(':submit').click(function(event) {
      form = findForm(this);
      if (!form) {
        return;
      }
      var inputs = getClearInputs();
          fields = getClearFields(inputs);
      if (!findEmail(fields)){
        return;
      }

      accountSetttings = getAccountSettings(); 
      fields.push(accountSetttings.identifier, accountSetttings.token, accountSetttings.c_utmz);
      _post(fields);
      event.preventDefault();
      return;
    });
  }
  }

  findForm = function(button) {
    $(button).closest('form');
      if (!form) {
        return;
      }
  }
 
  getNotAllowedInputs = function() {
    return REJECTEDFIELDS;
  }

  getCommonEmailFields = function() {
    return COMMONEMAILFIELDS;
  }

  isHidden = function(element) { 
    return $(element).is("input[type=hidden]"); 
  }

  isPassword = function(element) {
    return $(element).is("input[type=password]"); 
  }

  getClearInputs = function(){
    var inputs = $(form).find('input'); 
    inputs = inputs.map(function() {
      if (!(isHidden(this) || isPassword(this))) { return this; }
    });
    return inputs;
  }

  getClearFields = function(inputs) {
      var notAllowedInputs = getNotAllowedInputs(),
          currentInput,
          fields = [];
      inputs = inputs.serializeArray();

      for (var i in inputs) {
        currentInput = inputs[i].name.toLowerCase();
        if (inputs.hasOwnProperty(i)) {
          if (notAllowedInputs.indexOf(currentInput) == -1){
            fields.push(currentInput);
          }
        }
      }
      return fields;
  }  

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
  }

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
  }

  isEmail = function() {

  }

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
  }


  return {
    Integrate: _integrate,
    Post: _post,
  };
 
})(jQuery);
 
 
 
 
function RdJsIntegration(token_rdstation, identificador){
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
 
  function prepareData() {
    
    $(':submit').click(function(event) {
      var inputPassword = ['captcha','_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
          inputEmail = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
          form_data_original = [],
          form_data = [],
          form;
      form = $(this).closest('form');
      if (!form) {
        return;
      }
      function isHidden(element) { return $(element).is("input[type=hidden]"); }
      function isPassword(element) { return $(element).is("input[type=password]"); }
      var inputs = $(form).find('input');
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
    $.ajax({
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