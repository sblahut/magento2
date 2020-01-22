define([
    'jquery'
], function ($) {
    'use strict';

    var mixin = {
        setShippingInformation: function () {
            if (!this.validateShippingInformation()) {
                var errorElement = $("#rw-google-complete-form div[class*='mage-error'], #rw-google-complete-form div[class*='field-error']");
                if(errorElement.length) {
                    $('#rw-google-complete-form').addClass('complete').show();
                }
            }
            this._super();
        },
        saveNewAddress: function () {
            this._super();

            if (this.source.get('params.invalid')) {
                var errorElement = $(".modal-popup._show #rw-google-complete-form div[class*='field-error'], .modal-popup._show #rw-google-complete-form div[class*='mage-error']");
                if(errorElement.length) {
                    $('#rw-google-complete-form').addClass('complete').show();
                }
            }
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
