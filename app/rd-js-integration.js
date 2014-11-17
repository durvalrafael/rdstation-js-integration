var RdIntegration = (function () {
  'use strict';
  var $form,
    $token_rdstation,
    $identifier,
    $custom_params,

    REJECTED_FIELDS = ['captcha', '_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
    COMMON_EMAIL_FIELDS = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
    $,

    _integrate = function (token_rdstation, identifier, custom_params) {
      setParams(token_rdstation, identifier, custom_params);

      if (typeof jQuery === "undefined") {
        loadScript("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", prepareData);
      } else {
        prepareData();
      }
    },

    setParams = function (token_rdstation, identifier, custom_params) {
      $custom_params = custom_params || {};
      $token_rdstation = token_rdstation;
      $identifier = identifier;
    },

    loadScript = function (scriptSource, callback) {
      var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');

      script.type = 'text/javascript';
      script.src = scriptSource;
      // most browsers
      script.onload = callback;
      // IE 6 & 7
      script.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          callback();
        }
      };
      head.appendChild(script);
    },

    prepareData = function () {
      $ = jQuery;
      $(':submit').click(function (event) {
        submitClickHandler(event);
        return;
      });
    },

    submitClickHandler = function (event) {
      var inputs, accountSettings;

      $form = findForm(this);
      if (!$form) {
        return;
      }
      inputs = getClearInputs();
      inputs = getClearFields(inputs);
      if (!findEmail(inputs)) {
        return;
      }
      accountSettings = getAccountSettings();
      inputs.push(accountSettings.identifier, accountSettings.token, accountSettings.c_utmz);
      _post(inputs);
      event.preventDefault();
    },

    findForm = function (button) {
      return $(button).closest('form');
    },


    isHidden = function (element) {
      return $(element).is("input[type=hidden]");
    },

    isPassword = function (element) {
      return $(element).is("input[type=password]");
    },

    getClearInputs = function () {
      var inputs = $($form).find('input');
      inputs = inputs.map(function () {
        if (!(isHidden(this) || isPassword(this))) { return this; }
      });
      return inputs;
    },

    getClearFields = function (inputs) {
      var currentInput,
        fields = [],
        i;

      inputs = inputs.serializeArray();

      for (i in inputs) {
        if (inputs.hasOwnProperty(i)) {
          currentInput = inputs[i].name.toLowerCase();
          if (REJECTED_FIELDS.indexOf(currentInput) === -1) {
            fields.push(inputs[i]);
          }
        }
      }
      return fields;
    },

    getAccountSettings = function () {
      return {
        identifier: {
          name : 'identificador',
          value: $identifier
        },
        token: {
          name: 'token_rdstation',
          value: $token_rdstation
        },
        c_utmz: {
          name: 'c_utmz',
          value: read_cookie('__utmz')
        }
      };
    },

    findEmail = function (fields) {
      var currentField,
        j;

      for (j in fields) {
        if (fields.hasOwnProperty(j)) {
          currentField = fields[j].name.toLowerCase();
          if (COMMON_EMAIL_FIELDS.indexOf(currentField) !== -1) {
            fields[j].name = 'email';
            return true;
          }
        }
      }
      return false;
    },

    read_cookie = function (name) {
      var cookies = document.cookie.split(';'),
        d,
        cookie;

      name = name + '=';

      for (d = 0; d < cookies.length; d++) {
        cookie = cookies[d];
        while (cookie.charAt(0) === ' ') { cookie = cookie.substring(1, cookie.length); }
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      return null;
    },

    _post = function (formData) {
      $.ajax({
        type: 'POST',
        url: 'https://www.rdstation.com.br/api/1.2/conversions',
        data: formData,
        crossDomain: true,
        error: function (response) {
          console.log(response);
        },
        complete: function () {
          $form.submit();
        }
      });
    };

  return {
    Integrate: _integrate,
    Post: _post
  };

}());

function RDStationFormIntegration(token_rdstation, identifier, custom_params) {
  'use strict';
  RdIntegration.Integrate(token_rdstation, identifier, custom_params);
}
