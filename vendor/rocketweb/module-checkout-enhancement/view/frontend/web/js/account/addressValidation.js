/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'jquery/ui',
    'validation',
    'Magento_Customer/js/addressValidation'
], function ($) {
    'use strict';

    $.widget('rocketweb.addressValidation', $.mage.addressValidation, {

        /**
         * Validation creation
         * @protected
         */
        _create: function () {
            var button = $(this.options.selectors.button, this.element);

            this.element.validation({
                "ignore": ":hidden:not(.validate-require)",
                
                /**
                 * Submit Handler
                 * @param {Element} form - address form
                 */
                submitHandler: function (form) {

                    button.attr('disabled', true);
                    form.submit();
                }
            });
        }
    });

    return $.rocketweb.addressValidation;
});
