/**
 * RocketWeb
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category  RocketWeb
 * @package   RocketWeb_CrossOrigin
 * @copyright Copyright (c) 2016-2017 RocketWeb (http://rocketweb.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author    Rocket Web Inc.
 */
define([
    'jquery'
], function ($) {
    'use strict';
    var autocomplete,
        componentForm = {
        street_number: {type:'long_name'},
        route: {type:'long_name', field: 'street'},
        locality: {type:'long_name', field: 'city'},
        administrative_area_level_1: {type:'long_name', field:'region'},
        country: {type:'long_name', field:'country'},
        postal_code: {type: 'short_name', field:'zip'}
    };

    return function(config, element) {
        var defaults = {
            addressFormSelector: '#rw-google-complete-form',
            restrictCountry: ["US"],
            searchInput: 'rw-google-autocomplete'
        };
        config = $.extend(defaults, config);
        var addressForm  = $(config.addressFormSelector),
            addressData = addressForm.find('input, select:not("#country")'),
            fillInAddress = function () {
                var self = this;
                // Get the place details from the autocomplete object.
                var place = autocomplete.getPlace();
                for (var component in componentForm) {
                    var el = addressForm.find('.'+componentForm[component].field);
                    if(el.length) {
                        el = el.find('input,select');
                    }
                    $(el).val('').change();
                    $(el).prop("disabled", false);
                    addressForm.removeClass('complete');
                }

                // Get each component of the address from the place details
                // and fill the corresponding field on the form.
                var region = '', street_address = '', postcode = '';
                if (typeof place.address_components !== "undefined") {
                    //we should change country_id first
                    //then merge street_number and route
                    for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];
                        if (typeof componentForm[addressType] !== "undefined" && typeof  componentForm[addressType].type !== "undefined") {
                            var val = place.address_components[i][componentForm[addressType].type],
                                el;
                            if (addressType == 'street_number' || addressType == 'route') {
                                if (street_address.length == 0) {
                                    street_address = val;
                                } else {
                                    street_address = street_address + ' ' + val;
                                }
                            } else if (addressType == 'administrative_area_level_1') {
                                // we should save it and set after regionUpdater run
                                region = val;
                            } else if (addressType == 'country') {
                                //select
                                el = addressForm.find('.'+componentForm[addressType].field+' select')[0];
                                var option_select = $(el).find('option').filter(function () {
                                    return $(this).html() == val;
                                });
                                $(option_select).attr('selected', 'selected');
                                $(el).val($(option_select).val()).change();
                            } else if (addressType == 'postal_code') {
                                postcode = val;
                            } else {
                                // input
                                el = addressForm.find('.'+componentForm[addressType].field+' input');
                                $(el).val(val).change();
                            }
                        }
                    }

                    //fill region
                    el = addressForm.find('.' + componentForm["administrative_area_level_1"].field + ' input');
                    if ($(el).is(":hidden")) {
                        //select
                        var el_select = addressForm.find('.' + componentForm["administrative_area_level_1"].field + ' select')[0],
                            option_select = $(el_select).find("option:contains(" + region + ")");
                        $(option_select).attr('selected', 'selected');
                        if ($(option_select).val() == undefined) {
                            el = $(el).find('input')[0];
                            $(el).val(region).change();
                        } else {
                            $(el_select).val($(option_select).val()).change();
                        }
                    } else {
                        //input
                        el = $(el).find('input')[0];
                        $(el).val(region).change();
                    }

                    //fill street
                    el = addressForm.find('.'+ componentForm["route"].field + ' input')[0];
                    $(el).val(street_address).change();

                    //fill postcode
                    el = addressForm.find('.' + componentForm["postal_code"].field + ' input')[0];
                    $(el).val(postcode).change();

                    //show form
                    addressForm.addClass('complete').show();
                }
            };
        $(addressData).addClass('validate-require');
        $.validator.addMethod('required-if-other-address-fields-hidden', function (value, element) {
            if (!$(config.addressFormSelector+':visible').length) {
                if($.mage.isEmpty(value)) {
                    return false;
                } else {
                    addressForm.show();
                }
            }
            return true;
        }, $.mage.__('This is a required field'));
        addressData=_.filter(addressData, function(num){
            return $(num).val()!=='';
        });
        if (addressData.length)
        {
            //show form
            $(addressForm).addClass('complete').show();
        }
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (document.getElementById(config.searchInput)),
            {types: ['geocode'], componentRestrictions: {country: config.restrictCountry}});
        //
        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress.bind(this));

        // need to stop prop of the touchend event
        $('.pac-container').on('touchend', function(e) {
            e.stopImmediatePropagation();
        });

        $('#'+config.searchInput).keypress(
            function(event){
                if (event.which == '13') {
                    event.preventDefault();
                }


            });
    };
});
