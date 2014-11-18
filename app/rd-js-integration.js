var RdIntegration = (function () {
  'use strict';
  var $form,
    $token_rdstation,
    $identifier,
    $custom_params,
    $accountSettings,

    FORM_NOT_FOUND_ERROR = 'FORM_NOT_FOUND_ERROR',
    EMAIL_FIELD_NOT_FOUND_ERROR = 'EMAIL_FIELD_NOT_FOUND_ERROR',

    REJECTED_FIELDS = ['captcha', '_wpcf7', '_wpcf7_version', '_wpcf7_unit_tag', '_wpnonce', '_wpcf7_is_ajax_call', '_wpcf7_locale'],
    COMMON_EMAIL_FIELDS = ['email', 'e-mail', 'e_mail', 'email_lead', 'your-email'],
    $,

    _withjQuery = function(callback) {
      if (typeof jQuery === "undefined") {
        _loadScript("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", callback);
      } else {
        callback();
      }
    },

    _integrate = function (token_rdstation, identifier, custom_params) {
      _withjQuery(function () {
        $ = jQuery;
        _setParams(token_rdstation, identifier, custom_params);
        _bindSubmitCallback();
      });
    },

    _setParams = function (token_rdstation, identifier, custom_params) {
      $custom_params = custom_params || {};
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
      inputs.push($accountSettings.identifier, $accountSettings.token, $accountSettings.c_utmz);
      return inputs;
    },

    _submitForm = function () {
      $form.submit();
    },

    _isHidden = function (element) {
      return $(element).is(":hidden");
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
      return !(_isHidden(element) || _isPassword(element) || _isRejectedField(element));
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

    _post = function (formData, callback) {
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

function RDStationFormIntegration(token_rdstation, identifier, custom_params) {
  'use strict';
  RdIntegration.integrate(token_rdstation, identifier, custom_params);
}
