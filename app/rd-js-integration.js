var RdIntegration = (function () {
  'use strict';
  var $form,
    $token_rdstation,
    $identifier,
    $options,
    $accountSettings,

    REJECTED_FIELDS = ['captcha', '_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
    COMMON_EMAIL_FIELDS = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
    $,

    _withjQuery = function (callback) {
      if (typeof jQuery === "undefined") {
        _loadScript("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", callback);
      } else {
        callback();
      }
    },

    _integrate = function (token_rdstation, identifier, options) {
      _withjQuery(function () {
        $ = jQuery;
        _setParams(token_rdstation, identifier, options);
        _bindSubmitCallback();
      });
    },

    _setParams = function (token_rdstation, identifier, options) {
      $options = options || {};
      $token_rdstation = token_rdstation;
      $identifier = identifier;
    },

    _loadScript = function (scriptSource, callback) {
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

    _bindSubmitCallback = function () {
      $(':submit').click(_submitClickHandler);
    },

    _submitClickHandler = function (event) {
      $accountSettings = _getAccountSettings();

      $form = _findForm(event.target);
      if (!$form) {
        return;
      }

      var inputs =  _prepareFormData();

      if (!_findEmail(inputs)) {
        return;
      }

      if (typeof $form[0].checkValidity === 'function') {
        if (!$form[0].checkValidity()) {
          return;
        }
      }
      _post(inputs, _submitForm);
      event.preventDefault();


    },

    _findForm = function (button) {
      return $(button).closest('form');
    },

    _prepareFormData = function () {
      var inputs = $($form).find(':input');
      inputs = _removeNotAllowedFields(inputs);
      inputs = inputs.serializeArray();
      inputs = _fieldMap(inputs);
      inputs.push($accountSettings.identifier, $accountSettings.token, $accountSettings.c_utmz, _getReferrer(), _getQueryParams());
      return inputs;
    },

    _fieldMap = function (inputs) {
      if ($options.fieldMapping) {
        inputs = _translateFields(inputs);
      }
      return inputs;
    },

    _translateFields = function (inputs) {
      $.each(inputs, function() {
        var newName = $options.fieldMapping[this.name];
        if (newName) {
          this.name = newName;
        }
      });
      return inputs;
    },

    _submitForm = function () {
      $form.submit();
    },

    _isPassword = function (element) {
      return $(element).is(":password");
    },

    _removeNotAllowedFields = function (inputs) {
      inputs = inputs.map(function () {
        if (_isAllowedField(this)) {
          return this;
        }
      });
      return inputs;
    },

    _isAllowedField = function (element) {
      return _isEmailField(element) || !(_isPassword(element) || _isRejectedField(element));
    },

    _isRejectedField = function (element) {
      var name = $(element).attr('name') || "";
      return (name && REJECTED_FIELDS.indexOf(name.toLowerCase()) >= 0);
    },

    _getAccountSettings = function () {
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
          value: _read_cookie('__utmz')
        }
      };
    },

    _findEmail = function (fields) {
      var found = false;
      $.each(fields, function () {
        if (_isEmailField(this)) {
          this.name = 'email';
          found = true;
          return false;
        }
      });
      return found;
    },

    _isEmailField = function (field) {
      return COMMON_EMAIL_FIELDS.indexOf(field.name.toLowerCase()) >= 0;
    },

    _read_cookie = function (name) {
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

    _getCookieId = function () {
      var leadTrackingCookie = _read_cookie("rdtrk");
      if (leadTrackingCookie !== null) {
       leadTrackingCookie = JSON.parse(unescape(leadTrackingCookie));
       return leadTrackingCookie.id;
      }
    },

    _insertClientId = function(formData){
      var client_id = _getCookieId();
      if (typeof client_id !== "undefined") {
        formData.push({name: 'client_id', value: client_id});
      }
      return formData;
    },

    _getReferrer = function() {
      return {
        name: 'referrer',
        value: document.referrer
      };
    },

    _getQueryParams = function() {
      return {
        name: 'query_params',
        value: location.search.substring(1)
      };
    },

    _post = function (formData, callback) {
      formData = _insertClientId(formData);
      _withjQuery(function () {
        jQuery.ajax({
          type: 'POST',
          url: 'https://www.rdstation.com.br/api/1.2/conversions',
          data: formData,
          crossDomain: true,
          error: function (response) {
            console.log(response);
          },
          complete: function () {
            if (callback) {
              callback();
            }
          }
        });
      });
    };

  return {
    integrate: _integrate,
    post: _post
  };

}());

function RDStationFormIntegration(token_rdstation, identifier, options) {
  'use strict';
  RdIntegration.integrate(token_rdstation, identifier, options);
}
