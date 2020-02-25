/**
 * Rocke tWeb
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category  RocketWeb
 * @package   RocketWeb_CheckoutEnhacement
 * @copyright Copyright (c) 2016-2017 RocketWeb (http://rocketweb.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author    Rocket Web Inc.
 */
define(['jquery'], function ($) {
    'use strict';

    return function (config, element) {
        var search_area = $(element).closest('form').find(config.search_area),
            complete_form = $(element).closest('form').find(config.complete_form),
            buttons = $(element).find('> a');

        buttons.on('click', function () {
            var el = $(this);
            
            buttons.removeClass('active');
            el.addClass('active');
            if (el.hasClass('google-auto-address')) {
                //show search input
                search_area.show();
                if (!complete_form.hasClass('complete')) {
                    complete_form.hide();
                }
            } else {
                search_area.hide();
                complete_form.show();
            }
        });
    };
});
