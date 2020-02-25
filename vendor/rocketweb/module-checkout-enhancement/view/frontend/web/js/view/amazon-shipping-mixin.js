define([
    'jquery',
    'Magento_Customer/js/model/customer',
    'Amazon_Payment/js/model/storage'
], function ($, customer, amazonStorage) {
    'use strict';
    var mixin = {
        setShippingInformation: function () {
            if (amazonStorage.isAmazonAccountLoggedIn() && customer.isLoggedIn()) {
            } else if (amazonStorage.isAmazonAccountLoggedIn() && !customer.isLoggedIn()) {
            } else {

                //if using guest checkout or guest checkout with amazon pay we need to use the main validation
                if (!this.validateShippingInformation()) {
                    var errorElement = $("main #rw-google-complete-form div[class*='mage-error']");

                    if(errorElement.length) {
                        //show shipping form
                        $('#rw-google-complete-form').addClass('complete').show();
                    }
                }
            }
            this._super();
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});